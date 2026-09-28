/* =========================================================
   CITAS
   citas.js

   La reserva real se realizará dentro del
   Portal del Paciente.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const appointmentButtons =
        document.querySelectorAll(
            "[data-appointment]"
        );


    /* =====================================================
       BOTONES DE RESERVA
    ===================================================== */

    appointmentButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            goToPatientPortal();

        });

    });


    /* =====================================================
       IR AL PORTAL
    ===================================================== */

    function goToPatientPortal() {

        window.location.href =
            "portal/portal-paciente.html";

    }


    /* =====================================================
       MODAL DE INFORMACIÓN DE CITAS
    ===================================================== */

    const infoButtons =
        document.querySelectorAll(
            "[data-appointment-info]"
        );


    infoButtons.forEach(button => {

        button.addEventListener("click", () => {

            showAppointmentInformation();

        });

    });


    function showAppointmentInformation() {

        const modal =
            document.createElement("div");

        modal.className =
            "appointment-info-overlay";


        modal.innerHTML = `

            <div class="appointment-info-modal">

                <button
                    class="appointment-info-close"
                >
                    &times;
                </button>

                <div class="appointment-info-icon">
                    <i class="fa-regular fa-calendar-check"></i>
                </div>

                <h2>Reserva tu cita médica</h2>

                <p>
                    Para consultar disponibilidad,
                    seleccionar especialidad, médico,
                    fecha y horario, ingresa al
                    Portal del Paciente.
                </p>

                <div class="appointment-steps">

                    <div>
                        <span>1</span>
                        <p>Ingresa con tu DNI</p>
                    </div>

                    <div>
                        <span>2</span>
                        <p>Selecciona una especialidad</p>
                    </div>

                    <div>
                        <span>3</span>
                        <p>Selecciona médico, fecha y hora</p>
                    </div>

                    <div>
                        <span>4</span>
                        <p>Confirma tu cita</p>
                    </div>

                </div>

                <a
                    href="portal/portal-paciente.html"
                    class="btn-primary"
                >
                    Ingresar al Portal
                </a>

            </div>

        `;


        document.body.appendChild(modal);


        requestAnimationFrame(() => {

            modal.classList.add("active");

        });


        const closeButton =
            modal.querySelector(
                ".appointment-info-close"
            );


        function closeModal() {

            modal.classList.remove("active");

            setTimeout(() => {

                modal.remove();

            }, 250);

        }


        closeButton.addEventListener(
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