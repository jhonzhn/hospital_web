document.addEventListener(
    "DOMContentLoaded",
    function () {


    /* =====================================================
       LOGIN
    ====================================================== */

    const loginForm =
        document.getElementById(
            "portalLoginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const dniInput =
                    document.getElementById(
                        "dni"
                    );

                const message =
                    document.getElementById(
                        "portalLoginMessage"
                    );


                const dni =
                    dniInput.value.trim();


                if (!/^\d{8}$/.test(dni)) {

                    message.textContent =
                        "Ingresa un DNI válido de 8 dígitos.";

                    message.className =
                        "portal-login-message error";

                    return;

                }


                sessionStorage.setItem(
                    "sjdd_logged",
                    "true"
                );


                localStorage.setItem(
                    "sjdd_patient_dni",
                    dni
                );


                localStorage.setItem(
                    "sjdd_patient",
                    JSON.stringify({

                        dni: dni,

                        cita: {

                            especialidad:
                                "Medicina General",

                            medico:
                                "Dr. Carlos Pérez",

                            fecha:
                                "30/09/2026",

                            hora:
                                "09:00 a. m.",

                            ubicacion:
                                "Puerta 3"

                        }

                    })
                );


                message.textContent =
                    "Ingreso correcto...";

                message.className =
                    "portal-login-message success";


                setTimeout(
                    function () {

                        window.location.href =
                            "panel-paciente.html";

                    },
                    400
                );

            }
        );

    }



    /* =====================================================
       COMPROBAR SESIÓN
    ====================================================== */

    const dashboard =
        document.body.classList.contains(
            "portal-dashboard"
        );


    if (dashboard) {

        const logged =
            sessionStorage.getItem(
                "sjdd_logged"
            );


        if (logged !== "true") {

            window.location.href =
                "portal-paciente.html";

            return;

        }

    }



    /* =====================================================
       DATOS
    ====================================================== */

    let patient = {

        cita: {

            especialidad:
                "Medicina General",

            medico:
                "Dr. Carlos Pérez",

            fecha:
                "30/09/2026",

            hora:
                "09:00 a. m.",

            ubicacion:
                "Puerta 3"

        }

    };


    const stored =
        localStorage.getItem(
            "sjdd_patient"
        );


    if (stored) {

        try {

            patient =
                JSON.parse(
                    stored
                );

        } catch (error) {

            console.log(
                "No se pudo leer la información."
            );

        }

    }



    /* =====================================================
       MOSTRAR INFORMACIÓN
    ====================================================== */

    if (patient.cita) {

        const cita =
            patient.cita;


        const doctor =
            document.getElementById(
                "patientDoctor"
            );

        if (doctor) {

            doctor.textContent =
                cita.medico;

        }


        const specialty =
            document.getElementById(
                "patientSpecialty"
            );

        if (specialty) {

            specialty.textContent =
                cita.especialidad;

        }


        const date =
            document.getElementById(
                "patientDate"
            );

        if (date) {

            date.textContent =
                cita.fecha;

        }


        const time =
            document.getElementById(
                "patientTime"
            );

        if (time) {

            time.textContent =
                cita.hora;

        }


        const appointmentSpecialty =
            document.getElementById(
                "appointmentSpecialty"
            );

        if (appointmentSpecialty) {

            appointmentSpecialty.textContent =
                cita.especialidad;

        }


        const appointmentDoctor =
            document.getElementById(
                "appointmentDoctor"
            );

        if (appointmentDoctor) {

            appointmentDoctor.innerHTML =
                '<i class="fa-solid fa-user-doctor"></i> ' +
                cita.medico;

        }


        const appointmentTime =
            document.getElementById(
                "appointmentTime"
            );

        if (appointmentTime) {

            appointmentTime.textContent =
                cita.hora;

        }


        const appointmentLocation =
            document.getElementById(
                "appointmentLocation"
            );

        if (appointmentLocation) {

            appointmentLocation.textContent =
                cita.ubicacion;

        }


        const appointmentDay =
            document.getElementById(
                "appointmentDay"
            );


        if (appointmentDay) {

            appointmentDay.textContent =
                cita.fecha.split("/")[0];

        }

    }



    /* =====================================================
       FECHA
    ====================================================== */

    const currentDate =
        document.getElementById(
            "portalCurrentDate"
        );


    if (currentDate) {

        const today =
            new Date();


        currentDate.textContent =
            new Intl.DateTimeFormat(
                "es-PE",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(today);

    }



    /* =====================================================
       LOGOUT
    ====================================================== */

    const logout =
        document.getElementById(
            "logoutBtn"
        );


    if (logout) {

        logout.addEventListener(
            "click",
            function () {

                sessionStorage.removeItem(
                    "sjdd_logged"
                );

                localStorage.removeItem(
                    "sjdd_patient"
                );

                localStorage.removeItem(
                    "sjdd_patient_dni"
                );


                window.location.href =
                    "portal-paciente.html";

            }
        );

    }


});