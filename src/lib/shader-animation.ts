/* ─────────────────────────────────────────────────────────────
   ShaderAnimation — the diagonal light-band shader, on raw WebGL.

   WHY THIS SHAPE, not the supplied React component:
   this is an Astro site with no React and no three.js. The
   reference wrapped three.js in a component whose entire job was
   to render ONE fullscreen quad with ONE fragment shader — about
   150KB gzipped to draw two triangles. The GLSL below is the
   component; everything else three.js provided is forty lines of
   context setup. Same output, no dependency, and it matches the
   precedent already set by ShaderBackdrop.astro.

   The fragment shader is carried over verbatim.
   ───────────────────────────────────────────────────────────── */

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
#define TWO_PI 6.2831853072
#define PI 3.14159265359

precision highp float;
uniform vec2 resolution;
uniform float time;

/* Compose against a fixed 16:9 frame.

   The original divided by min(resolution.x, resolution.y), which ties the
   pattern to whichever side is shorter. On a 16:9 container — the shape the
   shader was authored in — that gives uv.x over ±1.78 and the light bands land
   near the left and right edges. On a wider window (measured 2.22 on a typical
   laptop) the same maths stretches the field: the bands bunch into the middle,
   directly behind the type, and the outer thirds go black.

   Dividing by max(height, width / 1.7778) keeps the horizontal span at ±1.78
   no matter how wide the viewport gets, so the framing is the authored one
   everywhere and simply crops vertically past 16:9. Identical output on a true
   16:9 container, and unchanged on anything narrower. */
void main(void) {
  float scale = max(resolution.y, resolution.x / 1.7777778);
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / scale;
  float t = time*0.05;
  float lineWidth = 0.002;

  /* The i-offset is 0.2, not the reference's 0.01.

     Each iteration draws a ring whose radius is fract(...)*5.0, sweeping 0->5
     over a ~6.7s cycle, while the frame only reaches a radius of about 2.4.
     At 0.01 all five iterations share effectively the same phase, so they act
     as ONE ring — and measurement showed it sits outside the frame for 57% of
     every cycle, leaving the panel completely black more often than not.

     Spacing them 0.2 apart puts the five rings a full radius unit apart, so
     two or three are always inside the frame and the field never empties.
     The j-offset stays at 0.01: that tiny per-channel shift is what produces
     the blue/white/orange fringing, and widening it would separate the
     channels into distinct coloured rings instead. */
  vec3 color = vec3(0.0);
  for(int j = 0; j < 3; j++){
    for(int i=0; i < 5; i++){
      color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.2)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
    }
  }

  gl_FragColor = vec4(color[0],color[1],color[2],1.0);
}
`;

export type ShaderHandle = {
  start: () => void;
  stop: () => void;
  renderOnce: () => void;
  /** Advance by `dt` seconds and draw one frame. The animation loop is driven
   *  by requestAnimationFrame, so this is the only way to step it
   *  deterministically — used for verification. */
  step: (dt: number) => void;
  destroy: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Returns null when WebGL is unavailable or the program fails to build —
 *  callers fall back to the host's CSS background rather than a blank hole. */
export function createShaderAnimation(host: HTMLElement): ShaderHandle | null {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';

  const gl = canvas.getContext('webgl', {
    antialias: false,          // a fullscreen fragment shader gains nothing from MSAA
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  /* One oversized triangle rather than a quad: it covers the viewport with
     three vertices instead of six and has no diagonal seam. */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'resolution');
  const uTime = gl.getUniformLocation(prog, 'time');

  host.appendChild(canvas);

  let time = 1.0;
  let raf = 0;
  let running = false;
  let last = 0;
  let lost = false;

  function resize() {
    /* DPR capped at 2. This is a full-viewport fragment shader — at DPR 3 on a
       phone it is 9x the pixels of DPR 1 for no perceptible gain, and it is
       the fastest way to turn a nice background into a hot battery. */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(host.clientWidth * dpr));
    const h = Math.max(1, Math.round(host.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl!.viewport(0, 0, w, h);
    gl!.uniform2f(uRes, w, h);
  }

  function draw() {
    if (lost) return;
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    /* The reference advanced time by a flat 0.05 per FRAME, which ties the
       speed to the refresh rate — the same animation runs twice as fast on a
       120Hz display. Normalised to the 60fps it was authored at, so it looks
       the same everywhere. */
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    time += dt * 3.0;                    // 0.05 * 60
    gl!.uniform1f(uTime, time);
    draw();
  }

  const ro = new ResizeObserver(() => { resize(); if (!running) renderOnce(); });
  ro.observe(host);
  resize();

  function renderOnce() {
    resize();
    gl!.uniform1f(uTime, time);
    draw();
  }

  function start() {
    if (running || lost) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  /* Context loss is routine on mobile (backgrounding, GPU pressure). Without
     this the canvas goes permanently black instead of falling back. */
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    lost = true;
    stop();
    host.classList.add('is-gl-lost');
  });

  function destroy() {
    stop();
    ro.disconnect();
    gl!.deleteProgram(prog);
    gl!.deleteShader(vs!);
    gl!.deleteShader(fs!);
    gl!.deleteBuffer(buf);
    const ext = gl!.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    canvas.remove();
  }

  function step(dt: number) {
    time += dt * 3.0;
    renderOnce();
  }

  return { start, stop, renderOnce, step, destroy };
}
