document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("portalLoginForm");

    const dniInput =
        document.getElementById("dni");

    const error =
        document.getElementById("portalError");


    if (!form) return;


    form.addEventListener("submit", event => {

        event.preventDefault();


        const dni =
            dniInput.value.trim();


        if (!/^\d{8}$/.test(dni)) {

            error.textContent =
                "Ingresa un DNI válido de 8 dígitos.";

            dniInput.focus();

            return;
        }


        /*
            DEMOSTRACIÓN

            Cualquier DNI de 8 dígitos permite entrar.
            Más adelante esta parte deberá consultar
            una base de datos real.
        */


        const patientData = {

            dni: dni,

            cita: {

                especialidad: "Medicina General",

                medico: "Dr. Carlos Pérez",

                fecha: "30/09/2026",

                hora: "09:00 a. m.",

                ubicacion: "Puerta 3",

                estado: "Atención programada"

            }

        };


        sessionStorage.setItem(
            "sjdd_patient",
            JSON.stringify(patientData)
        );


        window.location.href =
            "panel-paciente.html";

    });

});