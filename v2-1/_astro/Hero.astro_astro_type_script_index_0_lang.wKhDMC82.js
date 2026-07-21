let w=!1;function u(){if(w)return;w=!0;const o=document.getElementById("orbs"),e=o.getContext("webgl")||o.getContext("experimental-webgl");if(!e){console.error("WebGL is not supported in this browser.");return}const m=500,c=.5;function g(){const s=Math.max(o.offsetWidth,o.offsetHeight),f=s>m?s/m:1;o.width=o.offsetWidth/f,o.height=o.offsetHeight/f}g(),addEventListener("resize",g);let l=.024*Math.max(o.width,o.height);o.height>=o.width&&(l*=2);const n=o.width>=o.height?[[o.width*.2,o.height*.2],[o.width*.7,o.height*.3],[o.width*.4,o.height*.6],[o.width*.8,o.height*.8]]:[[o.width*.7,o.height*.3],[o.width*.3,o.height*.8],[o.width*.6,o.height*.4],[o.width*.2,o.height*.2]],C=[[82/255,70/255,1],[62/255,226/255,196/255],[198/255,125/255,1],[170/255,226/255,1]],a=[l,l,l,l],r=[[c,c],[-c,-c],[-c,c],[-c,-c]],R=.5,L=.8*(2/(n.length*.6)),E=`
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `,F=`
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

      float influence = step(u_threshold, totalShapeInfluence);
      float validInfluence = step(0.0, totalShapeInfluence);
      vec3 blendedColor = color / max(totalColorInfluence, 0.001);
      gl_FragColor = vec4(blendedColor * influence * validInfluence, influence);
    }
    `;e.viewport(0,0,o.width,o.height);const d=e.createShader(e.VERTEX_SHADER);e.shaderSource(d,E),e.compileShader(d);const h=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(h,F),e.compileShader(h);const i=e.createProgram();e.attachShader(i,d),e.attachShader(i,h),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)||console.error("Failed to link shader program:",e.getProgramInfoLog(i)),e.useProgram(i);const b=e.getAttribLocation(i,"a_position"),T=e.getUniformLocation(i,"u_resolution"),v=e.getUniformLocation(i,"u_orbPositions"),P=e.getUniformLocation(i,"u_orbColors"),U=e.getUniformLocation(i,"u_orbRadii"),x=e.getUniformLocation(i,"u_threshold"),D=e.getUniformLocation(i,"u_influenceFactor"),y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,y),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0),e.uniform2f(T,o.width,o.height),e.uniform2fv(v,n.flat()),e.uniform3fv(P,C.flat()),e.uniform1fv(U,a),e.uniform1f(x,R),e.uniform1f(D,L);let S=Date.now();function _(){const s=Date.now(),f=(s-S)/20;S=s;const p=o.width,I=o.height;for(let t=0;t<n.length;t++)n[t][0]+=r[t][0]*f,n[t][1]+=r[t][1]*f,n[t][0]-a[t]<0?(n[t][0]=a[t],r[t][0]=-r[t][0]):n[t][0]+a[t]>=p&&(n[t][0]=p-a[t]-1,r[t][0]=-r[t][0]),n[t][1]-a[t]<0?(n[t][1]=a[t],r[t][1]=-r[t][1]):n[t][1]+a[t]>=I&&(n[t][1]=I-a[t]-1,r[t][1]=-r[t][1]);e.uniform2fv(v,n.flat()),e.drawArrays(e.TRIANGLES,0,6),requestAnimationFrame(_)}_()}function B(){return document.querySelector(".text-5xl")!==null}function A(){B()?u():setTimeout(A,50)}document.readyState==="complete"?setTimeout(u,100):(window.addEventListener("load",function(){setTimeout(u,100)}),document.addEventListener("DOMContentLoaded",function(){setTimeout(A,50)}),setTimeout(function(){document.getElementById("orbs").hasAttribute("data-initialized")||(document.getElementById("orbs").setAttribute("data-initialized","true"),u())},1e3));
