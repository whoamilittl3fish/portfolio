const initCustomCursor = () => {
  const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;

    // check if the cursor is fine
  if (!prefersFinePointer) {
    return;
  }

  // create pointer rounded and pointed
  const cursorRounded =
    document.querySelector(".rounded") ?? document.createElement("div");
  const cursorPointed =
    document.querySelector(".pointed") ?? document.createElement("div");

  const ensureMounted = (el, className) => {
    if (!el.classList.contains(className)) {
      el.classList.add(className);
    }
    if (!el.isConnected) {
      document.body.appendChild(el);
    }
  };

  ensureMounted(cursorRounded, "rounded");
  ensureMounted(cursorPointed, "pointed");

  cursorRounded.classList.add("is-hidden");
  cursorPointed.classList.add("is-hidden");

  // move cursor
  const moveCursor = (event) => {
    const { clientX, clientY } = event;
    const translate = `translate3d(${clientX}px, ${clientY}px, 0)`;
    cursorRounded.style.transform = translate;
    cursorPointed.style.transform = translate;
  };

  const handleDown = () => {
    cursorRounded.classList.add("rounded--active");
    cursorPointed.classList.add("pointed--active");
  };

  const handleUp = () => {
    cursorRounded.classList.remove("rounded--active");
    cursorPointed.classList.remove("pointed--active");
  };

  const handleLeave = () => {
    cursorRounded.classList.add("is-hidden");
    cursorPointed.classList.add("is-hidden");
  };

  const handleEnter = () => {
    cursorRounded.classList.remove("is-hidden");
    cursorPointed.classList.remove("is-hidden");
  };

  window.addEventListener("mousemove", moveCursor, { passive: true });
  window.addEventListener("mousedown", handleDown);
  window.addEventListener("mouseup", handleUp);
  document.addEventListener("mouseleave", handleLeave);
  document.addEventListener("mouseenter", handleEnter);
};

document.addEventListener("DOMContentLoaded", initCustomCursor);

