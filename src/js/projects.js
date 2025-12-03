// projects data
const descriptions = {
  portfolio: 'Personal homepage,blogs,projects for sharing experience, also my first project as real website build by me to play and learn more about web development, website, vercal, deploy. So welcome you to my little world inside...',
  pawnshop: 'A simple, modern, and user-friendly pawnshop management software in Vietnamese language. This is my first project as a developer, build by me to learn more about C#/.NET-Windows Forms, database, UI/UX design, database management. Listen feedback from my client and improve the app to be more user-friendly and efficient.',
};

window.portfolioProjects = [
  {
    title: "Little World Portfolio",
    description: descriptions.portfolio,
    period: "October 2025 – Present",
    tech: [
      { label: "HTML", url: "https://developer.mozilla.org/docs/Web/HTML" },
      { label: "CSS", url: "https://developer.mozilla.org/docs/Web/CSS" },
      { label: "JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript" },
      { label: "Docker", url: "https://www.docker.com/" }
    ],
    links: [
      { label: "Live here where we are", url: "https://zoskisk.vercel.app/" },
      { 
        label: "Source", 
        url: "https://github.com/whoamilittl3fish/portfolio",
        icon: '<svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
      }
    ]
  },
  {
    title: "Pawnshop Management App",
    description: descriptions.pawnshop,
    period: "June 2025 – September 2025",
    tech: [
      { label: "C#", url: "https://learn.microsoft.com/dotnet/csharp/" },
      { label: "SQLite", url: "https://www.sqlite.org/index.html" },
      { label: ".NET Framework", url: "https://learn.microsoft.com/dotnet/framework/" },
      { label: "Windows Forms", url: "https://learn.microsoft.com/dotnet/desktop/winforms/" }
    ],
    links: [
      { label: "Review & Download", url: "https://github.com/whoamilittl3fish/QuanLyHopDong/releases" },
      { 
        label: "Github", 
        url: "https://github.com/whoamilittl3fish/QuanLyHopDong",
        icon: '<svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
      }
    ]
  }
];
