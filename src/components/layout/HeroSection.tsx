'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const MATH_SYMBOLS = ['∑', 'π', '∞', '√', '∫', 'Δ', 'θ', 'φ', 'λ', 'ε', '∂', '∇', '≈', '≠', '±', '×', 'α', 'β', 'γ', 'Ω'];

interface Particle {
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

function createParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
    x: Math.random() * width,
    y: Math.random() * height,
    size: 14 + Math.random() * 16,
    opacity: 0.04 + Math.random() * 0.1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.35,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
  }));
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
      particlesRef.current = createParticles(rect.width, rect.height, 35);
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.font = `${p.size}px 'Inter', system-ui, sans-serif`;
        ctx.fillStyle = `rgba(var(--particle-color, 100, 100, 180), ${p.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: 'easeOut' as const },
    }),
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium glass text-[var(--text-secondary)]">
            🧮 数学史可视化学习平台
          </span>
        </motion.div>

        <motion.h1
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 text-5xl md:text-7xl font-bold gradient-text leading-tight"
        >
          数学的发现之旅
        </motion.h1>

        <motion.p
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
        >
          沿着历史时间轴，亲手体验数学概念如何被人类一步步发明出来
        </motion.p>

        <motion.div
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="#timeline">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-md animate-glow-pulse" />
              <Button variant="gradient" size="lg" className="relative">
                开始探索
              </Button>
            </div>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </Link>
        </motion.div>

        <motion.div
          custom={1.0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]"
        >
          <span>12 个历史节点</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span>15 个互动实验</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span>跨越 3800 年</span>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-[var(--text-muted)]">向下滚动</span>
        <svg
          className="w-5 h-5 text-[var(--text-muted)] animate-bounce-gentle"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
