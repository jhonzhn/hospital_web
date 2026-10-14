document.addEventListener("DOMContentLoaded", () => {

    // Elimina solamente la cita de demostración usada en versiones anteriores.
    // Las citas reales se conservan porque incluyen un código de solicitud.
    const savedPatient = sessionStorage.getItem("sjdd_patient");
    if (savedPatient) {
        try {
            const patient = JSON.parse(savedPatient);
            const demoAppointment = patient.cita;
            const isLegacyDemo = demoAppointment && !demoAppointment.codigo &&
                demoAppointment.especialidad === "Medicina General" &&
                demoAppointment.medico === "Dr. Carlos Pérez" &&
                demoAppointment.fecha === "30/09/2026" &&
                demoAppointment.hora === "09:00 a. m." &&
                demoAppointment.ubicacion === "Puerta 3";

            if (isLegacyDemo) {
                delete patient.cita;
                sessionStorage.setItem("sjdd_patient", JSON.stringify(patient));
            }
        } catch (_) {
            sessionStorage.removeItem("sjdd_patient");
        }
    }

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
            nombre: "Paciente"

        };


        sessionStorage.setItem(
            "sjdd_patient",
            JSON.stringify(patientData)
        );


        window.location.href =
            "panel-paciente.html";

    });

});
