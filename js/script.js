"use strict";

// ==========================================================
// GLOBAL
// ==========================================================

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

// ==========================================================
// ENVELOPE / INVITATION
// ==========================================================

const envelope = document.getElementById("envelope");
const invitationStage = document.getElementById("invitation-stage");
const postcardPocket = document.getElementById("postcard-pocket");
const invitationNote = document.getElementById("invitation-note");
const envelopeLabel = document.getElementById("envelope-label");

if (
  envelope &&
  invitationStage &&
  postcardPocket &&
  invitationNote
) {
  // Enable the interactive envelope.
  invitationStage.classList.add("is-interactive");

  // Show envelope.
  envelope.hidden = false;

  // Initial closed state.
  postcardPocket.inert = true;
  invitationNote.setAttribute("aria-hidden", "true");

  envelope.addEventListener("click", () => {
    const isOpening =
      envelope.getAttribute("aria-expanded") !== "true";

    envelope.setAttribute(
      "aria-expanded",
      String(isOpening)
    );

    envelope.setAttribute(
      "aria-label",
      isOpening
        ? "Close our wedding invitation"
        : "Open our wedding invitation"
    );

    invitationStage.classList.toggle(
      "is-open",
      isOpening
    );

    envelope.classList.toggle(
      "is-open",
      isOpening
    );

    postcardPocket.inert = !isOpening;

    invitationNote.setAttribute(
      "aria-hidden",
      String(!isOpening)
    );

    if (envelopeLabel) {
      envelopeLabel.textContent = isOpening
        ? "Tap to close the invitation"
        : "Tap to open our invitation";
    }

    if (isOpening) {
      // IMPORTANT:
      // Explicitly make the postcard visible.
      postcardPocket.style.gridTemplateRows = "1fr";
      invitationNote.style.opacity = "1";
      invitationNote.style.transform = "translateY(0)";

      cinematicReveal();
      window.setTimeout(releasePetals, 900);
      showScrollCue(2400);
    } else {
      // Return to closed state.
      postcardPocket.style.gridTemplateRows = "0fr";
      invitationNote.style.opacity = "0";
      invitationNote.style.transform =
        "translateY(100px)";

      resetCinematicReveal();
      hideScrollCue();
    }
  });
}

// ==========================================================
// CINEMATIC POSTCARD REVEAL
// ==========================================================

function cinematicReveal() {
  if (!invitationNote) return;

  const elements = [
    invitationNote.querySelector(
      ".postcard-eyebrow"
    ),

    invitationNote.querySelector(
      ".postcard-intro"
    ),

    ...invitationNote.querySelectorAll(
      ".postcard-name"
    ),

    ...invitationNote.querySelectorAll(
      ".postcard-parent"
    ),

    invitationNote.querySelector(
      ".postcard-and"
    ),

    invitationNote.querySelector(
      ".postcard-forever"
    ),

    invitationNote.querySelector(
      ".postcard-message"
    ),

    invitationNote.querySelector(
      ".postcard-date"
    ),

    invitationNote.querySelector(
      ".explore-link"
    )
  ].filter(Boolean);

  // Always make the postcard visible.
  invitationNote.style.opacity = "1";
  invitationNote.style.transform =
    "translateY(0)";

  if (reducedMotion.matches) {
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform =
        "translateY(0)";
    });

    return;
  }

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform =
      "translateY(14px)";
    element.style.transition =
      "opacity 0.6s ease, transform 0.6s ease";
  });

  elements.forEach((element, index) => {
    window.setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform =
        "translateY(0)";
    }, 1350 + index * 80);
  });
}

// ==========================================================
// RESET CINEMATIC REVEAL
// ==========================================================

function resetCinematicReveal() {
  if (!invitationNote) return;

  const elements =
    invitationNote.querySelectorAll(
      ".postcard-eyebrow, .postcard-intro, .postcard-name, .postcard-parent, .postcard-and, .postcard-forever, .postcard-message, .postcard-date, .explore-link"
    );

  elements.forEach((element) => {
    element.style.opacity = "";
    element.style.transform = "";
    element.style.transition = "";
  });
}

// ==========================================================
// SCROLL CUE
// ==========================================================

function showScrollCue(delay = 1800) {
  const heroBottom =
    document.querySelector(".hero-bottom");

  if (!heroBottom) return;

  window.setTimeout(() => {
    heroBottom.textContent =
      "Scroll to discover our story ↓";

    heroBottom.classList.add(
      "scroll-cue"
    );
  }, delay);
}

function hideScrollCue() {
  const heroBottom =
    document.querySelector(".hero-bottom");

  if (!heroBottom) return;

  heroBottom.textContent =
    "Two days. A thousand memories. One beautiful beginning.";

  heroBottom.classList.remove(
    "scroll-cue"
  );
}

// ==========================================================
// FALLING PETALS
// ==========================================================

function releasePetals() {
  if (reducedMotion.matches) return;

  const layer =
    document.getElementById("petal-layer");

  if (!layer) return;

  layer.replaceChildren();

  for (let i = 0; i < 28; i++) {
    const petal =
      document.createElement("span");

    petal.className = "petal";

    petal.style.left =
      `${Math.random() * 100}%`;

    petal.style.animationDelay =
      `${Math.random() * 0.7}s`;

    petal.style.background =
      i % 2 === 0
        ? "#dfbc79"
        : "#c77982";

    petal.style.setProperty(
      "--drift",
      `${Math.random() * 220 - 110}px`
    );

    layer.appendChild(petal);

    window.setTimeout(() => {
      petal.remove();
    }, 4200);
  }
}

// ==========================================================
// SCROLL-TRIGGERED SECTION REVEALS
// ==========================================================

function initializeScrollReveals() {
  const sections =
    document.querySelectorAll(
      "main > section"
    );

  if (!sections.length) return;

  // No animation if reduced motion is enabled.
  if (reducedMotion.matches) {
    sections.forEach((section) => {
      section.classList.add(
        "is-visible"
      );
    });

    return;
  }

  sections.forEach(
    (section, index) => {
      if (index === 0) {
        // Hero is immediately visible.
        section.classList.add(
          "is-visible"
        );
      } else {
        section.classList.add(
          "reveal"
        );
      }
    }
  );

  const observer =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(
          (entry) => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -60px 0px"
      }
    );

  sections.forEach(
    (section, index) => {
      if (index !== 0) {
        observer.observe(section);
      }
    }
  );
}

initializeScrollReveals();

// Animate the mobile timeline cards as they enter the viewport.
(() => {
  const items = document.querySelectorAll(".timeline-item");
  const closing = document.getElementById("closing-screen");

  if (items.length && !reducedMotion.matches) {
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(24px)";
      item.style.transition = `opacity .7s ease ${index * 90}ms, transform .7s cubic-bezier(.22,1,.36,1) ${index * 90}ms`;
    });

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  if (closing && !reducedMotion.matches) {
    closing.style.opacity = "0";
    closing.style.transform = "translateY(30px)";
    closing.style.transition = "opacity 1s ease, transform 1s cubic-bezier(.22,1,.36,1)";

    const closingObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        closing.style.opacity = "1";
        closing.style.transform = "translateY(0)";
        observer.unobserve(closing);
      });
    }, { threshold: 0.18 });

    closingObserver.observe(closing);
  }
})();

// ==========================================================
// COUNTDOWN
// ==========================================================

const celebrationDate =
  new Date(
    "2027-01-26T00:00:00+05:30"
  );

const countdown =
  document.getElementById(
    "countdown"
  );

const countdownCaption =
  document.getElementById(
    "countdown-caption"
  );

const countdownFields = {
  days:
    document.getElementById(
      "days"
    ),

  hours:
    document.getElementById(
      "hours"
    ),

  minutes:
    document.getElementById(
      "minutes"
    ),

  seconds:
    document.getElementById(
      "seconds"
    )
};

function updateCountdown() {
  if (
    !countdown ||
    !countdownCaption
  ) {
    return false;
  }

  const difference =
    Math.max(
      0,
      celebrationDate.getTime() -
        Date.now()
    );

  if (difference === 0) {
    countdown.hidden = true;

    countdownCaption.textContent =
      "26 & 27 January 2027 · Two dates to cherish, forever.";

    return false;
  }

  countdown.hidden = false;

  countdownCaption.textContent =
    "Until 26 January 2027, midnight in Jaipur · Event timings to follow";

  const totalSeconds =
    Math.floor(
      difference / 1000
    );

  const values = {
    days: Math.floor(
      totalSeconds / 86400
    ),

    hours: Math.floor(
      (totalSeconds % 86400) /
        3600
    ),

    minutes: Math.floor(
      (totalSeconds % 3600) /
        60
    ),

    seconds:
      totalSeconds % 60
  };

  Object.entries(values).forEach(
    ([key, value]) => {
      if (
        countdownFields[key]
      ) {
        countdownFields[
          key
        ].textContent =
          String(value).padStart(
            2,
            "0"
          );
      }
    }
  );

  return true;
}

if (updateCountdown()) {
  const countdownInterval =
    window.setInterval(() => {
      if (!updateCountdown()) {
        window.clearInterval(
          countdownInterval
        );
      }
    }, 1000);
}

// ==========================================================
// CALENDAR
// ==========================================================

const calendarButton =
  document.getElementById(
    "calendar-button"
  );

const calendarAction =
  document.getElementById(
    "calendar-action"
  );

if (
  calendarButton &&
  calendarAction
) {
  calendarAction.hidden = false;

  calendarButton.addEventListener(
    "click",
    () => {
      const timestamp =
        new Date()
          .toISOString()
          .replace(
            /[-:]/g,
            ""
          )
          .replace(
            /\.\d{3}Z$/,
            "Z"
          );

      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Kaartik and Harsha//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "UID:kaartik-harsha-20270126@invitation.local",
        `DTSTAMP:${timestamp}`,
        "DTSTART;VALUE=DATE:20270126",
        "DTEND;VALUE=DATE:20270128",
        "SUMMARY:Kaartik & Harsha - Wedding Celebrations",
        "LOCATION:Neendar Heritage Resorts\\, Jaipur",
        "DESCRIPTION:26 Jan: Mehndi and Sangeet Night.\\n27 Jan: Haldi Carnival and Wedding.\\nExact event timings to be announced.",
        "END:VEVENT",
        "END:VCALENDAR"
      ];

      const calendar =
        lines
          .map((line) => {
            const chunks = [];
            let remaining = line;

            while (
              remaining.length >
              74
            ) {
              chunks.push(
                remaining.slice(
                  0,
                  74
                )
              );

              remaining =
                remaining.slice(
                  74
                );
            }

            chunks.push(remaining);

            return chunks.join(
              "\r\n "
            );
          })
          .join("\r\n") +
        "\r\n";

      const blob =
        new Blob(
          [calendar],
          {
            type:
              "text/calendar;charset=utf-8"
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "Kaartik-and-Harsha-Wedding.ics";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(
          url
        );
      }, 10000);
    }
  );
}

// ==========================================================
// SCRATCH-TO-REVEAL PHOTOS
// ==========================================================

function initializeScratchCards() {
  const cards = [
    ...document.querySelectorAll(".scratch-card")
  ];

  if (!cards.length) return;

  cards.forEach((card) => {
    const canvas = card.querySelector(".scratch-layer");
    const button = card.querySelector(".scratch-reveal-button");

    if (!canvas) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    let drawing = false;
    let lastPoint = null;
    let revealed = false;
    let checkCounter = 0;

    function resizeCanvas() {
      const rect = card.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paintCover(rect.width, rect.height);
    }

    function paintCover(width, height) {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#ead1a1");
      gradient.addColorStop(0.48, "#cba66a");
      gradient.addColorStop(1, "#9c7336");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      // Subtle paper-like flecks make the scratch surface feel physical.
      context.globalAlpha = 0.18;
      for (let i = 0; i < Math.floor(width * height / 1800); i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 0.5 + Math.random() * 1.5;
        context.fillStyle = i % 2 ? "#fff4d7" : "#6e4a1e";
        context.fillRect(x, y, size, size);
      }
      context.globalAlpha = 1;

      context.globalCompositeOperation = "destination-out";
    }

    function pointFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function scratchAt(point) {
      const rect = canvas.getBoundingClientRect();
      const radius = Math.max(22, Math.min(34, rect.width * 0.065));

      context.save();
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = radius * 2;
      context.beginPath();

      if (lastPoint) {
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(point.x, point.y);
      } else {
        context.moveTo(point.x, point.y);
        context.lineTo(point.x + 0.1, point.y + 0.1);
      }

      context.stroke();
      context.restore();
      lastPoint = point;

      checkCounter += 1;
      if (checkCounter % 12 === 0) {
        checkRevealPercentage();
      }
    }

    function checkRevealPercentage() {
      if (revealed) return;

      const sampleWidth = 70;
      const sampleHeight = 70;
      const sample = document.createElement("canvas");
      sample.width = sampleWidth;
      sample.height = sampleHeight;
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;

      sampleContext.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
      const pixels = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
      let transparent = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 45) transparent += 1;
      }

      const percentage = transparent / (sampleWidth * sampleHeight);
      if (percentage >= 0.55) revealCard();
    }

    function revealCard() {
      if (revealed) return;
      revealed = true;
      drawing = false;
      lastPoint = null;
      card.classList.remove("is-scratching");
      card.classList.add("is-revealed");
      canvas.setAttribute("aria-hidden", "true");
    }

    canvas.addEventListener("pointerdown", (event) => {
      if (revealed) return;
      drawing = true;
      lastPoint = null;
      card.classList.add("is-scratching");
      if (canvas.setPointerCapture && event.isPrimary) {
        canvas.setPointerCapture(event.pointerId);
      }
      scratchAt(pointFromEvent(event));
      event.preventDefault();
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!drawing || revealed) return;
      scratchAt(pointFromEvent(event));
      event.preventDefault();
    });

    const stopDrawing = (event) => {
      if (!drawing) return;
      drawing = false;
      lastPoint = null;
      card.classList.remove("is-scratching");
      if (
        canvas.releasePointerCapture &&
        canvas.hasPointerCapture?.(event.pointerId)
      ) {
        canvas.releasePointerCapture(event.pointerId);
      }
      checkRevealPercentage();
    };

    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);

    button?.addEventListener("click", revealCard);

    const image = card.querySelector("img");
    if (image) {
      image.addEventListener("error", () => {
        card.classList.add("photo-missing");
      });
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
  });
}

initializeScratchCards();

// ==========================================================
// OUR STORY CAROUSEL
// ==========================================================

(() => {
  const carousel =
    document.getElementById(
      "story-carousel"
    );

  if (!carousel) return;

  const viewport =
    carousel.querySelector(
      ".story-viewport"
    );

  const track =
    carousel.querySelector(
      ".story-track"
    );

  const slides = [
    ...carousel.querySelectorAll(
      ".story-slide"
    )
  ];

  const dots = [
    ...carousel.querySelectorAll(
      ".story-dot"
    )
  ];

  const previousButton =
    carousel.querySelector(
      ".story-prev"
    );

  const nextButton =
    carousel.querySelector(
      ".story-next"
    );

  const controls =
    carousel.querySelector(
      ".story-controls"
    );

  const currentLabel =
    document.getElementById(
      "story-current"
    );

  const status =
    document.getElementById(
      "story-status"
    );

  if (
    !viewport ||
    !track ||
    !slides.length
  ) {
    return;
  }

  let currentIndex = 0;
  let swipeStart = null;

  carousel.classList.add(
    "is-enhanced"
  );

  viewport.scrollLeft = 0;

  if (controls) {
    controls.hidden = false;
  }

  function showSlide(
    index,
    announce = true
  ) {
    currentIndex =
      (index + slides.length) %
      slides.length;

    track.style.transform =
      `translateX(-${
        currentIndex * 100
      }%)`;

    slides.forEach(
      (slide, slideIndex) => {
        const isActive =
          slideIndex ===
          currentIndex;

        slide.inert =
          !isActive;

        slide.setAttribute(
          "aria-hidden",
          String(!isActive)
        );
      }
    );

    dots.forEach(
      (dot, dotIndex) => {
        if (
          dotIndex ===
          currentIndex
        ) {
          dot.setAttribute(
            "aria-current",
            "true"
          );
        } else {
          dot.removeAttribute(
            "aria-current"
          );
        }
      }
    );

    if (currentLabel) {
      currentLabel.textContent =
        String(
          currentIndex + 1
        ).padStart(2, "0");
    }

    if (
      announce &&
      status
    ) {
      status.textContent =
        `Photo ${
          currentIndex + 1
        } of ${
          slides.length
        }`;
    }
  }

  if (previousButton) {
    previousButton.addEventListener(
      "click",
      () => {
        showSlide(
          currentIndex - 1
        );
      }
    );
  }

  if (nextButton) {
    nextButton.addEventListener(
      "click",
      () => {
        showSlide(
          currentIndex + 1
        );
      }
    );
  }

  dots.forEach(
    (dot, index) => {
      dot.addEventListener(
        "click",
        () => {
          showSlide(index);
        }
      );
    }
  );

  viewport.addEventListener(
    "keydown",
    (event) => {
      if (
        event.target !==
        viewport
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();

          showSlide(
            currentIndex - 1
          );

          break;

        case "ArrowRight":
          event.preventDefault();

          showSlide(
            currentIndex + 1
          );

          break;

        case "Home":
          event.preventDefault();

          showSlide(0);

          break;

        case "End":
          event.preventDefault();

          showSlide(
            slides.length - 1
          );

          break;
      }
    }
  );

  viewport.addEventListener(
    "touchstart",
    (event) => {
      if (
        event.touches.length !==
        1
      ) {
        swipeStart = null;
        return;
      }

      const touch =
        event.touches[0];

      swipeStart = {
        x: touch.clientX,
        y: touch.clientY
      };
    },
    {
      passive: true
    }
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      if (!swipeStart) {
        return;
      }

      const touch =
        event.changedTouches[0];

      const distanceX =
        touch.clientX -
        swipeStart.x;

      const distanceY =
        touch.clientY -
        swipeStart.y;

      swipeStart = null;

      const isHorizontalSwipe =
        Math.abs(distanceX) >
          50 &&
        Math.abs(distanceX) >
          Math.abs(distanceY) *
            1.3;

      if (!isHorizontalSwipe) {
        return;
      }

      if (distanceX < 0) {
        showSlide(
          currentIndex + 1
        );
      } else {
        showSlide(
          currentIndex - 1
        );
      }
    },
    {
      passive: true
    }
  );

  viewport.addEventListener(
    "touchcancel",
    () => {
      swipeStart = null;
    },
    {
      passive: true
    }
  );

  showSlide(0, false);
})();