// Project data - edit this file to add/update projects

export interface Project {
  title: string;
  period: string;
  description: string;
  tech: { name: string; url: string }[];
  links: {
    live?: string;
    source?: string;
  };
  images: string[];
}

export const projects: Project[] = [
  {
    title: 'Little World Portfolio',
    period: 'October 2025 – Present',
    description: 'Personal homepage, blogs, projects for sharing experience. My first website built to learn web development, deployment, and more.',
    tech: [
      { name: 'HTML', url: 'https://developer.mozilla.org/docs/Web/HTML' },
      { name: 'CSS', url: 'https://developer.mozilla.org/docs/Web/CSS' },
      { name: 'JavaScript', url: 'https://developer.mozilla.org/docs/Web/JavaScript' },
      { name: 'Docker', url: 'https://www.docker.com/' },
      { name: 'Astro', url: 'https://astro.build/' }
    ],
    links: {
      live: 'https://zoskisk.vercel.app/',
      source: 'https://github.com/whoamilittl3fish/portfolio'
    },
    images: []
  },
  {
    title: 'Pawnshop Management App',
    period: 'June 2025 – September 2025',
    description: 'A simple, modern, and user-friendly pawnshop management software in Vietnamese language. Built for my uncle\'s business with real clients using it. Features include contract management with SQLite database.',
    tech: [
      { name: 'C#', url: 'https://learn.microsoft.com/dotnet/csharp/' },
      { name: 'SQLite', url: 'https://www.sqlite.org/index.html' },
      { name: '.NET Framework', url: 'https://learn.microsoft.com/dotnet/framework/' },
      { name: 'Windows Forms', url: 'https://learn.microsoft.com/dotnet/desktop/winforms/' }
    ],
    links: {
      source: 'https://github.com/whoamilittl3fish/QuanLyHopDong'
    },
    images: [
      '/assets/projects/pawnshop-app/1.png',
      '/assets/projects/pawnshop-app/2.png',
      '/assets/projects/pawnshop-app/3.png'
    ]
  }
];

