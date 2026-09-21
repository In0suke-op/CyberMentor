import confetti from 'canvas-confetti';

/**
 * Standard Cyber Confetti Color Palettes
 */
export const CONFETTI_PALETTES = {
  cyberEmerald: ['#10b981', '#06b6d4', '#34d399', '#67e8f9', '#ffffff'],
  goldLegendary: ['#f59e0b', '#fbbf24', '#a855f7', '#ec4899', '#ffffff'],
  redTeamOps: ['#f43f5e', '#fb7185', '#a855f7', '#38bdf8', '#ffffff'],
  soSentinel: ['#06b6d4', '#3b82f6', '#10b981', '#a855f7', '#ffffff']
};

/**
 * Quick reward burst for completing a lesson
 */
export function triggerLessonConfetti() {
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 },
    colors: CONFETTI_PALETTES.cyberEmerald
  });
}

/**
 * Celebratory burst for passing a quiz or diagnostic assessment
 */
export function triggerQuizConfetti() {
  confetti({
    particleCount: 100,
    spread: 75,
    origin: { y: 0.6 },
    colors: CONFETTI_PALETTES.soSentinel,
    disableForReducedMotion: true
  });
}

/**
 * Explosive CTF flag pwn burst for completing a hands-on lab
 */
export function triggerLabConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: CONFETTI_PALETTES.cyberEmerald,
    disableForReducedMotion: true
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Crisis response success burst for incident scenarios
 */
export function triggerScenarioConfetti() {
  const end = Date.now() + 1000;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: CONFETTI_PALETTES.redTeamOps
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: CONFETTI_PALETTES.redTeamOps
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Grand Fireworks Multi-Wave Cascade for earning a certification
 */
export function triggerCertConfetti() {
  const duration = 2500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: CONFETTI_PALETTES.goldLegendary
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: CONFETTI_PALETTES.goldLegendary
    });
  }, 250);
}

/**
 * Celebratory side cannons for level up
 */
export function triggerLevelUpConfetti() {
  const end = Date.now() + 1200;
  const colors = CONFETTI_PALETTES.goldLegendary;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
