<template>
  <div class="hero-gradient-mesh" aria-hidden="true">
    <div class="hero-gradient-mesh__layer hero-gradient-mesh__layer--1" />
    <div class="hero-gradient-mesh__layer hero-gradient-mesh__layer--2" />
    <div class="hero-gradient-mesh__layer hero-gradient-mesh__layer--3" />
  </div>
</template>

<style scoped>
.hero-gradient-mesh {
  position: absolute;
  inset: -10px 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.hero-gradient-mesh__layer {
  position: absolute;
  inset: -50%;
  animation: gradient-rotate var(--duration) linear infinite;
  opacity: var(--opacity);
}

.hero-gradient-mesh__layer--1 {
  --duration: 18s;
  --opacity: 0.1;
  background: conic-gradient(
    from var(--gradient-angle, 0deg) at 50% 45%,
    transparent 0%,
    rgb(var(--accent)) 12%,
    transparent 25%,
    rgb(var(--accent-hover)) 37%,
    transparent 50%,
    rgb(var(--accent)) 62%,
    transparent 75%,
    rgb(var(--accent-hover)) 87%,
    transparent 100%
  );
}

.hero-gradient-mesh__layer--2 {
  --duration: 25s;
  --opacity: 0.07;
  background: conic-gradient(
    from var(--gradient-angle, 0deg) at 55% 50%,
    transparent 0%,
    rgb(var(--accent-hover)) 15%,
    transparent 30%,
    rgb(var(--accent)) 45%,
    transparent 60%,
    rgb(var(--accent-hover)) 75%,
    transparent 90%
  );
  animation-direction: reverse;
}

.hero-gradient-mesh__layer--3 {
  --duration: 32s;
  --opacity: 0.03;
  background: radial-gradient(
    ellipse 600px 400px at 40% 50%,
    rgb(var(--accent) / 0.2) 0%,
    transparent 70%
  );
  animation-name: gradient-rotate;
}
</style>
