document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".review-slider");
  if (!slider) return;

  const cards = Array.from(slider.children);
  if (cards.length === 0) return;

  // Clone once for seamless looping
  const clones = cards.map(card => {
    const clone = card.cloneNode(true);
    clone.classList.add("clone");
    slider.appendChild(clone);
    return clone;
  });

  let originalWidth = 0;
  let isDragging = false;
  let isHovered = false;
  let isDown = false;
  let startX, scrollLeft;
  let autoScrollSpeed = 0.5; // px per frame
  let rafId;

  window.addEventListener("load", () => {
    originalWidth = slider.scrollWidth / 2;
    startAutoScroll();
  });

  function autoScroll() {
    if (!isHovered && !isDragging) {
      slider.scrollLeft += autoScrollSpeed;
      if (slider.scrollLeft >= originalWidth) {
        slider.scrollLeft = 0;
      }
    }
    rafId = requestAnimationFrame(autoScroll);
  }

  function startAutoScroll() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(autoScroll);
  }

  function stopAutoScroll() {
    cancelAnimationFrame(rafId);
  }

  slider.addEventListener("mouseenter", () => { isHovered = true; });
  slider.addEventListener("mouseleave", () => { isHovered = false; });

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    isDragging = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    stopAutoScroll();
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    isDragging = false;
    startAutoScroll();
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    isDragging = false;
    startAutoScroll();
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;
    if (slider.scrollLeft >= originalWidth) slider.scrollLeft = 0;
    else if (slider.scrollLeft <= 0) slider.scrollLeft = originalWidth;
  });

  // Touch support
  slider.addEventListener("touchstart", (e) => {
    isDragging = true;
    isHovered = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    stopAutoScroll();
  });

  slider.addEventListener("touchend", () => {
    isDragging = false;
    isHovered = false;
    startAutoScroll();
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;
    if (slider.scrollLeft >= originalWidth) slider.scrollLeft = 0;
    else if (slider.scrollLeft <= 0) slider.scrollLeft = originalWidth;
  });
});
