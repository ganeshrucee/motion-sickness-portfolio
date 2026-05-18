import type { ProjectItem } from '../data/defaultProjects';
import { X, Play, Monitor, Calendar } from 'lucide-react';
import { PortableText } from '@portabletext/react';

interface ItemModalProps {
  selectedProject: ProjectItem | null;
  onClose: () => void;
}

export function ItemModal({ selectedProject, onClose }: ItemModalProps) {
  if (!selectedProject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 pointer-events-auto cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div
        className="relative bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col md:flex-row pointer-events-auto border border-zinc-100/50"
        style={{ width: 'min(900px, 90vw)', maxHeight: '85vh', height: 'min(620px, 80vh)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Visual Area (Image/Video) */}
        <div className="w-full md:w-3/5 h-[240px] md:h-full bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100">
          {selectedProject.videoFileUrl ? (
            <video
              src={selectedProject.videoFileUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
              playsInline
            />
          ) : selectedProject.videoUrl ? (
            <div className="w-full h-full relative">
              {/* If it's a direct link to YouTube or Vimeo, render iframe or link */}
              {selectedProject.videoUrl.includes('vimeo.com') || selectedProject.videoUrl.includes('youtube.com') || selectedProject.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={
                    selectedProject.videoUrl.includes('vimeo.com')
                      ? `https://player.vimeo.com/video/${selectedProject.videoUrl.split('/').pop()}?autoplay=1&loop=1&muted=0`
                      : `https://www.youtube.com/embed/${selectedProject.videoUrl.includes('youtu.be') ? selectedProject.videoUrl.split('/').pop() : selectedProject.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=0`
                  }
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedProject.videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                  playsInline
                />
              )}
            </div>
          ) : (
            <img
              src={selectedProject.thumbnailUrl}
              alt={selectedProject.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Right Details Panel */}
        <div className="w-full md:w-2/5 h-[calc(100%-240px)] md:h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto relative bg-white">
          
          {/* Top content */}
          <div>
            {/* Header info */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-0.5">
                {(selectedProject.client || selectedProject.year) && (
                  <span className="text-zinc-400 text-[10px] tracking-widest uppercase font-bold">
                    {selectedProject.client || 'Personal Project'} {selectedProject.year ? `// ${selectedProject.year}` : ''}
                  </span>
                )}
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-100 shadow-sm cursor-pointer z-10"
                aria-label="Close details"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Project Title */}
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight mb-3 pr-8 leading-tight">
              {selectedProject.title}
            </h2>

            {/* Tag Badges */}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {selectedProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-zinc-50 text-zinc-600 text-[9px] md:text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border border-zinc-200/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-[1px] bg-zinc-100 mb-5" />

            {/* Description Text */}
            <div className="text-zinc-600 text-xs md:text-sm leading-relaxed overflow-y-auto pr-2 max-h-[160px] md:max-h-[260px] scrollbar-thin">
              {selectedProject.description ? (
                <PortableText value={selectedProject.description} />
              ) : (
                <p className="whitespace-pre-line">{selectedProject.descriptionText}</p>
              )}
            </div>
          </div>

          {/* Bottom details footer */}
          <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-3">
            {/* Show Client / Year if not already shown inside top header */}
            <div className="flex flex-col gap-2 text-[11px] text-zinc-500">
              {selectedProject.client && (
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                  <span><strong>Client:</strong> {selectedProject.client}</span>
                </div>
              )}
              {selectedProject.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span><strong>Year:</strong> {selectedProject.year}</span>
                </div>
              )}
            </div>

            {selectedProject.videoUrl && !selectedProject.videoFileUrl && (
              <a
                href={selectedProject.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-colors shadow-md mt-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Full Film</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
