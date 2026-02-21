'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMotionValueEvent, MotionValue } from 'framer-motion';

// 240-frame BNB coin PNG sequence
const FRAME_FILES = Array.from({ length: 240 }, (_, i) =>
    `Smoothly_transition_from_202602201919_cjpbq_${String(i + 1).padStart(4, '0')}.png`
);

const FRAME_COUNT = FRAME_FILES.length;

interface Props {
    scrollYProgress: MotionValue<number>;
}

export default function ScrollytellingCanvas({ scrollYProgress }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const lastFrameRef = useRef<number>(-1);
    const rafRef = useRef<number>(0);
    const [loaded, setLoaded] = useState(0);
    const [isRenderReady, setIsRenderReady] = useState(false);

    // Setup canvas with correct DPI scaling
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }
    }, []);

    // Draw a single frame — "object-fit: cover" math
    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const images = imagesRef.current;
        if (!canvas || !images[index]) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const img = images[index];
        const w = window.innerWidth;
        const h = window.innerHeight;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const winRatio = w / h;

        let drawW: number, drawH: number, ox: number, oy: number;

        if (winRatio > imgRatio) {
            drawW = w;
            drawH = w / imgRatio;
            ox = 0;
            oy = (h - drawH) / 2;
        } else {
            drawH = h;
            drawW = h * imgRatio;
            ox = (w - drawW) / 2;
            oy = 0;
        }

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, ox, oy, drawW, drawH);

        lastFrameRef.current = index;
    }, []);

    // Preload all PNGs
    useEffect(() => {
        let loadedCount = 0;
        const arr: HTMLImageElement[] = new Array(FRAME_COUNT);

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.decoding = 'async';
            img.src = `/image-frames/${FRAME_FILES[i]}`;
            img.onload = () => {
                arr[i] = img;
                loadedCount++;
                setLoaded(loadedCount);
                if (loadedCount === FRAME_COUNT) {
                    imagesRef.current = arr;
                    setIsRenderReady(true);
                }
            };
        }
    }, []);

    // Initial canvas setup + first frame draw
    useEffect(() => {
        if (!isRenderReady) return;
        setupCanvas();
        drawFrame(0);
    }, [isRenderReady, setupCanvas, drawFrame]);

    // Scroll → frame mapping via requestAnimationFrame
    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (!isRenderReady) return;

        const targetFrame = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.floor(latest * (FRAME_COUNT - 1)))
        );

        if (targetFrame === lastFrameRef.current) return;

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            drawFrame(targetFrame);
        });
    });

    // Resize handler
    useEffect(() => {
        let resizeRaf = 0;
        const handleResize = () => {
            cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(() => {
                setupCanvas();
                if (lastFrameRef.current >= 0) {
                    drawFrame(lastFrameRef.current);
                }
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(resizeRaf);
        };
    }, [setupCanvas, drawFrame]);

    // Cleanup rAF on unmount
    useEffect(() => {
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block w-full h-full"
                style={{ imageRendering: 'auto' }}
            />
            {!isRenderReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-brand-charcoal z-10">
                    <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-gold to-cyan transition-all duration-200 ease-out rounded-full"
                            style={{ width: `${Math.floor((loaded / FRAME_COUNT) * 100)}%` }}
                        />
                    </div>
                    <span className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase">
                        Loading {Math.floor((loaded / FRAME_COUNT) * 100)}%
                    </span>
                </div>
            )}
        </>
    );
}
