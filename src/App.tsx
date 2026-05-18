import { useState, useEffect } from 'react';
import { InfiniteGrid } from './components/InfiniteGrid';
import { ProfileNav } from './components/ProfileNav';
import { ItemModal } from './components/ItemModal';
import type { ProjectItem } from './data/defaultProjects';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-white">

      <InfiniteGrid isMobile={isMobile} onProjectSelect={setSelectedProject} />
      
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-6 pointer-events-none">
        <h1
          style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
          className="text-4xl md:text-5xl text-zinc-900 tracking-wide drop-shadow-sm"
        >
          Motion Sickness
        </h1>
      </header>

      <ProfileNav />
      <ItemModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

