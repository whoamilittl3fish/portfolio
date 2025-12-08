// ui - handle expand/collapse for project cards
function initProjectCards() {
  const cards = document.querySelectorAll(".project-card");
  
  cards.forEach((card) => {
    const header = card.querySelector(".project-card__header");
    if (header) {
      header.addEventListener("click", () => {
        card.classList.toggle("is-expanded");
      });
    }
  });
}

// lightbox functionality
let currentImageIndex = 0;
let imageList = [];

function initLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  if (!lightbox) return; // exit if lightbox doesn't exist
  
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__prev");
  const nextBtn = lightbox.querySelector(".lightbox__next");
  const galleryImages = document.querySelectorAll(".project-gallery__thumb");
  
  // defensive programming, check if all required elements exist
  if (!lightboxImage || !lightboxCaption || !closeBtn || !prevBtn || !nextBtn) {
    console.warn("Lightbox elements not found");
    return;
  }

  // handle image load errors
  galleryImages.forEach((img) => {
    img.addEventListener("error", () => {
      console.error("Failed to load image:", img.src);
      img.style.display = "none"; // Hide broken images
    });
  });

  // collect all gallery images
  galleryImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      const clickedImage = e.target;
      
      // get all images from the same gallery
      const gallery = clickedImage.closest(".project-gallery");
      if (gallery) {
        imageList = Array.from(gallery.querySelectorAll(".project-gallery__thumb"));
        currentImageIndex = imageList.indexOf(clickedImage);
        openLightbox(clickedImage);
      }
    });
  });

  // close lightbox
  function closeLightbox() {
    lightbox.classList.remove("is-active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // open lightbox
  function openLightbox(img) {
    const fullSrc = img.getAttribute("data-full") || img.src;
    const alt = img.getAttribute("alt") || "";
    
    lightboxImage.src = fullSrc;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    lightbox.classList.add("is-active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    
    updateNavigationButtons();
  }

  // update navigation buttons state
  function updateNavigationButtons() {
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === imageList.length - 1;
  }

  // navigate to previous image
  function showPrevious() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      const prevImg = imageList[currentImageIndex];
      const fullSrc = prevImg.getAttribute("data-full") || prevImg.src;
      lightboxImage.src = fullSrc;
      lightboxImage.alt = prevImg.getAttribute("alt") || "";
      lightboxCaption.textContent = prevImg.getAttribute("alt") || "";
      updateNavigationButtons();
    }
  }

  // navigate to next image
  function showNext() {
    if (currentImageIndex < imageList.length - 1) {
      currentImageIndex++;
      const nextImg = imageList[currentImageIndex];
      const fullSrc = nextImg.getAttribute("data-full") || nextImg.src;
      lightboxImage.src = fullSrc;
      lightboxImage.alt = nextImg.getAttribute("alt") || "";
      lightboxCaption.textContent = nextImg.getAttribute("alt") || "";
      updateNavigationButtons();
    }
  }

  // event listeners
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrevious);
  nextBtn.addEventListener("click", showNext);

  // close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        e.preventDefault();
        showPrevious();
        break;
      case "ArrowRight":
        e.preventDefault();
        showNext();
        break;
    }
  });
}

// init
function init() {
  initProjectCards();
  initLightbox();
  console.log("🐾 Portfolio loaded successfully!");
}

document.addEventListener("DOMContentLoaded", init);
