/* ═══════════════════════════════════════
   FATIMA SHOKOR — main.js
════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  if (cur)  { cur.style.left = mx + 'px';  cur.style.top = my + 'px'; }
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animCursor);
})();

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.id === 'rc')     animateStats();
    if (entry.target.id === 'skills') animateTags();
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── STAT COUNTERS ── */
function animateStats() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 1, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 80);
  });
}

/* ── STAGGERED SKILL TAGS ── */
function animateTags() {
  document.querySelectorAll('.skill-tag').forEach((tag, i) => {
    setTimeout(() => tag.classList.add('visible'), i * 40);
  });
}

/* ── HERO BACKGROUND CANVAS ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

const BLUE = '77,166,255';
const BLUE2 = '26,108,196';

function helix(cx, speed, phase0, t) {
  const amp = Math.min(80, W * 0.065);
  const period = H * 0.55;
  for (let strand = 0; strand < 2; strand++) {
    const ph = phase0 + strand * Math.PI;
    ctx.beginPath();
    for (let y = 0; y <= H; y += 3) {
      const x = cx + Math.sin((y / period) * Math.PI * 2 + t * speed + ph) * amp;
      y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0,    `rgba(${BLUE},0)`);
    g.addColorStop(0.15, `rgba(${BLUE},0.18)`);
    g.addColorStop(0.5,  `rgba(${BLUE},0.30)`);
    g.addColorStop(0.85, `rgba(${BLUE},0.18)`);
    g.addColorStop(1,    `rgba(${BLUE},0)`);
    ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();
  }
  const rungs = 22;
  for (let i = 0; i < rungs; i++) {
    const y  = (i / (rungs - 1)) * H;
    const x1 = cx + Math.sin((y / period) * Math.PI * 2 + t * speed + phase0) * amp;
    const x2 = cx + Math.sin((y / period) * Math.PI * 2 + t * speed + phase0 + Math.PI) * amp;
    const a  = 0.07 + 0.06 * Math.sin(i * 1.1 + t * 0.6);
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
    ctx.strokeStyle = `rgba(${BLUE},${a})`; ctx.lineWidth = 0.8; ctx.stroke();
    [[x1, 0.35],[x2, 0.28]].forEach(([x, ba]) => {
      ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BLUE},${ba + 0.15 * Math.sin(i + t)})`; ctx.fill();
    });
  }
}

const streams = Array.from({length: 6}, (_, i) => ({
  x: (i + 0.5) / 6 * 1920,
  chars: Array.from({length: 18}, () => ({
    y: Math.random() * 1080, c: ['A','T','G','C','0','1'][Math.floor(Math.random()*6)],
    a: Math.random() * 0.12 + 0.02, speed: Math.random() * 0.4 + 0.2, timer: Math.random() * 60,
  }))
}));

const dots = Array.from({length: 35}, () => ({
  x: Math.random() * 1920, y: Math.random() * 1080,
  r: Math.random() * 1.2 + 0.3, vx: (Math.random()-.5)*.12, vy: (Math.random()-.5)*.12,
  a: Math.random() * 0.15 + 0.03,
}));

let t = 0;
function drawBg() {
  ctx.clearRect(0, 0, W, H);
  helix(W * 0.08, 0.38, 0,   t);
  helix(W * 0.92, 0.33, 0.8, t);
  helix(W * 0.5,  0.28, 1.4, t);
  ctx.font = '11px "DM Mono", monospace';
  streams.forEach(s => {
    const sx = (s.x / 1920) * W;
    s.chars.forEach(ch => {
      ch.y += ch.speed; ch.timer++;
      if (ch.y > H) { ch.y = -16; ch.c = ['A','T','G','C','0','1'][Math.floor(Math.random()*6)]; }
      if (ch.timer > 45 + Math.random()*30) { ch.c = ['A','T','G','C','0','1'][Math.floor(Math.random()*6)]; ch.timer=0; }
      ctx.fillStyle = `rgba(${BLUE},${ch.a})`; ctx.fillText(ch.c, sx, ch.y);
    });
  });
  dots.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
    if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${BLUE},${d.a})`; ctx.fill();
  });
  t += 0.007;
  requestAnimationFrame(drawBg);
}
drawBg();

/* ── LIVE COORDS ── */
const coordEl = document.getElementById('coords');
if (coordEl) {
  document.addEventListener('mousemove', e => {
    const lat = (48.8566 + (e.clientY / window.innerHeight - 0.5) * 0.002).toFixed(4);
    const lon = (2.3522  + (e.clientX / window.innerWidth  - 0.5) * 0.002).toFixed(4);
    coordEl.textContent = `${lat}°N · ${lon}°E`;
  });
}

/* ── AVATAR CANVAS ── */
const ac = document.getElementById('avatar-canvas');
if (ac) {
  const acx = ac.getContext('2d');
  let aw, ah, at2 = 0;
  function resizeAvatar() { aw = ac.width = ac.offsetWidth; ah = ac.height = ac.offsetHeight; }
  window.addEventListener('resize', resizeAvatar);
  resizeAvatar();

  function makeNodes() {
    const nodes = [];
    const cx2 = aw * 0.5, cy2 = ah * 0.42;
    nodes.push({ x: cx2, y: cy2, r: 7, core: true });
    const ring1 = 8, r1 = 62;
    for (let i = 0; i < ring1; i++) {
      const a = (i / ring1) * Math.PI * 2;
      nodes.push({ x: cx2 + Math.cos(a)*r1, y: cy2 + Math.sin(a)*r1, r: 3.5, ring:1, angle:a });
    }
    const ring2 = 14, r2 = 118;
    for (let i = 0; i < ring2; i++) {
      const a = (i / ring2) * Math.PI * 2 + 0.2;
      nodes.push({ x: cx2 + Math.cos(a)*r2, y: cy2 + Math.sin(a)*r2, r: 2, ring:2, angle:a });
    }
    return nodes;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.arcTo(x+w,y,x+w,y+r,r);
    c.lineTo(x+w,y+h-r); c.arcTo(x+w,y+h,x+w-r,y+h,r);
    c.lineTo(x+r,y+h); c.arcTo(x,y+h,x,y+h-r,r);
    c.lineTo(x,y+r); c.arcTo(x,y,x+r,y,r); c.closePath();
    c.fill(); c.stroke();
  }

  function drawAvatar() {
    if (aw !== ac.offsetWidth || ah !== ac.offsetHeight) resizeAvatar();
    acx.clearRect(0,0,aw,ah);
    const nodes = makeNodes();
    const cx2 = aw*0.5, cy2 = ah*0.42;
    [100,75,50].forEach((rad,i) => {
      const p = Math.sin(at2*0.8+i*1.2)*0.5+0.5;
      acx.beginPath(); acx.arc(cx2,cy2,rad+p*12,0,Math.PI*2);
      acx.strokeStyle=`rgba(${BLUE},${0.04+p*0.03})`; acx.lineWidth=0.8; acx.stroke();
    });
    nodes.filter(n=>n.ring===1).forEach(n => {
      const active = Math.sin(at2*1.2+n.angle) > 0.4;
      acx.beginPath(); acx.moveTo(cx2,cy2); acx.lineTo(n.x,n.y);
      acx.strokeStyle=`rgba(${BLUE},${active?0.35:0.10})`; acx.lineWidth=active?1.2:0.5; acx.stroke();
    });
    const r1nodes = nodes.filter(n=>n.ring===1);
    nodes.filter(n=>n.ring===2).forEach(n => {
      const closest = r1nodes.reduce((a,b)=>Math.hypot(a.x-n.x,a.y-n.y)<Math.hypot(b.x-n.x,b.y-n.y)?a:b);
      const active = Math.sin(at2*0.7+n.angle*2) > 0.5;
      acx.beginPath(); acx.moveTo(n.x,n.y); acx.lineTo(closest.x,closest.y);
      acx.strokeStyle=`rgba(${BLUE},${active?0.18:0.06})`; acx.lineWidth=0.5; acx.stroke();
    });
    nodes.forEach(n => {
      const glow = n.core ? Math.sin(at2)*0.3+0.7 : n.ring===1 ? Math.sin(at2*1.1+n.angle)*0.4+0.6 : Math.sin(at2*0.8+n.angle*3)*0.3+0.4;
      if (n.core) { acx.beginPath(); acx.arc(n.x,n.y,n.r+10,0,Math.PI*2); acx.fillStyle=`rgba(${BLUE},${0.08*glow})`; acx.fill(); }
      acx.beginPath(); acx.arc(n.x,n.y,n.r,0,Math.PI*2);
      acx.fillStyle = n.core ? `rgba(${BLUE},${glow})` : n.ring===1 ? `rgba(${BLUE},${0.55*glow})` : `rgba(${BLUE2},${0.45*glow})`;
      acx.fill();
    });
    const dnaY0=ah*0.78, dnaY1=ah, amp=aw*0.18;
    for (let strand=0;strand<2;strand++) {
      const ph=strand*Math.PI;
      acx.beginPath();
      for (let y=dnaY0;y<=dnaY1;y+=2) {
        const x=aw*0.5+Math.sin(((y-dnaY0)/(dnaY1-dnaY0))*Math.PI*3+at2*0.7+ph)*amp;
        y===dnaY0?acx.moveTo(x,y):acx.lineTo(x,y);
      }
      const g2=acx.createLinearGradient(0,dnaY0,0,dnaY1);
      g2.addColorStop(0,`rgba(${BLUE},0.22)`); g2.addColorStop(1,`rgba(${BLUE},0)`);
      acx.strokeStyle=g2; acx.lineWidth=1; acx.stroke();
    }
    const chips=[{label:'Genomics',x:aw*0.14,y:ah*0.15},{label:'Deep Learning',x:aw*0.52,y:ah*0.10},{label:'OmicSage',x:aw*0.62,y:ah*0.72}];
    chips.forEach((ch,i)=>{
      const a=0.5+0.25*Math.sin(at2*0.5+i*2.1);
      acx.font='10px "DM Mono",monospace';
      const w=acx.measureText(ch.label).width+16;
      acx.fillStyle=`rgba(8,17,31,${a*0.85})`; acx.strokeStyle=`rgba(${BLUE},${a*0.35})`; acx.lineWidth=0.5;
      roundRect(acx,ch.x-w/2,ch.y-9,w,18,2);
      acx.fillStyle=`rgba(${BLUE},${a*0.75})`; acx.fillText(ch.label,ch.x-w/2+8,ch.y+3.5);
    });
    at2+=0.018;
    requestAnimationFrame(drawAvatar);
  }
  drawAvatar();
}

/* ============================================================
   ADD THIS TO THE BOTTOM OF main.js
   (inside or after your existing IntersectionObserver setup)
   ============================================================ */
 
// Staggered skill tag reveal
const skillTagObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-tags').forEach((tagGroup, i) => {
        setTimeout(() => {
          tagGroup.classList.add('tags-visible');
        }, i * 80);
      });
      skillTagObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
 
document.querySelectorAll('.skill-group').forEach(group => {
  skillTagObserver.observe(group);
});
