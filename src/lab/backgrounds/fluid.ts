/**
 * Shared curl-noise dye simulation (ping-pong, WebGL2).
 * Used by FluidDots (lab + site hero) and TypeMask; InkFlow keeps its own copy.
 */
import {
  buildProgram, drawFullscreen, getGL, sizeCanvas, onResize,
  pageBg, isDark, watchTheme,
  type LabInstance,
} from "./runtime";
import { GLSL_HEADER, GLSL_NOISE2 } from "./glsl";

const ADVECT_FS = `${GLSL_HEADER}
${GLSL_NOISE2}
uniform sampler2D u_dye;
uniform vec2 u_res;
uniform float u_t, u_dt;
uniform vec2 u_pointer, u_pointerVel;
uniform float u_inject;
uniform vec3 u_dyeColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 asp = vec2(u_res.x / u_res.y, 1.0);

  vec2 np = uv * asp * 2.6 + vec2(u_t * 0.02, -u_t * 0.015);
  float e = 0.02;
  float nU = fbm(np + vec2(0.0, e)), nD = fbm(np - vec2(0.0, e));
  float nR = fbm(np + vec2(e, 0.0)), nL = fbm(np - vec2(e, 0.0));
  vec2 vel = vec2((nU - nD), -(nR - nL)) / (2.0 * e) * 0.075;

  vec2 pd = (uv - u_pointer) * asp;
  float g = exp(-dot(pd, pd) / 0.006);
  vel += u_pointerVel * g * 2.0;

  vec3 dye = texture(u_dye, uv - vel * u_dt).rgb * 0.997;
  dye = max(dye - 0.008 * u_dt, 0.0);
  // saturating injection: cells asymptote toward full instead of piling all
  // three channels to white — the first hue to fill a cell locks it
  float room = clamp(1.0 - max(dye.r, max(dye.g, dye.b)), 0.0, 1.0);
  dye += u_dyeColor * g * u_inject * u_dt * 7.0 * room;
  O = vec4(dye, 1.0);
}`;

export interface FluidSim {
  simW: number;
  simH: number;
  /** Advance one step and leave the result bound as the current texture. */
  step(o: {
    t: number;
    dt: number;
    pointer: [number, number];
    pointerVel: [number, number];
    inject: number;
    dye: [number, number, number];
  }): void;
  texture(): WebGLTexture;
}

export function createFluidSim(
  gl: WebGL2RenderingContext,
  stageW: number,
  stageH: number,
  longEdge = 384,
): FluidSim | null {
  const halfFloat =
    gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float");
  const advect = buildProgram(gl, ADVECT_FS);
  if (!advect) return null;

  const scale = longEdge / Math.max(stageW, stageH, 1);
  const simW = Math.max(8, Math.round(stageW * scale));
  const simH = Math.max(8, Math.round(stageH * scale));

  function makeTarget() {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (halfFloat) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simW, simH, 0, gl.RGBA, gl.HALF_FLOAT, null);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simW, simH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  }
  let src = makeTarget();
  let dst = makeTarget();

  const u = (n: string) => gl.getUniformLocation(advect, n);
  gl.useProgram(advect);
  gl.uniform1i(u("u_dye"), 0);
  gl.uniform2f(u("u_res"), simW, simH);
  const uT = u("u_t"), uDt = u("u_dt"), uP = u("u_pointer"), uPv = u("u_pointerVel");
  const uInj = u("u_inject"), uCol = u("u_dyeColor");

  return {
    simW,
    simH,
    step(o) {
      gl.useProgram(advect);
      gl.uniform1f(uT, o.t);
      gl.uniform1f(uDt, o.dt);
      gl.uniform2f(uP, o.pointer[0], o.pointer[1]);
      gl.uniform2f(uPv, o.pointerVel[0], o.pointerVel[1]);
      gl.uniform1f(uInj, o.inject);
      gl.uniform3f(uCol, o.dye[0], o.dye[1], o.dye[2]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, simW, simH);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      drawFullscreen(gl);
      const tmp = src;
      src = dst;
      dst = tmp;
    },
    texture: () => src.tex,
  };
}

/** Pointer + idle-emitter driver shared by the fluid experiments. */
export function makeFluidDriver(canvas: HTMLCanvasElement, palette: [number, number, number][]) {
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vx: 0, vy: 0, lastMove: -10 };
  let now = 0;
  let colorPhase = 0;
  window.addEventListener("pointermove", (ev) => {
    const r = canvas.getBoundingClientRect();
    if (r.width < 1) return;
    const x = (ev.clientX - r.left) / r.width;
    const y = 1 - (ev.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    pointer.tx = x;
    pointer.ty = y;
    pointer.lastMove = now;
  });

  return function drive(t: number, dt: number) {
    now = t;
    const idle = t - pointer.lastMove > 4;
    let tx = pointer.tx, ty = pointer.ty, inject = 0;
    if (idle) {
      // two alternating emitters on lissajous paths keep the field fed
      const which = Math.floor(t * 0.5) % 2;
      const ph = which * 2.6;
      tx = 0.5 + 0.36 * Math.sin(t * 0.21 + ph);
      ty = 0.5 + 0.32 * Math.sin(t * 0.33 + 1.7 + ph);
      inject = 1;
    } else if (t - pointer.lastMove < 0.15) {
      inject = 1;
    }
    const px = pointer.x, py = pointer.y;
    pointer.x += (tx - pointer.x) * 0.15;
    pointer.y += (ty - pointer.y) * 0.15;
    pointer.vx = (pointer.x - px) / Math.max(dt, 1e-3);
    pointer.vy = (pointer.y - py) / Math.max(dt, 1e-3);

    colorPhase += dt * 0.12;
    const ci = Math.floor(colorPhase) % palette.length;
    const cn = (ci + 1) % palette.length;
    const f = colorPhase - Math.floor(colorPhase);
    const dye = palette[ci].map((v, k) => v + (palette[cn][k] - v) * f) as [number, number, number];

    return {
      pointer: [pointer.x, pointer.y] as [number, number],
      pointerVel: [pointer.vx * 0.05, pointer.vy * 0.05] as [number, number],
      inject,
      dye,
    };
  };
}

// ------------------------------------------------------------------ dots

const DOT_PALETTE: [number, number, number][] = [
  [82 / 255, 70 / 255, 1],
  [44 / 255, 122 / 255, 123 / 255],
  [198 / 255, 125 / 255, 1],
  [62 / 255, 226 / 255, 196 / 255],
];

const DOTS_PRESENT_FS = `${GLSL_HEADER}
uniform sampler2D u_dye;
uniform vec2 u_res;
uniform float u_pitch;
uniform vec3 u_bg;
uniform vec3 u_ink;
uniform float u_alpha;
uniform float u_dark;

void main() {
  vec2 cellId = floor(gl_FragCoord.xy / u_pitch);
  vec2 cc = (cellId + 0.5) * u_pitch;
  vec3 dye = texture(u_dye, cc / u_res).rgb;
  float v = clamp(max(dye.r, max(dye.g, dye.b)) * 1.6, 0.0, 1.0);

  // quantized dot sizes; the grid is always faintly present
  float s = v < 0.04 ? 0.12 : v < 0.14 ? 0.32 : v < 0.4 ? 0.58 : 0.84;
  vec2 f = abs(fract(gl_FragCoord.xy / u_pitch) - 0.5);
  float m = step(max(f.x, f.y), s * 0.5);

  vec3 hue = dye / max(v / 1.6, 1e-4);
  hue = clamp(hue, 0.0, 1.0);
  float aCap = u_alpha;
  if (u_dark < 0.5) {
    // light mode: keep hues fully saturated, but fade alpha as the dye
    // loses chroma — whitish cores become paper showing through, not paint
    float maxc = max(hue.r, max(hue.g, hue.b));
    float minc = min(hue.r, min(hue.g, hue.b));
    float chroma = (maxc - minc) / max(maxc, 1e-4);
    hue *= 0.94;                     // just off paper-white
    aCap *= mix(0.30, 1.0, smoothstep(0.10, 0.55, chroma));
  }
  // color ramp aligned with the size steps: both large sizes stay fully
  // saturated; only the smallest dye-bearing dots fade toward ink
  vec3 dotCol = mix(u_ink, hue, smoothstep(0.04, 0.25, v) * 0.85);
  float a = m * mix(0.25, aCap, smoothstep(0.0, 0.4, v));
  O = vec4(mix(u_bg, dotCol, a), 1.0);
}`;

/**
 * Full fluid-dots background on a canvas: sim + dot presenter + pointer
 * driver + theme/resize plumbing. Returns a LabInstance-shaped handle whose
 * frame(t, dt) advances and draws — usable by the lab runtime or a
 * standalone site loop.
 */
export function mountFluidDots(
  canvas: HTMLCanvasElement,
  opts: { pitchCss?: number } = {},
): LabInstance | null {
  const pitchCss = opts.pitchCss ?? 11;
  const gl = getGL(canvas);
  if (!gl) return null;
  const sim = createFluidSim(gl, canvas.clientWidth, canvas.clientHeight);
  const present = buildProgram(gl, DOTS_PRESENT_FS);
  if (!sim || !present) return null;

  const pu = (n: string) => gl.getUniformLocation(present, n);
  gl.useProgram(present);
  gl.uniform1i(pu("u_dye"), 0);

  function resize() {
    sizeCanvas(canvas, { dprCap: 1 });
    gl!.useProgram(present);
    gl!.uniform2f(pu("u_res"), canvas.width, canvas.height);
    gl!.uniform1f(pu("u_pitch"), pitchCss * (canvas.width / Math.max(canvas.clientWidth, 1)));
  }
  function colors() {
    gl!.useProgram(present);
    gl!.uniform3fv(pu("u_bg"), pageBg());
    gl!.uniform1f(pu("u_dark"), isDark() ? 1 : 0);
    if (isDark()) {
      gl!.uniform3fv(pu("u_ink"), [0.62, 0.63, 0.65]);
      gl!.uniform1f(pu("u_alpha"), 0.8);
    } else {
      // mid-gray ink + capped alpha: the empty grid and low-density dots
      // stay quiet under text
      gl!.uniform3fv(pu("u_ink"), [0.44, 0.44, 0.47]);
      gl!.uniform1f(pu("u_alpha"), 0.72);
    }
  }
  resize();
  colors();
  onResize(canvas, resize);
  watchTheme(colors);

  const drive = makeFluidDriver(canvas, DOT_PALETTE);

  return {
    reducedFrames: 240,
    frame(t: number, dt: number) {
      const o = drive(t, dt);
      sim.step({ t, dt, ...o });

      gl.useProgram(present);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sim.texture());
      drawFullscreen(gl);
    },
  };
}
