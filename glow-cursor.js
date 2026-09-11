/* ============================================================
   Glow cursor — a WebGL trail that follows the pointer, replacing
   the old dot + ring. Ported from React Bits' GlowCursor component
   (https://reactbits.dev) to vanilla JS/ES modules, since this site
   has no build step and no React. Colors are pulled from the site's
   own silver/monochrome tokens instead of the component's default
   cyan/violet, so it stays inside the existing design system.

   Runs against a local, hand-trimmed copy of ogl (see vendor/ogl/)
   so the strict same-origin CSP never has to allow a CDN.
   ============================================================ */
import { Mesh, Program, Renderer, Triangle } from "./vendor/ogl/index.js";

const MAX_POINTS = 64;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

#define MAX_POINTS 64

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float filmGrain(vec2 p, float time) {
  float frame = time * 18.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = mix(uColor, uSecondaryColor, clamp(strongestCore, 0.0, 1.0));
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  vec3 additiveColor = color * luminance;

  gl_FragColor = vec4(additiveColor, alpha);
}
`;

function hexToRgb(hex) {
  let value = (hex || "").replace("#", "").trim();
  if (value.length === 3) value = value.split("").map((c) => c + c).join("");
  const parsed = Number.parseInt(value || "000000", 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const reduceMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = () =>
  window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;

export function initGlowCursor(options = {}) {
  if (reduceMotion() || isTouch()) return;

  // Brushed-silver tones from styles.css (--accent / --accent-2) so the trail
  // reads as part of the monochrome system rather than an off-brand accent color.
  const config = {
    color: "#eef0f2",
    secondaryColor: "#6c6e76",
    trailLength: 30,
    trailWidth: 5,
    trailTaper: 0.85,
    followSpeed: 0.2,
    glowIntensity: 1.1,
    glowSpread: 0.85,
    hotspot: 0.5,
    brightness: 1.05,
    opacity: 0.8,
    pulseSpeed: 0.5,
    noiseStrength: 0.02,
    idleFade: true,
    idleTimeout: 500,
    fadeDuration: 700,
    blendMode: "screen",
    maxDevicePixelRatio: 1.5,
    ...options,
  };

  const canvas = document.createElement("canvas");
  canvas.className = "glow-cursor-canvas";
  canvas.style.mixBlendMode = config.blendMode;
  document.body.appendChild(canvas);
  document.body.classList.add("has-cursor");

  const renderer = new Renderer({
    canvas,
    alpha: true,
    dpr: Math.min(window.devicePixelRatio || 1, config.maxDevicePixelRatio),
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const pointData = Array(MAX_POINTS * 2).fill(0);
  const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
  const target = { x: 0, y: 0 };
  const head = { x: 0, y: 0 };

  const program = new Program(gl, {
    vertex: VERTEX_SHADER,
    fragment: FRAGMENT_SHADER,
    uniforms: {
      uResolution: { value: [1, 1] },
      uPoints: { value: pointData },
      uPointCount: { value: config.trailLength },
      uColor: { value: hexToRgb(config.color) },
      uSecondaryColor: { value: hexToRgb(config.secondaryColor) },
      uTrailWidth: { value: config.trailWidth },
      uTaper: { value: config.trailTaper },
      uGlowIntensity: { value: config.glowIntensity },
      uGlowSpread: { value: config.glowSpread },
      uHotspot: { value: config.hotspot },
      uBrightness: { value: config.brightness },
      uOpacity: { value: config.opacity },
      uPulseSpeed: { value: config.pulseSpeed },
      uNoiseStrength: { value: config.noiseStrength },
      uTime: { value: 0 },
      uFade: { value: 0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  let initialized = false;
  let pointerInside = false;
  let fade = 0;
  let lastInputTime = performance.now();
  let lastFrameTime = performance.now();

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
  };

  const initializeTrail = (x, y) => {
    target.x = x;
    target.y = y;
    head.x = x;
    head.y = y;
    for (const point of points) {
      point.x = x;
      point.y = y;
    }
    initialized = true;
    fade = 1;
  };

  const updatePointer = (event) => {
    const x = clamp(event.clientX, 0, window.innerWidth);
    const y = window.innerHeight - clamp(event.clientY, 0, window.innerHeight);
    if (!initialized) initializeTrail(x, y);
    target.x = x;
    target.y = y;
    pointerInside = true;
    lastInputTime = performance.now();
  };

  // Ring/dot used to widen on links and buttons; the trail head does the
  // same by briefly thickening, so hover feedback survives the swap.
  const interactive = "a, button, [data-magnetic], [data-tilt], .feature, .stat, .skill-card, input, textarea";
  let hovering = false;
  document.addEventListener("mouseover", (e) => { if (e.target.closest(interactive)) hovering = true; }, { passive: true });
  document.addEventListener("mouseout", (e) => { if (e.target.closest(interactive)) hovering = false; }, { passive: true });

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerenter", updatePointer, { passive: true });
  window.addEventListener("pointerleave", () => { pointerInside = false; lastInputTime = performance.now(); }, { passive: true });
  window.addEventListener("resize", resize);

  const render = (now) => {
    const delta = Math.min((now - lastFrameTime) / 16.667, 3);
    lastFrameTime = now;

    if (initialized) {
      const headEase = 1 - Math.pow(1 - clamp(config.followSpeed, 0.01, 0.99), delta);
      const chainBase = clamp(0.28 + config.followSpeed * 0.35, 0.08, 0.92);
      const chainEase = 1 - Math.pow(1 - chainBase, delta);
      head.x += (target.x - head.x) * headEase;
      head.y += (target.y - head.y) * headEase;
      points[0].x = head.x;
      points[0].y = head.y;

      for (let i = 1; i < MAX_POINTS; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * chainEase;
        points[i].y += (points[i - 1].y - points[i].y) * chainEase;
      }

      for (let i = 0; i < MAX_POINTS; i++) {
        pointData[i * 2] = points[i].x;
        pointData[i * 2 + 1] = points[i].y;
      }
    }

    const idleFor = now - lastInputTime;
    const shouldFade = config.idleFade && (!pointerInside || idleFor > config.idleTimeout);
    const fadeStep = (16.667 * delta) / Math.max(config.fadeDuration, 16);
    const fadeTarget = initialized && !shouldFade ? 1 : 0;
    fade += (fadeTarget - fade) * Math.min(1, fadeStep * 7);

    program.uniforms.uTrailWidth.value = hovering ? config.trailWidth * 1.6 : config.trailWidth;
    program.uniforms.uTime.value = now * 0.001;
    program.uniforms.uFade.value = fade;

    renderer.render({ scene: mesh });
    requestAnimationFrame(render);
  };

  resize();
  requestAnimationFrame(render);
}

initGlowCursor();
