// create project card
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const header = document.createElement("header");
  header.className = "project-card__head";

  const title = document.createElement("h3");
  title.textContent = project.title;
  header.appendChild(title);

  if (project.period) {
    const period = document.createElement("span");
    period.className = "project-card__period";
    period.textContent = project.period;
    header.appendChild(period);
  }

  const description = document.createElement("p");
  description.className = "project-card__description";
  description.textContent = project.description;

  const techList = document.createElement("ul");
  techList.className = "project-card__tech";
  project.tech?.forEach((tech) => {
    const techItem = document.createElement("li");
    techItem.className = "tech-pill";

    const techData =
      typeof tech === "string" ? { label: tech } : { ...tech };
    const label = techData.label ?? techData.name ?? "";

    if (!label) {
      return;
    }

    if (techData.url) {
      const link = document.createElement("a");
      link.href = techData.url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = label;
      link.setAttribute("aria-label", `${label} documentation`);
      techItem.classList.add("tech-pill--link");
      techItem.appendChild(link);
    } else {
      techItem.textContent = label;
    }

    techList.appendChild(techItem);
  });

  const linkGroup = document.createElement("div");
  linkGroup.className = "project-card__links";
  if (project.links?.live) {
    const liveLink = document.createElement("a");
    liveLink.href = project.links.live;
    liveLink.target = "_blank";
    liveLink.rel = "noreferrer noopener";
    liveLink.textContent = "Live demo";
    linkGroup.appendChild(liveLink);
  }
  if (project.links?.source) {
    const sourceLink = document.createElement("a");
    sourceLink.href = project.links.source;
    sourceLink.target = "_blank";
    sourceLink.rel = "noreferrer noopener";
    sourceLink.textContent = "Source";
    linkGroup.appendChild(sourceLink);
  }

  card.append(header, description, techList, linkGroup);
  return card;
}

// render projects
function renderProjects() {
  const projectsContainer = document.querySelector("#projects-list");
  const projects = window.portfolioProjects;

  if (!projectsContainer || !Array.isArray(projects) || projects.length === 0) {
    return;
  }

  projects.forEach((project) => {
    const card = createProjectCard(project);
    projectsContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🐾 Portfolio loaded successfully!");
  renderProjects();
});