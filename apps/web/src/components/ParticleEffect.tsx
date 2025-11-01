import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
}

interface ParticleEffectProps {
  trigger: boolean;
  type?: "success" | "failure" | "celebration";
  onComplete?: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ trigger, type = "success", onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = {
      success: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#fbbf24"],
      failure: ["#ef4444", "#f87171", "#fca5a5", "#ff6b6b"],
      celebration: ["#ec4899", "#f472b6", "#f9a8d4", "#fbbf24", "#60a5fa", "#a78bfa"],
    };

    const particleCount = type === "celebration" ? 100 : 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particlesRef.current = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 8 + 4;

      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 3,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: Math.random() * 6 + 3,
        alpha: 1,
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particlesRef.current.forEach((particle) => {
        if (particle.life < particle.maxLife) {
          activeParticles++;

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.3;
          particle.vx *= 0.99;
          particle.life++;
          particle.alpha = 1 - particle.life / particle.maxLife;

          ctx.save();
          ctx.globalAlpha = particle.alpha;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, type, onComplete]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ background: "transparent" }} />
  );
};
