particlesJS('particles-js', {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1200
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      }
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 4,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      }
    },
    modes: {
      repulse: {
        distance: 80,
        duration: 0.5
      },
      push: {
        particles_nb: 4
      },
      bubble: {
        distance: 200,
        size: 6,
        duration: 2,
        opacity: 0.8,
        speed: 3
      }
    }
  },
  retina_detect: true
});

function getParticlesInstance() {
  return (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) || null;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const BASE_COLOR = hexToRgb('#ffffff');
const HOVER_COLOR = hexToRgb('#ff0000');
const COLOR_RADIUS = 90;
const FADE_SPEED = 0.035;

let lastPush = 0;

function applyInteractiveLineColor() {
  const particles = getParticlesInstance();
  if (!particles || !particles.fn || !particles.fn.interact) return;

  particles.fn.interact.linkParticles = function(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= particles.particles.line_linked.distance) {
      const baseOpacity = particles.particles.line_linked.opacity;
      const opacity = baseOpacity - dist / (1 / baseOpacity) / particles.particles.line_linked.distance;

      if (opacity > 0) {
        const mix1 = typeof p1._colorMix === 'number' ? p1._colorMix : 0;
        const mix2 = typeof p2._colorMix === 'number' ? p2._colorMix : 0;
        const mix = Math.max(mix1, mix2);

        const r = Math.round(lerp(BASE_COLOR.r, HOVER_COLOR.r, mix));
        const g = Math.round(lerp(BASE_COLOR.g, HOVER_COLOR.g, mix));
        const b = Math.round(lerp(BASE_COLOR.b, HOVER_COLOR.b, mix));

        particles.canvas.ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        particles.canvas.ctx.lineWidth = particles.particles.line_linked.width;
        particles.canvas.ctx.beginPath();
        particles.canvas.ctx.moveTo(p1.x, p1.y);
        particles.canvas.ctx.lineTo(p2.x, p2.y);
        particles.canvas.ctx.stroke();
        particles.canvas.ctx.closePath();
      }
    }
  };
}

applyInteractiveLineColor();

window.addEventListener('mousemove', function(e) {
  const now = Date.now();
  if (now - lastPush < 100) return;

  const particles = getParticlesInstance();
  if (!particles) return;

  const canvas = document.querySelector('#particles-js canvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  particles.interactivity.mouse.pos_x = x;
  particles.interactivity.mouse.pos_y = y;

  particles.fn.modes.pushParticles(1, {
    pos_x: x,
    pos_y: y
  });

  if (particles.particles && particles.particles.array) {
    particles.particles.array.forEach(function(p) {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= COLOR_RADIUS) {
        p._colorMix = 1;
      }
    });
  }

  lastPush = now;
});

function animateParticleColors() {
  const particles = getParticlesInstance();

  if (particles && particles.particles && particles.particles.array) {
    particles.particles.array.forEach(function(p) {
      if (typeof p._colorMix !== 'number') {
        p._colorMix = 0;
      }

      if (p._colorMix > 0) {
        p._colorMix -= FADE_SPEED;
        if (p._colorMix < 0) p._colorMix = 0;
      }

      const t = p._colorMix;

      const r = Math.round(lerp(BASE_COLOR.r, HOVER_COLOR.r, t));
      const g = Math.round(lerp(BASE_COLOR.g, HOVER_COLOR.g, t));
      const b = Math.round(lerp(BASE_COLOR.b, HOVER_COLOR.b, t));

      p.color.value = 'rgb(' + r + ',' + g + ',' + b + ')';
      p.color.rgb = { r: r, g: g, b: b };
    });
  }

  requestAnimationFrame(animateParticleColors);
}

animateParticleColors();

window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;
  document.getElementById('particles-js').style.transform = 'translateY(' + rate + 'px)';
});