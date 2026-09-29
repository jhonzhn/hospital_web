/* =========================================================
   ESPECIALIDADES
   especialidades.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const specialtyCards =
        document.querySelectorAll(".specialty-card");

    const filterButtons =
        document.querySelectorAll("[data-specialty-filter]");

    const searchInput =
        document.querySelector("#specialtySearch");


    /* =====================================================
       CLICK EN ESPECIALIDAD
    ===================================================== */

    specialtyCards.forEach(card => {

        card.addEventListener("click", () => {

            const specialty =
                card.dataset.specialty;

            if (!specialty) return;

            openSpecialtyModal(specialty);

        });

    });


    /* =====================================================
       FILTROS
    ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter =
                button.dataset.specialtyFilter;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            filterSpecialties(filter);

        });

    });


    function filterSpecialties(filter) {

        specialtyCards.forEach(card => {

            const specialty =
                card.dataset.specialty;

            if (
                filter === "all" ||
                specialty === filter
            ) {

                card.style.display = "";

                setTimeout(() => {
                    card.classList.add("visible");
                }, 50);

            } else {

                card.style.display = "none";

            }

        });

    }


    /* =====================================================
       BUSCADOR
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();

            specialtyCards.forEach(card => {

                const text =
                    card.textContent.toLowerCase();

                if (text.includes(search)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }


    /* =====================================================
       MODAL DE ESPECIALIDAD
    ===================================================== */

    function openSpecialtyModal(specialty) {

        const card =
            document.querySelector(
                `.specialty-card[data-specialty="${specialty}"]`
            );

        if (!card) return;

        const title =
            card.dataset.title ||
            card.querySelector("h3")?.textContent ||
            specialty;

        const description =
            card.dataset.description ||
            "Información sobre esta especialidad médica.";

        const modal =
            document.createElement("div");

        modal.className =
            "specialty-modal-overlay";

        modal.innerHTML = `

            <div class="specialty-modal">

                <button
                    class="specialty-modal-close"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

                <div class="specialty-modal-icon">
                    <i class="fa-solid fa-stethoscope"></i>
                </div>

                <h2>${title}</h2>

                <p>
                    ${description}
                </p>

                <div class="specialty-modal-actions">

                    <a
                        href="portal/portal-paciente.html"
                        class="btn-primary"
                    >
                        Solicitar una cita
                    </a>

                    <button
                        class="btn-secondary specialty-modal-close-btn"
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        requestAnimationFrame(() => {

            modal.classList.add("active");

        });


        const closeModal = () => {

            modal.classList.remove("active");

            setTimeout(() => {

                modal.remove();

            }, 250);

        };


        modal
            .querySelector(".specialty-modal-close")
            .addEventListener(
                "click",
                closeModal
            );


        modal
            .querySelector(".specialty-modal-close-btn")
            .addEventListener(
                "click",
                closeModal
            );


        modal.addEventListener("click", event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        });

    }

});