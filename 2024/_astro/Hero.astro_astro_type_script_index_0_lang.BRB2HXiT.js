let w=!1;function f(){if(w)return;w=!0;const o=document.getElementById("orbs"),e=o.getContext("webgl")||o.getContext("experimental-webgl");if(!e){console.error("WebGL is not supported in this browser.");return}const m=500,u=.5;function g(){const l=Math.max(o.offsetWidth,o.offsetHeight),s=l>m?l/m:1;o.width=o.offsetWidth/s,o.height=o.offsetHeight/s}g(),addEventListener("resize",g);let c=.024*Math.max(o.width,o.height);o.height>=o.width&&(c*=2);const i=o.width>=o.height?[[o.width*.2,o.height*.2],[o.width*.7,o.height*.3],[o.width*.4,o.height*.6],[o.width*.8,o.height*.8]]:[[o.width*.7,o.height*.3],[o.width*.3,o.height*.8],[o.width*.6,o.height*.4],[o.width*.2,o.height*.2]],A=[[82/255,70/255,1],[62/255,226/255,196/255],[198/255,125/255,1],[170/255,226/255,1]],a=[c,c,c,c],r=[[u,u],[-.5,-.5],[-.5,u],[-.5,-.5]],R=.5,F=.8*(2/(i.length*.6)),L=`
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `,E=`
    precision highp float;

    uniform vec2 u_resolution;
    uniform vec2 u_orbPositions[4];
    uniform vec3 u_orbColors[4];
    uniform float u_orbRadii[4];
    uniform float u_threshold;
    uniform float u_influenceFactor;

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      float totalShapeInfluence = 0.0;
      vec3 totalColorInfluence = vec3(0.0);
      vec3 color = vec3(0.0);

      for (int i = 0; i < 4; i++) {
          vec2 orbPosition = u_orbPositions[i];
          vec3 orbColor = u_orbColors[i];
          float orbRadius = u_orbRadii[i];

          vec2 delta = fragCoord - orbPosition;
          float distanceSquared = dot(delta, delta);
          float colorInfluence = orbRadius * 150.0 / (distanceSquared + 0.00001);

          totalColorInfluence += colorInfluence;
          color += orbColor * colorInfluence;

          float shapeInfluence = colorInfluence;
          if (shapeInfluence < u_threshold) {
              shapeInfluence *= u_influenceFactor;
          }
          totalShapeInfluence += shapeInfluence;
      }

      if (totalShapeInfluence > u_threshold) {
          vec3 blendedColor;
          if (totalShapeInfluence > 0.0) {
              blendedColor = color / totalColorInfluence;
          } else {
              blendedColor = vec3(0.0);
          }
          gl_FragColor = vec4(blendedColor, 1.0);
      } else {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }
    `;e.viewport(0,0,o.width,o.height);const d=e.createShader(e.VERTEX_SHADER);e.shaderSource(d,L),e.compileShader(d);const h=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(h,E),e.compileShader(h);const n=e.createProgram();e.attachShader(n,d),e.attachShader(n,h),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS)||console.error("Failed to link shader program:",e.getProgramInfoLog(n)),e.useProgram(n);const b=e.getAttribLocation(n,"a_position"),T=e.getUniformLocation(n,"u_resolution"),v=e.getUniformLocation(n,"u_orbPositions"),P=e.getUniformLocation(n,"u_orbColors"),U=e.getUniformLocation(n,"u_orbRadii"),x=e.getUniformLocation(n,"u_threshold"),D=e.getUniformLocation(n,"u_influenceFactor"),y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,y),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0),e.uniform2f(T,o.width,o.height),e.uniform2fv(v,i.flat()),e.uniform3fv(P,A.flat()),e.uniform1fv(U,a),e.uniform1f(x,R),e.uniform1f(D,F);let _=Date.now();function S(){const l=Date.now(),s=(l-_)/20;_=l;const C=o.width,p=o.height;for(let t=0;t<i.length;t++)i[t][0]+=r[t][0]*s,i[t][1]+=r[t][1]*s,i[t][0]-a[t]<0?(i[t][0]=a[t],r[t][0]=-r[t][0]):i[t][0]+a[t]>=C&&(i[t][0]=C-a[t]-1,r[t][0]=-r[t][0]),i[t][1]-a[t]<0?(i[t][1]=a[t],r[t][1]=-r[t][1]):i[t][1]+a[t]>=p&&(i[t][1]=p-a[t]-1,r[t][1]=-r[t][1]);e.uniform2fv(v,i.flat()),e.drawArrays(e.TRIANGLES,0,6),requestAnimationFrame(S)}S()}function B(){return document.querySelector(".text-5xl")!==null}function I(){B()?f():setTimeout(I,50)}document.readyState==="complete"?setTimeout(f,100):(window.addEventListener("load",function(){setTimeout(f,100)}),document.addEventListener("DOMContentLoaded",function(){setTimeout(I,50)}),setTimeout(function(){document.getElementById("orbs").hasAttribute("data-initialized")||(document.getElementById("orbs").setAttribute("data-initialized","true"),f())},1e3));
