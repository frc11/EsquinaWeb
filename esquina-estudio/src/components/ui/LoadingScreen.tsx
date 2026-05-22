"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import headerLogoWhite from "../../../logos/logo-header-blanco.png";

const PROGRESS_DURATION_MS = 1000;
const HOLD_AFTER_COMPLETE_MS = 700;
const EXIT_DURATION = 1;
const EXIT_DELAY = PROGRESS_DURATION_MS + HOLD_AFTER_COMPLETE_MS;
const HIDE_DELAY = EXIT_DELAY + EXIT_DURATION * 1000;

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];
const PARTICLE_ALPHA_THRESHOLD = 40;
const PARTICLE_DESKTOP_STEP = 2;
const PARTICLE_MOBILE_STEP = 5;
const MAX_CANVAS_DPR = 2;
const PARTICLE_SCATTER_X = 9;
const PARTICLE_SCATTER_Y = 5;
const PARTICLE_CANVAS_SCALE_X = 1.9;
const PARTICLE_CANVAS_SCALE_Y = 2.5;
const PARTICLE_CLOUD_SPREAD_X_DESKTOP = 124;
const PARTICLE_CLOUD_SPREAD_Y_DESKTOP = 68;
const PARTICLE_CLOUD_SPREAD_X_MOBILE = 68;
const PARTICLE_CLOUD_SPREAD_Y_MOBILE = 42;
const FINAL_LOGO_PROGRESS = 0.99;
const PARTICLE_SETTLE_PROGRESS = FINAL_LOGO_PROGRESS;
const FINAL_PARTICLE_OPACITY = 0;

type LogoParticle = {
  alpha: number;
  baseX: number;
  baseY: number;
  phase: number;
  scatterX: number;
  scatterY: number;
  size: number;
};

function particleSeed(x: number, y: number) {
  return Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
}

function easeOutCubic(value: number) {
  const progress = Math.min(Math.max(value, 0), 1);
  return 1 - Math.pow(1 - progress, 3);
}

function ParticleLogo({
  finalizing,
  progress,
  reduceMotion,
}: {
  finalizing: boolean;
  progress: number;
  reduceMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finalizingRef = useRef(finalizing);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    finalizingRef.current = finalizing;
  }, [finalizing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const sourceCanvas = document.createElement("canvas");
    const sourceContext = sourceCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!sourceContext) return;

    const image = new window.Image();
    let animationFrame = 0;
    let resizeFrame = 0;
    let particles: LogoParticle[] = [];
    let cssWidth = 0;
    let cssHeight = 0;
    let isDisposed = false;

    const paintParticles = (time = 0) => {
      if (isDisposed) return;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(
        canvas.width / Math.max(cssWidth, 1),
        0,
        0,
        canvas.height / Math.max(cssHeight, 1),
        0,
        0,
      );
      context.fillStyle = "rgb(245,245,245)";

      const settledProgress = reduceMotion ? 1 : progressRef.current;

      const particleProgress = Math.min(
        Math.max(settledProgress / PARTICLE_SETTLE_PROGRESS, 0),
        1,
      );

      const isSettled = particleProgress >= 0.995;
      const chaos = isSettled ? 0 : Math.pow(1 - particleProgress, 1.35);
      const finalLogoProgress = Math.min(
        Math.max(
          (settledProgress - FINAL_LOGO_PROGRESS) / (1 - FINAL_LOGO_PROGRESS),
          0,
        ),
        1,
      );
      const particleOpacity = finalizingRef.current
        ? 1 -
          easeOutCubic(finalLogoProgress) * (1 - FINAL_PARTICLE_OPACITY)
        : 1;

      particles.forEach((particle) => {
        const waveX =
          Math.sin(particle.baseY * 0.035 + time * 0.003 + particle.phase) *
          4 *
          chaos;
        const waveY =
          Math.sin(particle.baseX * 0.025 + time * 0.0025 + particle.phase) *
          2 *
          chaos;
        const breath = isSettled
          ? 1
          : 1 - chaos * 0.12 + Math.sin(time * 0.0018 + particle.phase) * 0.1 * chaos;

        context.globalAlpha = Math.min(
          1,
          particle.alpha * breath * particleOpacity,
        );
        context.beginPath();
        context.arc(
          particle.baseX + waveX + particle.scatterX * chaos,
          particle.baseY + waveY + particle.scatterY * chaos,
          particle.size,
          0,
          Math.PI * 2,
        );
        context.fill();
      });

      context.globalAlpha = 1;

      if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(paintParticles);
      }
    };

    const buildParticles = () => {
      const rect = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rect.width);
      cssHeight = Math.max(1, rect.height);
      const logoWidth = cssWidth / PARTICLE_CANVAS_SCALE_X;
      const logoHeight = cssHeight / PARTICLE_CANVAS_SCALE_Y;
      const logoX = (cssWidth - logoWidth) / 2;
      const logoY = (cssHeight - logoHeight) / 2;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      sourceCanvas.width = Math.round(cssWidth);
      sourceCanvas.height = Math.round(cssHeight);

      sourceContext.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
      sourceContext.drawImage(image, logoX, logoY, logoWidth, logoHeight);

      const pixels = sourceContext.getImageData(
        0,
        0,
        sourceCanvas.width,
        sourceCanvas.height,
      ).data;
      const step =
        window.innerWidth < 768 ? PARTICLE_MOBILE_STEP : PARTICLE_DESKTOP_STEP;
      const cloudSpreadX =
        window.innerWidth < 768
          ? PARTICLE_CLOUD_SPREAD_X_MOBILE
          : PARTICLE_CLOUD_SPREAD_X_DESKTOP;
      const cloudSpreadY =
        window.innerWidth < 768
          ? PARTICLE_CLOUD_SPREAD_Y_MOBILE
          : PARTICLE_CLOUD_SPREAD_Y_DESKTOP;
      const centerX = sourceCanvas.width / 2;
      const centerY = sourceCanvas.height / 2;
      const nextParticles: LogoParticle[] = [];

      for (let y = 0; y < sourceCanvas.height; y += step) {
        for (let x = 0; x < sourceCanvas.width; x += step) {
          const alpha = pixels[(y * sourceCanvas.width + x) * 4 + 3];
          if (alpha < PARTICLE_ALPHA_THRESHOLD) continue;

          const seed = particleSeed(x, y);
          const scatterSeed = particleSeed(x + 41, y + 73);
          const radiusSeed = particleSeed(x + 113, y + 29);
          const cloudSeedX = particleSeed(x + 197, y + 151);
          const cloudSeedY = particleSeed(x + 251, y + 199);
          const centerOffsetX = x - centerX;
          const centerOffsetY = y - centerY;
          const centerDistance = Math.hypot(centerOffsetX, centerOffsetY);
          const fallbackAngle = radiusSeed * Math.PI * 2;
          const directionX =
            centerDistance > 0
              ? centerOffsetX / centerDistance
              : Math.cos(fallbackAngle);
          const directionY =
            centerDistance > 0
              ? centerOffsetY / centerDistance
              : Math.sin(fallbackAngle);
          const clusterX =
            Math.sin(y * 0.11 + cloudSeedY * Math.PI * 2) *
            cloudSpreadX *
            0.18;
          const clusterY =
            Math.cos(x * 0.07 + cloudSeedX * Math.PI * 2) *
            cloudSpreadY *
            0.22;
          const outwardX =
            directionX * cloudSpreadX * (0.22 + radiusSeed * 0.34);
          const outwardY =
            directionY * cloudSpreadY * (0.18 + scatterSeed * 0.38);
          const cloudX =
            outwardX +
            (cloudSeedX - 0.5) * cloudSpreadX +
            clusterX;
          const cloudY =
            outwardY +
            (cloudSeedY - 0.5) * cloudSpreadY +
            clusterY;

          nextParticles.push({
            alpha: (alpha / 255) * (0.76 + seed * 0.24),
            baseX: x,
            baseY: y,
            phase: seed * Math.PI * 2,
            scatterX:
              cloudX +
              (seed - 0.5) * PARTICLE_SCATTER_X,
            scatterY:
              cloudY +
              (scatterSeed - 0.5) * PARTICLE_SCATTER_Y,
            size: Math.max(0.95, step * (0.32 + seed * 0.18)),
          });
        }
      }

      particles = nextParticles;
      window.cancelAnimationFrame(animationFrame);
      paintParticles(window.performance.now());
    };

    const queueResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(buildParticles);
    };

    image.onload = () => {
      if (isDisposed) return;
      buildParticles();
      window.addEventListener("resize", queueResize);
    };
    image.src = headerLogoWhite.src;

    return () => {
      isDisposed = true;
      image.onload = null;
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", queueResize);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
      style={{
        height: `${PARTICLE_CANVAS_SCALE_Y * 100}%`,
        width: `${PARTICLE_CANVAS_SCALE_X * 100}%`,
      }}
    />
  );
}

export default function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const { markPreloaderDone } = usePreloader();
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const showFinalLogo = Boolean(reduceMotion) || progress >= FINAL_LOGO_PROGRESS;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let progressFrame = 0;
    let progressStart = 0;

    const updateProgress = (time: number) => {
      if (!progressStart) progressStart = time;

      const nextProgress = Math.min(
        (time - progressStart) / PROGRESS_DURATION_MS,
        1,
      );

      setProgress(nextProgress);

      if (nextProgress < 1) {
        progressFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    const revealFrame = window.requestAnimationFrame(() => {
      setShouldRender(true);
      setIsVisible(true);

      if (reduceMotion) {
        setProgress(1);
      } else {
        progressFrame = window.requestAnimationFrame(updateProgress);
      }
    });
    const exitTimer = setTimeout(() => setIsExiting(true), EXIT_DELAY);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      markPreloaderDone();
    }, HIDE_DELAY);

    return () => {
      window.cancelAnimationFrame(revealFrame);
      window.cancelAnimationFrame(progressFrame);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [markPreloaderDone, reduceMotion]);

  if (!shouldRender || !isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="loading-screen"
          exit={{ y: "-100%" }}
          transition={{ duration: EXIT_DURATION, ease: EASE_EXIT }}
          className="fixed inset-0 z-[9998] bg-off-black flex flex-col items-center justify-center gap-8"
        >
          <motion.div
            className="pointer-events-none"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, filter: "blur(4px)" }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    filter: "blur(0px)",
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.8, ease: EASE_OUT_EXPO }
            }
          >
            <div
              className="relative w-[min(62vw,320px)] md:w-[min(38vw,420px)]"
              style={{
                aspectRatio: `${headerLogoWhite.width} / ${headerLogoWhite.height}`,
              }}
            >
              <ParticleLogo
                finalizing={showFinalLogo}
                progress={progress}
                reduceMotion={Boolean(reduceMotion)}
              />

              <AnimatePresence>
                {showFinalLogo && (
                  <motion.img
                    src={headerLogoWhite.src}
                    alt="ESQUINA ESTUDIO"
                    className="absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 0,
                            filter: "blur(5px)",
                            scale: 0.995,
                          }
                    }
                    animate={
                      reduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            filter: "blur(0px)",
                            scale: 1,
                          }
                    }
                    exit={{ opacity: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.45, ease: EASE_OUT_EXPO }
                    }
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="w-48 md:w-64 h-[1px] bg-off-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-off-white origin-left"
              style={{ scaleX: progress }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
