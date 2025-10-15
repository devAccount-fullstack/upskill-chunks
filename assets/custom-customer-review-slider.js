document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".review-slider");
  if (!slider) return;

  const cards = Array.from(slider.children);
  if (cards.length === 0) return;

  if (cards.length <= 4) {
    slider.style.justifyContent = "center";
    slider.style.overflowX = "hidden";
    return;
  }

  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add("clone");
    slider.appendChild(clone);
  });

  let totalWidth = 0;
  let isHovered = false;
  let isDragging = false;
  let startX, scrollLeft;
  let rafId;
  const autoScrollSpeed = 0.5;

  function updateWidth() {
    totalWidth = slider.scrollWidth / 2;
  }

  window.addEventListener("load", () => {
    updateWidth();
    startAutoScroll();
  });

  window.addEventListener("resize", updateWidth);

  function autoScroll() {
    if (!isHovered && !isDragging) {
      slider.scrollLeft += autoScrollSpeed;

      if (slider.scrollLeft >= totalWidth) {
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

  // ✅ Hover behavior: stop scrolling or jump to start
  function handleHoverOrTouch() {
    isHovered = true;

    // When you hover, reset and keep looping from start
    slider.scrollLeft = 0;
    stopAutoScroll();
    startAutoScroll();
  }

  function handleLeave() {
    isHovered = false;
    startAutoScroll();
  }

  slider.addEventListener("mouseenter", handleHoverOrTouch);
  slider.addEventListener("mouseleave", handleLeave);

  // ✅ Touch Events for Phones
  slider.addEventListener("touchstart", (e) => {
    isDragging = true;
    isHovered = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    stopAutoScroll();
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;

    if (slider.scrollLeft >= totalWidth) slider.scrollLeft = 0;
    else if (slider.scrollLeft <= 0) slider.scrollLeft = totalWidth;
  });

  slider.addEventListener("touchend", () => {
    isDragging = false;
    isHovered = false;
    startAutoScroll();
  });
});
