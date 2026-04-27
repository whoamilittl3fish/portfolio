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
    period: 'October 2025 to Present',
    description: 'Personal homepage, blogs, projects for sharing experience. My first website built to learn web development, deployment, and more.',
    tech: [
      { name: 'Astro', url: 'https://astro.build/' },
      { name: 'TypeScript', url: 'https://www.typescriptlang.org/' },
      { name: 'Resend', url: 'https://resend.com/' },
      { name: 'Cloudflare Turnstile', url: 'https://www.cloudflare.com/products/turnstile/' },
      { name: 'Vercel', url: 'https://vercel.com/' },
      { name: 'Docker', url: 'https://www.docker.com/' }
    ],
    links: {
      live: 'https://zoskisk.vercel.app/',
      source: 'https://github.com/whoamilittl3fish/portfolio'
    },
    images: []
  },
  {
    title: 'Pawnshop Management App',
    period: 'June 2025 to September 2025',
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

