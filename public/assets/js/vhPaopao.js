export default (element, options) => {
  document.querySelectorAll('.vh-paopao').forEach(item => setTimeout(() => item.remove()));
  const config = Object.assign({ radius: 10, density: 0.3, clearOffset: 0.2 }, options);
  let width, height, ctx, active = true;
  const canvas = document.createElement('canvas');
  const particles = [];
  // 初始化画布
  const initCanvas = () => {
    width = element.offsetWidth;
    height = element.offsetHeight;
    Object.assign(canvas.style, { top: '0', zIndex: '0', position: 'absolute', 'pointer-events': 'none' });
    element.append(canvas);
    element.parentElement.style.overflow = 'hidden';
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add('vh-paopao');
    ctx = canvas.getContext('2d');
  };

  // 粒子类
  class Particle {
    constructor() { this.reset() }
    reset() {
      this.x = Math.random() * width;
      this.y = height + 100 * Math.random();
      this.alpha = 0.1 + Math.random() * config.clearOffset;
      this.scale = 0.1 + 0.3 * Math.random();
      this.speed = Math.random();
      this.color = config.color === "random" ? `rgba(${Math.random() * 255 | 0},0,0,${Math.random().toFixed(2)})` : config.color;
    }
    draw() {
      if (this.alpha <= 0) this.reset();
      this.y -= this.speed;
      this.alpha -= 0.0005;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.scale * config.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  // 初始化
  initCanvas();
  // 动画循环
  const animate = () => { active && ctx.clearRect(0, 0, width, height); particles.forEach(p => p.draw()); requestAnimationFrame(animate); };
  Array.from({ length: width * config.density | 0 }, () => particles.push(new Particle()));
  animate();
  // 事件监听
  window.addEventListener('scroll', () => active = document.documentElement.scrollTop <= height);
  window.addEventListener('resize', () => { width = element.clientWidth; height = element.clientHeight; canvas.width = width; canvas.height = height; });
};