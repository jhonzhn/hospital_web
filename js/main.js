/* =========================================================
   CENTRO DE SALUD SAN JUAN DE DIOS
   JAVASCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const backToTop = document.getElementById("backToTop");


    /* =====================================================
       HEADER AL HACER SCROLL
    ====================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();



    /* =====================================================
       MENÚ MÓVIL
    ====================================================== */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            mainNav.classList.toggle("mobile-open");

            document.body.classList.toggle(
                "menu-open"
            );


            const icon =
                menuToggle.querySelector("i");

            if (
                mainNav.classList.contains(
                    "mobile-open"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        });


        /* Cerrar menú al seleccionar una página */

        const navLinks =
            mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove(
                        "mobile-open"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );


                    const icon =
                        menuToggle.querySelector("i");

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }
            );

        });

    }



    /* =====================================================
       BOTÓN VOLVER ARRIBA
    ====================================================== */

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }

    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

    updateBackToTop();


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }



    /* =====================================================
       ANIMACIONES AL HACER SCROLL
    ====================================================== */

    const elementsToReveal = document.querySelectorAll(
        ".specialty-card, " +
        ".service-card, " +
        ".support-feature, " +
        ".promotion-card, " +
        ".notice-card, " +
        ".portal-banner-inner, " +
        ".community-content, " +
        ".contact-preview-inner"
    );


    elementsToReveal.forEach(element => {

        element.classList.add("reveal");

    });


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elementsToReveal.forEach(element => {

        observer.observe(element);

    });



    /* =====================================================
       EFECTO DE MOVIMIENTO SUAVE EN TARJETAS
    ====================================================== */

    const cards = document.querySelectorAll(
        ".specialty-card, .service-card"
    );


    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 900
                ) return;


                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) /
                        centerY) * -2;

                const rotateY =
                    ((x - centerX) /
                        centerX) * 2;


                card.style.transform =
                    `perspective(700px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";

            }
        );

    });



    /* =====================================================
       FECHA ACTUAL
    ====================================================== */

    const currentYear =
        document.querySelector(
            "[data-current-year]"
        );

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }



    /* =====================================================
       ANIMACIÓN DE ENTRADA DEL HERO
    ====================================================== */

    const heroContent =
        document.querySelector(".hero-content");

    const heroVisual =
        document.querySelector(".hero-visual");


    if (heroContent) {

        heroContent.style.opacity = "0";
        heroContent.style.transform =
            "translateY(25px)";

        setTimeout(() => {

            heroContent.style.transition =
                "opacity .8s ease, transform .8s ease";

            heroContent.style.opacity = "1";

            heroContent.style.transform =
                "translateY(0)";

        }, 100);

    }


    if (heroVisual) {

        heroVisual.style.opacity = "0";
        heroVisual.style.transform =
            "translateY(30px)";

        setTimeout(() => {

            heroVisual.style.transition =
                "opacity 1s ease, transform 1s ease";

            heroVisual.style.opacity = "1";

            heroVisual.style.transform =
                "translateY(0)";

        }, 250);

    }



    /* =====================================================
       CERRAR MENÚ AL CAMBIAR A ESCRITORIO
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900 &&
                mainNav
            ) {

                mainNav.classList.remove(
                    "mobile-open"
                );

                document.body.classList.remove(
                    "menu-open"
                );

                if (menuToggle) {

                    const icon =
                        menuToggle.querySelector("i");

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }

            }

        }
    );



    /* =====================================================
       ANCLAS SUAVES
    ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const targetId =
                        anchor.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) return;


                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });



    /* =====================================================
       MENSAJE DE CONSOLA
    ====================================================== */

    console.log(
        "Centro de Salud San Juan de Dios — Web cargada correctamente."
    );

});