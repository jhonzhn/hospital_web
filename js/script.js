document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MENÚ MÓVIL
    ========================================= */

    const menuButton = document.getElementById("menuButton");
    const mobileNav = document.getElementById("mobileNav");

    if (menuButton && mobileNav) {

        menuButton.addEventListener("click", () => {

            mobileNav.classList.toggle("open");

            const abierto = mobileNav.classList.contains("open");

            menuButton.setAttribute(
                "aria-label",
                abierto ? "Cerrar menú" : "Abrir menú"
            );

        });


        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                mobileNav.classList.remove("open");

                menuButton.setAttribute(
                    "aria-label",
                    "Abrir menú"
                );
            });

        });

    }


    /* =========================================
       CERRAR MENÚ SI SE CAMBIA A ESCRITORIO
    ========================================= */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900 && mobileNav) {
            mobileNav.classList.remove("open");
        }

    });


    /* =========================================
       ANIMACIÓN SUAVE AL HACER SCROLL
    ========================================= */

    const elements = document.querySelectorAll(
        ".intro-card, .specialty-preview, .value-card, .why-item"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );


        elements.forEach(element => {

            element.style.opacity = "0";
            element.style.transform = "translateY(15px)";
            element.style.transition =
                "opacity .5s ease, transform .5s ease";

            observer.observe(element);

        });

    }

});