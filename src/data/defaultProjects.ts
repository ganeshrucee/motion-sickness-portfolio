export interface ProjectItem {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnailUrl: string;
  videoUrl?: string;
  videoFileUrl?: string;
  description?: any[]; // Rich text or raw text fallback
  descriptionText?: string; // Standard text fallback
  tags?: string[];
  client?: string;
  year?: string;
}

export const defaultProjects: ProjectItem[] = [
  {
    _id: 'default-1',
    title: 'Fluid Dynamics',
    slug: { current: 'fluid-dynamics' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=600&q=80',
    videoFileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-liquid-gradient-under-a-microscope-41584-large.mp4',
    descriptionText: 'An immersive 3D fluid simulation exploring high-viscosity colorful dynamics in zero-gravity space. Rendered in Cinema 4D and Redshift with complex custom physics models to achieve real-time hyper-realistic wave dispersion.',
    tags: ['3D Motion', 'Fluid Simulation', 'Art Direction'],
    client: 'Noveau Arts',
    year: '2026'
  },
  {
    _id: 'default-2',
    title: 'Vortex Shift',
    slug: { current: 'vortex-shift' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&h=600&q=80',
    videoFileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4',
    descriptionText: 'A geometric abstraction focusing on refracting glass planes and generative vector fields. Features high-framerate dynamic camera cuts that create a hypnotic rhythm, syncing motion to auditory pitch cues.',
    tags: ['Kinetic Typography', 'Audio Reactive', 'Houdini'],
    client: 'Sonar Music',
    year: '2025'
  },
  {
    _id: 'default-3',
    title: 'Spectral Drift',
    slug: { current: 'spectral-drift' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&w=600&h=600&q=80',
    videoFileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-shifting-glass-panels-with-refractions-41585-large.mp4',
    descriptionText: 'A chrominance shader experiment focusing on soft light dispersion and glass caustics. Recreates the natural prism split of light passing through dense crystalline structures at varying angles of incidence.',
    tags: ['Lighting', 'Glass Refraction', 'C4D'],
    client: 'Prism Corp',
    year: '2026'
  },
  {
    _id: 'default-4',
    title: 'Gravity Wave',
    slug: { current: 'gravity-wave' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&h=600&q=80',
    videoFileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-of-colored-particles-on-black-background-41708-large.mp4',
    descriptionText: 'A mathematical study of vector fields represented through dense, self-illuminated particle flows. Developed inside Houdini using customized VEX expressions to simulate gravitational pull and particle decay.',
    tags: ['Houdini', 'Particles', 'Simulation'],
    client: 'NASA JPL (Fan-Art)',
    year: '2025'
  },
  {
    _id: 'default-5',
    title: 'Echo Chamber',
    slug: { current: 'echo-chamber' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&h=600&q=80',
    videoFileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glow-of-neural-network-nodes-41718-large.mp4',
    descriptionText: 'An aesthetic futuristic dark glass prism that reacts dynamically to sub-bass frequencies. The internal refraction indexes update in real-time based on audio spectral analysis data.',
    tags: ['Real-time', 'Audio Reactive', 'Shaders'],
    client: 'HyperDub Records',
    year: '2026'
  },
  {
    _id: 'default-6',
    title: 'Optic Flow',
    slug: { current: 'optic-flow' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&h=600&q=80',
    videoFileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-liquid-gradient-under-a-microscope-41584-large.mp4',
    descriptionText: 'A soft pastel gradient wave study that channels serene retro-minimalism. Crafted with organic wave-displacers in After Effects to create continuous, seamless loops of tranquil movement.',
    tags: ['After Effects', 'Minimalism', 'Looping'],
    client: 'Calm Inc',
    year: '2024'
  }
];
