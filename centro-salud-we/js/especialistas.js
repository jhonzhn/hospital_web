/* =========================================================
   ESPECIALISTAS
   especialistas.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const doctorCards =
        document.querySelectorAll(".doctor-card");

    const searchInput =
        document.querySelector("#doctorSearch");

    const specialtyFilter =
        document.querySelector("#doctorSpecialty");


    /* =====================================================
       BUSCAR MÉDICOS
    ===================================================== */

    function filterDoctors() {

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";

        const specialty =
            specialtyFilter
                ? specialtyFilter.value
                : "all";


        doctorCards.forEach(card => {

            const name =
                card.dataset.name
                    ? card.dataset.name.toLowerCase()
                    : card.textContent.toLowerCase();

            const doctorSpecialty =
                card.dataset.specialty || "";


            const matchesSearch =
                name.includes(search);

            const matchesSpecialty =
                specialty === "all" ||
                doctorSpecialty === specialty;


            if (
                matchesSearch &&
                matchesSpecialty
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterDoctors
        );

    }


    if (specialtyFilter) {

        specialtyFilter.addEventListener(
            "change",
            filterDoctors
        );

    }


    /* =====================================================
       MODAL DEL MÉDICO
    ===================================================== */

    doctorCards.forEach(card => {

        const detailsButton =
            card.querySelector(
                "[data-doctor-details]"
            );

        if (detailsButton) {

            detailsButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openDoctorModal(card);

                }
            );

        }

    });


    function openDoctorModal(card) {

        const name =
            card.dataset.name ||
            "Especialista";

        const specialty =
            card.dataset.specialty ||
            "Especialidad médica";

        const schedule =
            card.dataset.schedule ||
            "Horario sujeto a disponibilidad.";

        const modal =
            document.createElement("div");

        modal.className =
            "doctor-modal-overlay";


        modal.innerHTML = `

            <div class="doctor-modal">

                <button
                    class="doctor-modal-close"
                >
                    &times;
                </button>

                <div class="doctor-avatar">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <h2>${name}</h2>

                <span class="doctor-specialty">
                    ${specialty}
                </span>

                <div class="doctor-information">

                    <div>
                        <i class="fa-regular fa-calendar"></i>
                        <strong>Horario</strong>
                        <p>${schedule}</p>
                    </div>

                </div>

                <div class="doctor-modal-actions">

                    <a
                        href="portal/portal-paciente.html"
                        class="btn-primary"
                    >
                        Reservar cita
                    </a>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        requestAnimationFrame(() => {

            modal.classList.add("active");

        });


        function closeModal() {

            modal.classList.remove("active");

            setTimeout(() => {

                modal.remove();

            }, 250);

        }


        modal
            .querySelector(".doctor-modal-close")
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