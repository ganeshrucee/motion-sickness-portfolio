import { useEffect, useRef, useCallback, useState } from 'react';
import { defaultProjects } from '../data/defaultProjects';
import type { ProjectItem } from '../data/defaultProjects';
import { sanityClient } from '../sanityClient';

const COLS = 10;
const ROWS = 8;
const LERP_FACTOR = 0.12;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface InfiniteGridProps {
  isMobile: boolean;
  onProjectSelect: (project: ProjectItem) => void;
}

export function InfiniteGrid({ isMobile, onProjectSelect }: InfiniteGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tilesCacheRef = useRef<HTMLElement[]>([]);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  const ITEM_W = isMobile ? 120 : 240;
  const ITEM_H = isMobile ? 120 : 240;
  const GAP = isMobile ? 8 : 16;
  
  const GRID_W = COLS * ITEM_W + (COLS - 1) * GAP;
  const GRID_H = ROWS * ITEM_H + (ROWS - 1) * GAP;

  const PERIOD_X = GRID_W + GAP;
  const PERIOD_Y = GRID_H + GAP;

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const touch = useRef({ x: 0, y: 0 });

  const getInitial = useCallback(() => ({ x: 0, y: 0 }), []);

  // Fetch Sanity Projects
  useEffect(() => {
    sanityClient
      .fetch<ProjectItem[]>(
        `*[_type == "project"] | order(_createdAt desc) {
          _id,
          title,
          slug,
          "thumbnailUrl": thumbnail.asset->url,
          videoUrl,
          "videoFileUrl": videoFile.asset->url,
          description,
          tags,
          client,
          year
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(defaultProjects);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading projects from Sanity, using fallback defaults:', err);
        setProjects(defaultProjects);
        setIsLoading(false);
      });
  }, []);

  // Clear tiles cache when data changes to ensure accurate scaling references
  useEffect(() => {
    tilesCacheRef.current = [];
  }, [projects, isLoading]);

  useEffect(() => {
    const init = getInitial();
    target.current = { ...init };
    current.current = { ...init };

    const tick = () => {
      const cx = lerp(current.current.x, target.current.x, LERP_FACTOR);
      const cy = lerp(current.current.y, target.current.y, LERP_FACTOR);
      current.current = { x: cx, y: cy };

      const wx = ((cx % PERIOD_X) + PERIOD_X) % PERIOD_X - PERIOD_X;
      const wy = ((cy % PERIOD_Y) + PERIOD_Y) % PERIOD_Y - PERIOD_Y;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${wx}px,${wy}px,0)`;

        // LENS EFFECT (Dynamic Scaling)
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.9;

        if (tilesCacheRef.current.length === 0) {
          const els = gridRef.current.querySelectorAll('.dynamic-tile');
          tilesCacheRef.current = Array.from(els) as HTMLElement[];
        }

        tilesCacheRef.current.forEach((htmlElement) => {
          const baseX = parseFloat(htmlElement.dataset.x || '0');
          const baseY = parseFloat(htmlElement.dataset.y || '0');

          const screenX = baseX + wx;
          const screenY = baseY + wy;

          const dx = screenX - viewportCenterX;
          const dy = screenY - viewportCenterY;
          const dist = Math.hypot(dx, dy);

          // Lens formula: 1.0 at center, scaling down to 0.60 at maxDist
          const normalizedDist = Math.min(dist / maxDist, 1);
          const scale = 0.60 + 0.40 * Math.pow(1 - normalizedDist, 2);

          // Dynamic Spacing tightening: pull smaller cards inward to close the wider gap organic visual
          const pullFactor = (1 - scale) * 0.28;
          const tx = -dx * pullFactor;
          const ty = -dy * pullFactor;

          // Use inline custom property so CSS can handle hardware acceleration cleanly
          htmlElement.style.setProperty('--lens-scale', scale.toString());
          htmlElement.style.setProperty('--lens-tx', `${tx}px`);
          htmlElement.style.setProperty('--lens-ty', `${ty}px`);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getInitial, PERIOD_X, PERIOD_Y]);

  // Wheel handler
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current = {
        x: target.current.x - e.deltaX * 1.2,
        y: target.current.y - e.deltaY * 1.2,
      };
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Touch handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - touch.current.x;
      const dy = e.touches[0].clientY - touch.current.y;
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      target.current = {
        x: target.current.x + dx,
        y: target.current.y + dy,
      };
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
    };
  }, []);

  const items = Array.from({ length: COLS * ROWS }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-[100dvh] overflow-hidden touch-none select-none"
    >
      <div
        ref={gridRef}
        className="grid-canvas absolute top-0 left-0"
        style={{ width: PERIOD_X * 3, height: PERIOD_Y * 3 }}
      >
        {[-1, 0, 1].map(row =>
          [-1, 0, 1].map(col => {
            const blockOffsetX = (col + 1) * PERIOD_X;
            const blockOffsetY = (row + 1) * PERIOD_Y;
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  position: 'absolute',
                  left: blockOffsetX,
                  top: blockOffsetY,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLS}, ${ITEM_W}px)`,
                  gridTemplateRows: `repeat(${ROWS}, ${ITEM_H}px)`,
                  gap: GAP,
                }}
              >
                {items.map(i => {
                  const tileCol = i % COLS;
                  const tileRow = Math.floor(i / COLS);
                  const tileCenterX = blockOffsetX + tileCol * (ITEM_W + GAP) + ITEM_W / 2;
                  const tileCenterY = blockOffsetY + tileRow * (ITEM_H + GAP) + ITEM_H / 2;

                  const uniqueKey = `${row}-${col}-${i}`;

                  if (isLoading || projects.length === 0) {
                    return (
                      <div
                        key={uniqueKey}
                        className="thumb-card dynamic-tile relative overflow-hidden bg-[#fdd5d5] animate-pulse border border-zinc-100/50"
                        data-x={tileCenterX}
                        data-y={tileCenterY}
                      />
                    );
                  }

                  const project = projects[i % projects.length];

                  return (
                    <div
                      key={uniqueKey}
                      className="thumb-card dynamic-tile cursor-pointer origin-center relative overflow-hidden group border border-zinc-100/50 bg-[#fdd5d5]"
                      data-x={tileCenterX}
                      data-y={tileCenterY}
                      onClick={() => onProjectSelect(project)}
                      onMouseEnter={() => setHoveredIndex(uniqueKey)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Project Thumbnail Image */}
                      {project.thumbnailUrl && (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105 rounded-[16px]"
                          draggable="false"
                        />
                      )}

                      {/* Video Loop plays on hover */}
                      {project.videoFileUrl && hoveredIndex === uniqueKey && (
                        <video
                          src={project.videoFileUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[16px] z-10"
                        />
                      )}

                      {/* Dark overlay with Title on hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-left pointer-events-none rounded-b-[16px] h-1/2 z-20">
                        <span className="text-white text-xs font-black tracking-wide truncate">
                          {project.title}
                        </span>
                        {project.tags && project.tags.length > 0 && (
                          <span className="text-zinc-300 text-[8px] tracking-wider uppercase mt-0.5 truncate font-bold">
                            {project.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
      <div className="vignette absolute inset-0 z-10 pointer-events-none" />
    </div>
  );
}
