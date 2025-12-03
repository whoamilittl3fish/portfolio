// ui

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  // header
  const header = document.createElement("header");
  header.className = "project-card__header";

  const titleRow = document.createElement("div");
  titleRow.className = "project-card__title-row";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const toggleIcon = document.createElement("span");
  toggleIcon.className = "project-card__toggle";
  toggleIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';

  titleRow.append(title, toggleIcon);

  if (project.period) {
    const period = document.createElement("span");
    period.className = "project-card__period";
    period.textContent = project.period;
    header.append(titleRow, period);
  } else {
    header.appendChild(titleRow);
  }

  // preview
  const preview = document.createElement("p");
  preview.className = "project-card__preview";
  preview.textContent = project.description;

  // content
  const content = document.createElement("div");
  content.className = "project-card__content";

  const description = document.createElement("p");
  description.className = "project-card__description";
  description.textContent = project.description;

  // tech list
  const techList = document.createElement("ul");
  techList.className = "project-card__tech";

  project.tech?.forEach((tech) => {
    const techItem = document.createElement("li");
    techItem.className = "tech-pill";

    const techData = typeof tech === "string" ? { label: tech } : { ...tech };
    const label = techData.label ?? techData.name ?? "";

    if (!label) return;

    if (techData.url) {
      const link = document.createElement("a");
      link.href = techData.url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = label;
      techItem.classList.add("tech-pill--link");
      techItem.appendChild(link);
    } else {
      techItem.textContent = label;
    }

    techList.appendChild(techItem);
  });

  // links
  const linkGroup = document.createElement("div");
  linkGroup.className = "project-card__links";

  if (Array.isArray(project.links)) {
    project.links.forEach((link) => {
      if (!link.url) return;
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noreferrer noopener";

      if (link.icon) {
        a.innerHTML = link.icon + " " + (link.label || "");
      } else {
        a.textContent = link.label || "Link";
      }

      linkGroup.appendChild(a);
    });
  } else if (project.links) {
    if (project.links.live) {
      const liveLink = document.createElement("a");
      liveLink.href = project.links.live;
      liveLink.target = "_blank";
      liveLink.rel = "noreferrer noopener";
      liveLink.textContent = "Live demo";
      linkGroup.appendChild(liveLink);
    }
    if (project.links.source) {
      const sourceLink = document.createElement("a");
      sourceLink.href = project.links.source;
      sourceLink.target = "_blank";
      sourceLink.rel = "noreferrer noopener";
      sourceLink.textContent = "Source";
      linkGroup.appendChild(sourceLink);
    }
  }

  content.append(description, techList, linkGroup);

  // click to expand
  header.addEventListener("click", () => {
    card.classList.toggle("is-expanded");
  });

  card.append(header, preview, content);
  return card;
}

// render projects
function renderProjects() {
  const container = document.querySelector("#projects-list");
  const projects = window.portfolioProjects;

  if (!container || !Array.isArray(projects) || projects.length === 0) {
    return;
  }

  projects.forEach((project) => {
    const card = createProjectCard(project);
    container.appendChild(card);
  });
}

// init
// render projects and log success message to check if the projects are loaded successfully
function init() {
  renderProjects();
  console.log("🐾 Portfolio loaded successfully!");
}

document.addEventListener("DOMContentLoaded", init);
