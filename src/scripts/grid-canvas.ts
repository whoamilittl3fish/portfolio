const CELL = 40;
const RADIUS = 200;
const MAX_DISP = 18;
const LERP = 0.1;

interface GridNode {
  ox: number;
  oy: number;
  dx: number;
  dy: number;
}

export function initGridCanvas(): void {
  if (document.body.classList.contains('no-grid')) return;

  const canvas = document.getElementById('grid-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let cols = 0, rows = 0;
  let nodes: GridNode[] = [];
  let mouseX = -9999, mouseY = -9999;
  let borderColor = '';
  let rafId = 0;

  function readColor(): void {
    borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
  }

  function buildGrid(): void {
    cols = Math.ceil(canvas!.width / CELL) + 2;
    rows = Math.ceil(canvas!.height / CELL) + 2;
    nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({ ox: (c - 1) * CELL, oy: (r - 1) * CELL, dx: 0, dy: 0 });
      }
    }
  }

  function resize(): void {
    canvas!.width = window.innerWidth;
    canvas!.height = window.innerHeight;
    buildGrid();
    readColor();
  }

  function draw(): void {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

    for (const n of nodes) {
      const ex = mouseX - n.ox;
      const ey = mouseY - n.oy;
      const dist = Math.sqrt(ex * ex + ey * ey);
      let tdx = 0, tdy = 0;
      if (dist < RADIUS && dist > 0.5) {
        const strength = (1 - dist / RADIUS) * (1 - dist / RADIUS) * MAX_DISP;
        tdx = (ex / dist) * strength;
        tdy = (ey / dist) * strength;
      }
      n.dx += (tdx - n.dx) * LERP;
      n.dy += (tdy - n.dy) * LERP;
    }

    ctx!.strokeStyle = borderColor;
    ctx!.lineWidth = 1;
    ctx!.globalAlpha = 0.65;

    for (let r = 0; r < rows; r++) {
      ctx!.beginPath();
      for (let c = 0; c < cols; c++) {
        const n = nodes[r * cols + c];
        const x = n.ox + n.dx;
        const y = n.oy + n.dy;
        c === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.stroke();
    }

    for (let c = 0; c < cols; c++) {
      ctx!.beginPath();
      for (let r = 0; r < rows; r++) {
        const n = nodes[r * cols + c];
        const x = n.ox + n.dx;
        const y = n.oy + n.dy;
        r === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.stroke();
    }

    rafId = requestAnimationFrame(draw);
  }

  resize();
  rafId = requestAnimationFrame(draw);

  window.addEventListener('resize', () => { cancelAnimationFrame(rafId); resize(); rafId = requestAnimationFrame(draw); });

  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
  }, { passive: true });
  window.addEventListener('touchend', () => { mouseX = -9999; mouseY = -9999; });

  const themeObserver = new MutationObserver(readColor);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
