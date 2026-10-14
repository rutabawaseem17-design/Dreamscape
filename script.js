const dreamscape = document.getElementById("dreamscape");
const loader = document.getElementById("loader");

const starsContainer = document.getElementById("stars");
const particlesContainer = document.getElementById("magicParticles");

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

const wishForm = document.getElementById("wishForm");
const wishInput = document.getElementById("wishInput");
const charCount = document.getElementById("charCount");
const wishMessage = document.getElementById("wishMessage");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;



window.addEventListener("load", () => {
    window.setTimeout(() => {
        loader.classList.add("hidden");
    }, prefersReducedMotion ? 0 : 1300);
});



function createStars() {
    const fragment = document.createDocumentFragment();

    const totalStars = window.innerWidth < 650 ? 65 : 135;
    const starSymbols = ["·", "✦", "✧", "⋆"];

    for (let i = 0; i < totalStars; i++) {
        const star = document.createElement("span");

        star.className = "star";
        star.textContent = starSymbols[
            Math.floor(Math.random() * starSymbols.length)
        ];

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.fontSize = `${Math.random() * 10 + 5}px`;

        star.style.setProperty(
            "--duration",
            `${Math.random() * 3 + 2}s`
        );

        star.style.setProperty(
            "--delay",
            `${Math.random() * -5}s`
        );

        fragment.appendChild(star);
    }

    starsContainer.replaceChildren(fragment);
}



function createParticles() {
    const fragment = document.createDocumentFragment();

    const totalParticles = window.innerWidth < 650 ? 15 : 30;

    for (let i = 0; i < totalParticles; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particle.style.setProperty(
            "--duration",
            `${Math.random() * 7 + 6}s`
        );

        particle.style.setProperty(
            "--delay",
            `${Math.random() * -10}s`
        );

        fragment.appendChild(particle);
    }

    particlesContainer.replaceChildren(fragment);
}

createStars();
createParticles();



themeToggle.addEventListener("click", () => {
    const isDay = dreamscape.classList.toggle("day-mode");

    themeToggle.textContent = isDay ? "☾" : "☀";

    themeToggle.setAttribute(
        "aria-label",
        isDay ? "Switch to night mode" : "Switch to day mode"
    );

    themeToggle.setAttribute("aria-pressed", String(isDay));

    document.querySelector('meta[name="theme-color"]')
        .setAttribute("content", isDay ? "#eee5ff" : "#100d2c");
});



function closeMobileNav() {
    mobileNav.classList.remove("open");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
});

document.addEventListener("click", (event) => {
    const clickedInsideNav =
        mobileNav.contains(event.target) ||
        menuToggle.contains(event.target);

    if (!clickedInsideNav) {
        closeMobileNav();
    }
});




wishInput.addEventListener("input", () => {
    charCount.textContent = `${wishInput.value.length} / 180`;

    wishMessage.textContent = "";
});



function createFlyingWish(wish) {
    const formRect = wishForm.getBoundingClientRect();
    const inputRect = wishInput.getBoundingClientRect();

    // Starting position: the wish-writing area.
    const startX = inputRect.left + inputRect.width / 2;
    const startY = inputRect.top + inputRect.height / 2;

    // Choose a random destination in the sky.
    const endX = Math.max(
        30,
        Math.min(
            window.innerWidth - 30,
            startX + (Math.random() - 0.5) * window.innerWidth * 0.75
        )
    );

    const endY = -100;

    // Intermediate position gives the flight a wandering effect.
    const midX = startX + (endX - startX) * 0.45;
    const midY = startY + (endY - startY) * 0.45;

    const flyingWish = document.createElement("div");

    flyingWish.className = "flying-wish";
    flyingWish.setAttribute("aria-hidden", "true");

    flyingWish.style.setProperty(
        "--flight-duration",
        prefersReducedMotion ? "0.5s" : `${4 + Math.random() * 1.2}s`
    );

    flyingWish.style.setProperty(
        "--flight-mid-x",
        `${midX}px`
    );

    flyingWish.style.setProperty(
        "--flight-mid-y",
        `${midY}px`
    );

    flyingWish.style.setProperty(
        "--flight-end-x",
        `${endX}px`
    );

    flyingWish.style.setProperty(
        "--flight-end-y",
        `${endY}px`
    );

    // Position the animated element at the wish box.
    flyingWish.style.transform = `translate(${startX}px, ${startY}px)`;

    const trail = document.createElement("span");
    trail.className = "flying-wish-trail";

    const star = document.createElement("span");
    star.className = "flying-wish-star";
    star.textContent = "✦";

    const wishText = document.createElement("span");
    wishText.className = "flying-wish-text";

    // Use textContent so user input is displayed as text, not HTML.
    wishText.textContent = wish;

    flyingWish.append(trail, star, wishText);
    document.body.appendChild(flyingWish);

    // Small sparkles around the beginning of the flight.
    createFlightSparkles(startX, startY);

    flyingWish.addEventListener("animationend", () => {
        flyingWish.remove();
    }, { once: true });

    // Safety cleanup if an animation is interrupted.
    window.setTimeout(() => {
        flyingWish.remove();
    }, prefersReducedMotion ? 1500 : 7000);
}



function createFlightSparkles(x, y) {
    const symbols = ["✧", "·", "✦", "⋆"];
    const sparkleCount = prefersReducedMotion ? 2 : 8;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement("span");

        sparkle.className = "flight-sparkle";

        sparkle.textContent = symbols[
            Math.floor(Math.random() * symbols.length)
        ];

        sparkle.style.left = `${x + (Math.random() - 0.5) * 130}px`;
        sparkle.style.top = `${y + (Math.random() - 0.5) * 70}px`;

        sparkle.style.fontSize = `${Math.random() * 12 + 8}px`;

        document.body.appendChild(sparkle);

        sparkle.addEventListener("animationend", () => {
            sparkle.remove();
        }, { once: true });
    }
}



wishForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const wish = wishInput.value.trim();

    if (!wish) {
        wishMessage.textContent =
            "Even the smallest star begins with a wish. ✧";

        wishInput.focus();
        return;
    }

    
    if (wish.length > 180) {
        wishMessage.textContent = "Keep your wish under 180 characters.";
        return;
    }

    createFlyingWish(wish);

    wishMessage.textContent =
        "Your wish is flying into the universe. Keep a little hope. ✨";

    
    wishInput.value = "";
    charCount.textContent = "0 / 180";

   
    window.setTimeout(() => {
        if (wishMessage.textContent.includes("flying into the universe")) {
            wishMessage.textContent = "";
        }
    }, 5000);
});




const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}



const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}




let previousMobileState = window.innerWidth < 650;

window.addEventListener("resize", () => {
    const currentMobileState = window.innerWidth < 650;

    // Avoid regenerating stars on every tiny window adjustment.
    if (currentMobileState !== previousMobileState) {
        previousMobileState = currentMobileState;

        createStars();
        createParticles();
    }
});
