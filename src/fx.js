// 3D particle hero: ~2.6k particles morph between a hard hat, a chain and a globe. Canvas 2D, zero dependencies.
const hero = document.querySelector(".hero");
const cv = hero ? hero.querySelector("canvas") : null;
const g = cv ? cv.getContext("2d") : null;
const cap = document.getElementById("cap");

if (hero && cv && g && cap) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const isMobile = window.innerWidth < 700 || (navigator.hardwareConcurrency || 8) <= 4;
  const N = isMobile ? 1400 : 2600;
  const rr = Math.random;
  const rnd = () => rr() * 2 - 1;

  const CAPTIONS = [
    "Built for construction sites",
    "A chain of trust, one record at a time",
    "Decent work, everywhere"
  ];

  // Particle Shape 1: Construction Hard Hat
  const hat = n => Array.from({ length: n }, () => {
    const k = rr();
    let x, y, z;
    if (k < 0.6) {
      const t = rr() * 6.283;
      const f = Math.acos(rr());
      const s = Math.sin(f);
      x = 0.9 * s * Math.cos(t);
      z = 0.9 * s * Math.sin(t);
      y = 0.75 * Math.cos(f);
    } else if (k < 0.85) {
      const t = rr() * 6.283;
      const r = 1 + rr() * 0.35;
      x = r * Math.cos(t);
      z = r * Math.sin(t);
      y = -0.02 + rr() * 0.06;
    } else {
      z = rnd() * 0.88;
      x = rnd() * 0.1;
      y = 0.75 * Math.sqrt(Math.max(0, 1 - (z / 0.9) ** 2)) + 0.06 + rr() * 0.04;
    }
    return [x, y - 0.2, z];
  });

  // Particle Shape 2: Interlocked Cryptographic Chain Rings
  const ring = (center, isPlane, R, r) => {
    const u = rr() * 6.283;
    const v = rr() * 6.283;
    const w = R + r * Math.cos(v);
    const a = w * Math.cos(u);
    const b = w * Math.sin(u);
    const d = r * Math.sin(v);
    return isPlane ? [center + a, b, d] : [center + a, d, b];
  };

  const chain = n => Array.from({ length: n }, (_, i) =>
    i < n / 2 ? ring(-0.45, 1, 0.7, 0.17) : ring(0.45, 0, 0.7, 0.17)
  );

  // Particle Shape 3: Global Network Sphere
  const globe = n => Array.from({ length: n }, (_, i) => {
    const y = 1 - 2 * (i + 0.5) / n;
    const r = Math.sqrt(1 - y * y);
    const t = i * 2.39996;
    return [r * Math.cos(t), y, r * Math.sin(t)];
  });

  const SHAPES = [hat, chain, globe].map(fn => {
    const arr = new Float32Array(N * 3);
    fn(N).forEach((pt, i) => arr.set(pt, i * 3));
    return arr;
  });

  const DELAYS = Float32Array.from({ length: N }, rr);
  const GROUP = Uint8Array.from({ length: N }, () => {
    const r = rr();
    return r < 0.55 ? 0 : r < 0.85 ? 1 : 2;
  });

  const COLORS = [
    "rgba(255, 179, 71, 0.9)",
    "rgba(77, 163, 255, 0.9)",
    "rgba(255, 255, 255, 0.85)"
  ];

  const COLOR_INDICES = [0, 1, 2].map(colorIdx => {
    const indices = [];
    GROUP.forEach((val, i) => val === colorIdx && indices.push(i));
    return indices;
  });

  const STARS = Array.from({ length: 130 }, () => [rr(), rr(), rr()]);
  const PX = new Float32Array(N);
  const PY = new Float32Array(N);
  const PS = new Float32Array(N);

  let shapeIdx = 0;
  let fromShape = SHAPES[0];
  let toShape = SHAPES[0];
  let t0 = performance.now();
  let moved = false;
  let W = 1;
  let H = 1;
  let yaw = 0;
  let yawOffset = 0;
  let pitchOffset = 0;
  let mouseX = 0;
  let mouseY = 0;
  let isRunning = true;

  cap.textContent = CAPTIONS[0];

  function resizeCanvas() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
  }

  function renderFrame(now) {
    let morphProgress = Math.max(0, (now - t0 - 4200) / 2400);

    if (morphProgress > 0 && !moved) {
      moved = true;
      cap.textContent = CAPTIONS[(shapeIdx + 1) % 3];
    }

    if (morphProgress >= 1) {
      fromShape = toShape;
      shapeIdx = (shapeIdx + 1) % 3;
      toShape = SHAPES[shapeIdx];
      t0 = now;
      moved = false;
      morphProgress = 0;
    }

    yawOffset += (mouseX * 0.8 - yawOffset) * 0.05;
    pitchOffset += (mouseY * 0.35 + 0.3 - pitchOffset) * 0.05;
    yaw += 0.0045;

    const currentYaw = yaw + yawOffset;
    const cosYaw = Math.cos(currentYaw);
    const sinYaw = Math.sin(currentYaw);
    const cosPitch = Math.cos(pitchOffset);
    const sinPitch = Math.sin(pitchOffset);

    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    g.globalCompositeOperation = "lighter";
    g.fillStyle = "#ffffff";

    // Ambient Starfield
    for (const [starX, starY, depth] of STARS) {
      g.globalAlpha = (0.4 + 0.6 * Math.abs(Math.sin(now / 900 + starX * 20))) * 0.8;
      g.fillRect(
        (starX * W + mouseX * depth * 30) * dpr,
        (starY * H + mouseY * depth * 30) * dpr,
        (depth + 0.6) * dpr,
        (depth + 0.6) * dpr
      );
    }
    g.globalAlpha = 1;

    const isNarrow = W < 760;
    const originX = (isNarrow ? 0.5 : 0.7) * W * dpr;
    const originY = (isNarrow ? 0.74 : 0.5) * H * dpr;
    const radiusScale = Math.min(isNarrow ? W * 0.42 : W * 0.3, H * 0.4) * dpr;

    // Morph and Project Particles
    for (let i = 0; i < N; i++) {
      const localProgress = Math.min(1, Math.max(0, (morphProgress - DELAYS[i] * 0.5) / 0.5));
      const eased = localProgress * localProgress * (3 - 2 * localProgress);
      const j = i * 3;

      const px = fromShape[j] + (toShape[j] - fromShape[j]) * eased;
      const py = fromShape[j + 1] + (toShape[j + 1] - fromShape[j + 1]) * eased + Math.sin(eased * 3.1416) * 0.35 * (DELAYS[i] - 0.5);
      const pz = fromShape[j + 2] + (toShape[j + 2] - fromShape[j + 2]) * eased;

      const x1 = px * cosYaw + pz * sinYaw;
      const z1 = pz * cosYaw - px * sinYaw;
      const y1 = py * cosPitch - z1 * sinPitch;
      const z2 = py * sinPitch + z1 * cosPitch;
      const perspective = 3 / (3 - z2);

      PX[i] = originX + x1 * radiusScale * perspective;
      PY[i] = originY - y1 * radiusScale * perspective;
      PS[i] = perspective;
    }

    // Render Particle Batches by Color
    for (let c = 0; c < 3; c++) {
      g.fillStyle = COLORS[c];
      for (const i of COLOR_INDICES[c]) {
        const size = (0.9 + 1.5 * PS[i]) * dpr * 0.85;
        g.fillRect(PX[i] - size / 2, PY[i] - size / 2, size, size);
      }
    }
  }

  resizeCanvas();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderFrame(t0);
    new ResizeObserver(() => {
      resizeCanvas();
      renderFrame(t0);
    }).observe(hero);
  } else {
    new ResizeObserver(resizeCanvas).observe(hero);
    new IntersectionObserver(entries => {
      isRunning = entries[0].isIntersecting;
    }).observe(hero);

    hero.addEventListener("pointermove", e => {
      const rect = hero.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width * 2 - 1;
      mouseY = (e.clientY - rect.top) / rect.height * 2 - 1;
    });

    hero.addEventListener("pointerleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    (function loop(t) {
      if (isRunning && !document.hidden) renderFrame(t);
      requestAnimationFrame(loop);
    })(t0);
  }
}
