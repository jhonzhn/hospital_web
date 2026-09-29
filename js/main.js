document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const mobileNav = document.getElementById("mobileNav");
    const backToTop = document.getElementById("backToTop");


    /* HEADER */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 20) {
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


    /* MENÚ MÓVIL */

    if (menuToggle && mobileNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            });

        });

    }


    /* CERRAR MENÚ AL CAMBIAR A ESCRITORIO */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 850) {

            if (mobileNav) {
                mobileNav.classList.remove("open");
            }

            if (menuToggle) {
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            document.body.classList.remove(
                "menu-open"
            );
        }

    });


    /* VOLVER ARRIBA */

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

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* ANIMACIONES */

    const elements =
        document.querySelectorAll(
            ".intro-card, " +
            ".specialty-preview, " +
            ".value-card, " +
            ".why-item"
        );


    if ("IntersectionObserver" in window) {

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


        elements.forEach(element => {

            element.classList.add("reveal");

            observer.observe(element);

        });

    }


    /* AÑO */

    document
        .querySelectorAll("[data-current-year]")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });


    console.log(
        "San Juan de Dios: sitio cargado correctamente."
    );

});