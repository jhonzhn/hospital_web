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


    /* =====================================================
       BURBUJA DE AYUDA (PÁGINAS PÚBLICAS)
    ===================================================== */

    if (!window.location.pathname.includes("/portal/")) {
        const helpChat = document.createElement("section");
        helpChat.className = "health-help-chat";
        helpChat.innerHTML = `
            <button class="health-help-toggle" type="button" aria-expanded="false" aria-controls="healthHelpPanel" aria-label="Abrir asistente de ayuda">
                <i class="fa-solid fa-comment-medical" aria-hidden="true"></i><span>¿Necesitas ayuda?</span>
            </button>
            <div class="health-help-panel" id="healthHelpPanel" hidden>
                <div class="health-help-header">
                    <div><i class="fa-solid fa-heart-pulse" aria-hidden="true"></i><strong>Asistente de orientación</strong><small>Centro de Salud San Juan de Dios</small></div>
                    <button class="health-help-close" type="button" aria-label="Cerrar asistente">×</button>
                </div>
                <div class="health-help-messages" aria-live="polite">
                    <div class="health-help-message bot">Hola. Puedo ayudarte a encontrar información, una especialidad o el acceso al portal. No realizo diagnósticos médicos.</div>
                </div>
                <div class="health-help-options" aria-label="Consultas rápidas">
                    <button type="button" data-question="cita">Quiero una cita</button>
                    <button type="button" data-question="especialidad">Ver especialidades</button>
                    <button type="button" data-question="portal">Ingresar al portal</button>
                    <button type="button" data-question="horario">Horarios y contacto</button>
                </div>
                <form class="health-help-form">
                    <label class="sr-only" for="healthHelpInput">Escribe tu consulta</label>
                    <input id="healthHelpInput" type="text" maxlength="220" placeholder="Escribe tu consulta" autocomplete="off">
                    <button type="submit" aria-label="Enviar consulta"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
                </form>
                <p class="health-help-note">Para una emergencia o malestar grave, busca atención inmediata.</p>
            </div>`;
        document.body.appendChild(helpChat);

        const toggle = helpChat.querySelector(".health-help-toggle");
        const panel = helpChat.querySelector(".health-help-panel");
        const close = helpChat.querySelector(".health-help-close");
        const messages = helpChat.querySelector(".health-help-messages");
        const form = helpChat.querySelector(".health-help-form");
        const input = helpChat.querySelector("input");

        const setOpen = (open) => {
            panel.hidden = !open;
            toggle.setAttribute("aria-expanded", String(open));
            if (open) input.focus();
        };

        const addMessage = (text, type = "bot", action = null) => {
            const message = document.createElement("div");
            message.className = `health-help-message ${type}`;
            message.textContent = text;
            if (action) {
                const link = document.createElement("a");
                link.href = action.href;
                link.textContent = action.label;
                message.appendChild(link);
            }
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;
        };

        const reply = (question) => {
            const text = question.toLowerCase();
            if (/cita|reservar|consulta/.test(text)) return addMessage("Puedes solicitar una cita desde el portal del paciente. Si necesitas orientación previa, revisa las especialidades.", "bot", { href: "portal/portal-paciente.html", label: "Ir al portal" });
            if (/especialidad|cardio|diente|odont|niñ|pediatr|psico|nutri|obstet/.test(text)) return addMessage("Tenemos información sobre Cardiología, Odontología, Pediatría, Psicología, Nutrición y Obstetricia.", "bot", { href: "especialidades.html", label: "Ver especialidades" });
            if (/portal|dni|resultado|historial/.test(text)) return addMessage("El portal te permite consultar información de atención, citas y datos personales con tu DNI.", "bot", { href: "portal/portal-paciente.html", label: "Ingresar al portal" });
            if (/horario|hora|contacto|direcci|teléfono|telefono|ubicaci/.test(text)) return addMessage("Revisa nuestros canales de atención y confirma la disponibilidad antes de tu visita.", "bot", { href: "contacto.html", label: "Ver contacto" });
            if (/dolor|fiebre|sangre|mareo|síntoma|sintoma|medicamento/.test(text)) return addMessage("No puedo evaluar síntomas ni indicar medicamentos. Si el malestar es intenso, repentino o te preocupa, busca atención inmediata. Para orientación no urgente, solicita una cita.", "bot", { href: "portal/portal-paciente.html", label: "Solicitar cita" });
            return addMessage("Puedo orientarte sobre citas, especialidades, el portal, horarios y contacto. También puedes escribirnos desde Contacto.", "bot", { href: "contacto.html", label: "Ir a contacto" });
        };

        toggle.addEventListener("click", () => setOpen(panel.hidden));
        close.addEventListener("click", () => setOpen(false));
        helpChat.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => {
            const question = button.textContent;
            addMessage(question, "user");
            reply(question);
        }));
        form.addEventListener("submit", event => {
            event.preventDefault();
            const question = input.value.trim();
            if (!question) return;
            addMessage(question, "user");
            input.value = "";
            reply(question);
        });
    }

});
