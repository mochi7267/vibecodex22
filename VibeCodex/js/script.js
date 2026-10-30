/* =========================================
   VIBECODEX — MAIN JAVASCRIPT
   File: js/script.js
   ========================================= */

"use strict";

/* =========================================
   1. ENABLE JAVASCRIPT-BASED ANIMATIONS
   ========================================= */

document.documentElement.classList.add("js-enabled");


/* =========================================
   2. WAIT UNTIL THE HTML IS READY
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       3. CINEMATIC WELCOME INTRO
       ===================================== */

    const introOverlay = document.getElementById("introOverlay");
    const introStartButton = document.getElementById("introStartButton");

    // The requested intro duration is approximately 14 seconds.
    const INTRO_DURATION = 14000;

    let introTimeout = null;
    let introDismissed = false;

    function closeIntro() {
        if (!introOverlay || introDismissed) {
            return;
        }

        introDismissed = true;

        // Stop the automatic timer if the user skips the intro.
        if (introTimeout !== null) {
            window.clearTimeout(introTimeout);
            introTimeout = null;
        }

        // Fade out the intro overlay.
        introOverlay.classList.add("intro-hidden");

        // Allow the page to scroll again.
        document.body.classList.remove("intro-active");

        // Remove the intro after its fade-out transition.
        window.setTimeout(function () {
            if (introOverlay && introOverlay.parentNode) {
                introOverlay.style.display = "none";
            }
        }, 1100);
    }

    if (introOverlay) {
        // Prevent the page from scrolling behind the intro.
        document.body.classList.add("intro-active");

        // Automatically close the intro after 14 seconds.
        introTimeout = window.setTimeout(function () {
            closeIntro();
        }, INTRO_DURATION);
    }

    if (introStartButton) {
        // Let visitors enter the website immediately.
        introStartButton.addEventListener("click", function () {
            closeIntro();
        });
    }


    /* =====================================
       4. MOBILE NAVIGATION
       ===================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    function closeMobileMenu() {
        if (!menuToggle || !navLinks) {
            return;
        }

        menuToggle.classList.remove("active");
        navLinks.classList.remove("nav-open");

        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && navLinks) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("nav-open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Close the mobile menu after a navigation link is selected.
        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                closeMobileMenu();
            });
        });

        // Close the menu when the visitor clicks outside it.
        document.addEventListener("click", function (event) {
            const clickedInsideMenu = navLinks.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });

        // Reset the mobile menu when returning to desktop width.
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================
       5. SCROLL REVEAL ANIMATIONS
       ===================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");

                        // Observe each element only until it appears.
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver.
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }


    /* =====================================
       6. SMOOTH SCROLLING
       ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            // Ignore empty hash links.
            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =====================================
       7. NAVBAR SCROLL EFFECT
       ===================================== */

    const navbar = document.querySelector(".navbar");

    function updateNavbar() {
        if (!navbar) {
            return;
        }

        if (window.scrollY > 30) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });


    /* =====================================
       8. AUTOMATIC FOOTER YEAR
       ===================================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================
       9. KEYBOARD ACCESSIBILITY
       ===================================== */

    // Allow visitors to skip the intro using the Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeIntro();
            closeMobileMenu();
        }
    });

});
