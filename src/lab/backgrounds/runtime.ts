/**
 * Shared runtime for /lab background drafts.
 * Lifecycle: lab.astro dispatches `lab:activate` / `lab:deactivate` window
 * events (detail.id) and mirrors the active id on window.__labActiveId so
 * drafts registered after the initial dispatch still start.
 */

export interface LabInstance {
  /** Called each animation frame with accumulated time (s) and delta (s). */
  frame: (time: number, dt: number) => void;
  /** Frames to run once under prefers-reduced-motion (default 1). */
  reducedFrames?: number;
}

export function registerLab(id: string, create: () => LabInstance | null) {
  let inst: LabInstance | null = null;
  let tried = false;
  let active = false;
  let raf = 0;
  let last = 0;
  let time = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    time += dt;
    inst!.frame(time, dt);
  }

  function start() {
    if (!tried) {
      tried = true;
      inst = create();
    }
    if (!inst) return;
    if (reduced) {
      const n = inst.reducedFrames ?? 1;
      for (let i = 0; i < n; i++) {
        time += 1 / 60;
        inst.frame(time, 1 / 60);
      }
      return;
    }
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  window.addEventListener("lab:activate", (e) => {
    if ((e as CustomEvent).detail?.id !== id) return;
    active = true;
    start();
  });
  window.addEventListener("lab:deactivate", (e) => {
    if ((e as CustomEvent).detail?.id !== id) return;
    active = false;
    stop();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (active) start();
  });

  if ((window as unknown as { __labActiveId?: string }).__labActiveId === id) {
    active = true;
    start();
  }
}

// ---------------------------------------------------------------- WebGL2

export function getGL(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
  });
  if (!gl) console.error("lab: WebGL2 not available");
  return gl;
}

const DEFAULT_VS = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export function buildProgram(
  gl: WebGL2RenderingContext,
  fs: string,
  vs: string = DEFAULT_VS,
): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("lab shader error:", gl.getShaderInfoLog(sh), src);
      return null;
    }
    return sh;
  };
  const v = compile(gl.VERTEX_SHADER, vs);
  const f = compile(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("lab link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

/** Draw the attribute-less fullscreen triangle (pairs with DEFAULT_VS). */
export function drawFullscreen(gl: WebGL2RenderingContext) {
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ---------------------------------------------------------------- sizing

export interface SizeOpts {
  /** Cap on the longer backing-store edge (the Hero.astro MAX_DIM trick). */
  maxDim?: number;
  /** Cap on devicePixelRatio (default 1). */
  dprCap?: number;
}

export function sizeCanvas(canvas: HTMLCanvasElement, opts: SizeOpts = {}) {
  const { maxDim, dprCap = 1 } = opts;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  let scale = Math.min(dprCap, window.devicePixelRatio || 1);
  if (maxDim) {
    const larger = Math.max(w, h) * scale;
    if (larger > maxDim) scale *= maxDim / larger;
  }
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
}

export function onResize(el: Element, cb: () => void) {
  new ResizeObserver(cb).observe(el);
}

// ---------------------------------------------------------------- theme

/** Read a `--color-*` custom property as [r, g, b] in 0–1. */
export function cssColor(name: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (!m) return [0, 0, 0];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const isDark = () => document.documentElement.classList.contains("dark");

export const pageBg = (): [number, number, number] =>
  isDark() ? cssColor("--color-dark") : cssColor("--color-offw");

export function watchTheme(cb: () => void) {
  new MutationObserver(cb).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
}
