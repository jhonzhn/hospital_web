/* =========================================================
   SAN JUAN DE DIOS
   JAVASCRIPT GENERAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER
    ===================================================== */

    const header = document.getElementById("siteHeader");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");

    if (menuToggle && mobileNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mobileNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );
        });


        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menú"
                );
            });

        });

    }

    /* Menú de las páginas internas */
    const internalMenu = document.querySelector(".main-header #mainNav");

    if (menuToggle && internalMenu && !mobileNav) {

        menuToggle.addEventListener("click", () => {
            const isOpen = internalMenu.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        internalMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => internalMenu.classList.remove("open"));
        });
    }

    /* Mantiene el mismo menú lateral en cada vista del portal. */
    const portalSidebar = document.querySelector(".portal-sidebar");

    if (portalSidebar) {

        const currentPage =
            window.location.pathname.split("/").pop();

        const portalItems = [
            ["panel-paciente.html", "fa-house", "Resumen"],
            ["mis-citas.html", "fa-calendar-check", "Mis citas"],
            ["mis-recetas.html", "fa-prescription-bottle-medical", "Tratamientos"],
            ["mis-consultas.html", "fa-stethoscope", "Consultas"],
            ["historial-clinico.html", "fa-file-medical", "Historial clínico"],
            ["mis-datos.html", "fa-user-pen", "Mis datos"]
        ];

        portalSidebar.innerHTML = `
            <span class="portal-sidebar-title">MENÚ PRINCIPAL</span>
            <nav class="portal-nav" aria-label="Navegación del portal">
                ${portalItems.map(([href, icon, label]) => `
                    <a href="${href}" class="portal-nav-item ${currentPage === href ? "active" : ""}">
                        <i class="fa-solid ${icon}"></i><span>${label}</span>
                    </a>
                `).join("")}
            </nav>`;
    }

    /* Sesión y acciones comunes del portal del paciente. */
    const isPrivatePortal = Boolean(document.querySelector(".portal-layout"));
    const patientSession = sessionStorage.getItem("sjdd_patient");

    if (isPrivatePortal && !patientSession) {
        window.location.href = "portal-paciente.html";
        return;
    }

    if (patientSession) {
        const patient = JSON.parse(patientSession);

        document.querySelectorAll("#portalUserName").forEach(element => {
            element.textContent = patient.nombre || "Paciente";
        });

        document.querySelectorAll("#portalUserDni").forEach(element => {
            element.textContent = `DNI: ${patient.dni || "--------"}`;
        });
    }

    document.querySelectorAll("#logoutBtn, #logoutButton, .portal-logout-btn")
        .forEach(button => {
            button.addEventListener("click", () => {
                sessionStorage.removeItem("sjdd_patient");
                window.location.href = "portal-paciente.html";
            });
        });

    const profileForm = document.getElementById("profileForm");

    if (profileForm && patientSession) {
        const patient = JSON.parse(patientSession);
        const fields = {
            profileFullName: "nombre",
            profileDni: "dni",
            profilePhone: "telefono",
            profileEmail: "correo",
            profileAddress: "direccion"
        };

        Object.entries(fields).forEach(([id, key]) => {
            const input = document.getElementById(id);
            if (input) input.value = patient[key] || "";
        });

        const profileName = document.getElementById("profileName");
        if (profileName) profileName.textContent = patient.nombre || "Paciente";

        profileForm.addEventListener("submit", event => {
            event.preventDefault();
            Object.entries(fields).forEach(([id, key]) => {
                const input = document.getElementById(id);
                if (input) patient[key] = input.value.trim();
            });
            sessionStorage.setItem("sjdd_patient", JSON.stringify(patient));
            if (profileName) profileName.textContent = patient.nombre || "Paciente";
            const status = document.getElementById("profileStatus");
            if (status) status.textContent = "Tus datos se guardaron correctamente.";
        });

        profileForm.querySelector(".portal-secondary-btn")?.addEventListener("click", () => {
            Object.entries(fields).forEach(([id, key]) => {
                const input = document.getElementById(id);
                if (input) input.value = patient[key] || "";
            });
        });
    }


    /* =====================================================
       AÑO AUTOMÁTICO
    ===================================================== */

    document
        .querySelectorAll("[data-current-year]")
        .forEach(element => {

            element.textContent = new Date().getFullYear();

        });


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        const updateBackToTop = () => {

            if (window.scrollY > 450) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }

        };

        updateBackToTop();

        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );


        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       REVEAL AL HACER SCROLL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (revealElements.length) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    }


    /* =====================================================
       EFECTO SUAVE EN ENLACES INTERNOS
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });

});
