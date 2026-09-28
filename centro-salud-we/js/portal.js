/* =========================================================
   PORTAL DEL PACIENTE
   portal.js

   Sistema de demostración.
   La autenticación y los datos son simulados.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DATOS DE DEMOSTRACIÓN
    ===================================================== */

    const demoPatient = {

        dni: "12345678",

        nombre: "Juan Pérez García",

        fechaNacimiento: "15/08/2000",

        telefono: "987 654 321",

        correo: "juan.perez@email.com",

        direccion: "Pisco, Ica",

        seguro: "SIS",

        historiaClinica: "HC-2026-001",

        citas: [

            {
                id: 1,
                especialidad: "Medicina General",
                medico: "Dr. Carlos Pérez",
                fecha: "30/09/2026",
                hora: "09:00 a. m.",
                estado: "Confirmada"
            },

            {
                id: 2,
                especialidad: "Odontología",
                medico: "Dra. Laura Gómez",
                fecha: "05/10/2026",
                hora: "11:30 a. m.",
                estado: "Pendiente"
            }

        ],

        consultas: [

            {
                fecha: "15/09/2026",
                especialidad: "Medicina General",
                medico: "Dr. Carlos Pérez",
                motivo: "Consulta general",
                estado: "Atendida"
            },

            {
                fecha: "20/08/2026",
                especialidad: "Odontología",
                medico: "Dra. Laura Gómez",
                motivo: "Evaluación odontológica",
                estado: "Atendida"
            }

        ],

        recetas: [

            {
                fecha: "15/09/2026",
                medico: "Dr. Carlos Pérez",
                medicamento: "Paracetamol 500 mg",
                indicacion: "Según indicación médica"
            },

            {
                fecha: "20/08/2026",
                medico: "Dra. Laura Gómez",
                medicamento: "Medicamento odontológico",
                indicacion: "Según receta médica"
            }

        ]

    };


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function getCurrentPatient() {

        const saved =
            localStorage.getItem(
                "sjdd_patient"
            );

        if (saved) {

            try {

                return JSON.parse(saved);

            } catch (error) {

                console.error(
                    "Error leyendo paciente:",
                    error
                );

            }

        }

        return demoPatient;

    }


    function savePatient(patient) {

        localStorage.setItem(
            "sjdd_patient",
            JSON.stringify(patient)
        );

    }


    /* =====================================================
       LOGIN CON DNI
    ===================================================== */

    const loginForm =
        document.querySelector("#portalLoginForm");

    const dniInput =
        document.querySelector("#dni");

    const loginMessage =
        document.querySelector("#loginMessage");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const dni =
                    dniInput
                        ? dniInput.value.trim()
                        : "";


                if (!/^\d{8}$/.test(dni)) {

                    showLoginMessage(
                        "Ingresa un DNI válido de 8 dígitos.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   DEMO
                ========================================= */

                const patient = {
                    ...demoPatient,
                    dni: dni
                };


                savePatient(patient);


                sessionStorage.setItem(
                    "sjdd_logged",
                    "true"
                );


                showLoginMessage(
                    "Ingresando al Portal del Paciente...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "portal-paciente.html";

                }, 700);

            }
        );

    }


    function showLoginMessage(message, type) {

        if (!loginMessage) return;

        loginMessage.textContent =
            message;

        loginMessage.className =
            `login-message ${type}`;

    }


    /* =====================================================
       COMPROBAR SESIÓN
    ===================================================== */

    const isPortalPage =
        document.body.classList.contains(
            "portal-page"
        );


    if (isPortalPage) {

        const logged =
            sessionStorage.getItem(
                "sjdd_logged"
            );


        /*
         * Durante la demostración permitimos
         * visualizar el portal si no existe
         * todavía un sistema real de autenticación.
         */

        if (!logged) {

            // No redirigimos automáticamente
            // para facilitar las pruebas.

        }

    }


    /* =====================================================
       MOSTRAR DATOS DEL PACIENTE
    ===================================================== */

    const patient =
        getCurrentPatient();


    document.querySelectorAll(
        "[data-patient]"
    ).forEach(element => {

        const field =
            element.dataset.patient;

        if (
            patient[field] !== undefined
        ) {

            element.textContent =
                patient[field];

        }

    });


    /* =====================================================
       NOMBRE DEL PACIENTE
    ===================================================== */

    document.querySelectorAll(
        ".patient-name"
    ).forEach(element => {

        element.textContent =
            patient.nombre;

    });


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButtons =
        document.querySelectorAll(
            "[data-logout]"
        );


    logoutButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                logout();

            }
        );

    });


    function logout() {

        sessionStorage.removeItem(
            "sjdd_logged"
        );

        window.location.href =
            "../index.html";

    }


    /* =====================================================
       NAVEGACIÓN INTERNA DEL PORTAL
    ===================================================== */

    const portalLinks =
        document.querySelectorAll(
            "[data-portal-link]"
        );


    portalLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const destination =
                    link.dataset.portalLink;

                if (!destination) {
                    return;
                }

                event.preventDefault();

                window.location.href =
                    destination;

            }
        );

    });


    /* =====================================================
       MENÚ LATERAL
    ===================================================== */

    const portalMenuButton =
        document.querySelector(
            ".portal-menu-toggle"
        );

    const portalSidebar =
        document.querySelector(
            ".portal-sidebar"
        );


    if (
        portalMenuButton &&
        portalSidebar
    ) {

        portalMenuButton.addEventListener(
            "click",
            () => {

                portalSidebar.classList.toggle(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       CERRAR SIDEBAR AL HACER CLICK
    ===================================================== */

    document.querySelectorAll(
        ".portal-sidebar a"
    ).forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (portalSidebar) {

                    portalSidebar.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


    /* =====================================================
       RENDERIZAR CITAS
    ===================================================== */

    const appointmentsContainer =
        document.querySelector(
            "#appointmentsList"
        );


    if (appointmentsContainer) {

        renderAppointments(
            patient.citas || [],
            appointmentsContainer
        );

    }


    function renderAppointments(
        appointments,
        container
    ) {

        container.innerHTML = "";


        if (!appointments.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <i class="fa-regular fa-calendar-xmark"></i>

                    <h3>No tienes citas registradas</h3>

                    <p>
                        Cuando reserves una cita
                        aparecerá aquí.
                    </p>

                </div>

            `;

            return;

        }


        appointments.forEach(appointment => {

            const card =
                document.createElement("div");

            card.className =
                "appointment-card";


            card.innerHTML = `

                <div class="appointment-date">

                    <span>
                        ${appointment.fecha}
                    </span>

                    <strong>
                        ${appointment.hora}
                    </strong>

                </div>

                <div class="appointment-info">

                    <h3>
                        ${appointment.especialidad}
                    </h3>

                    <p>
                        ${appointment.medico}
                    </p>

                    <span class="status-badge">
                        ${appointment.estado}
                    </span>

                </div>

                <button
                    class="appointment-cancel"
                    data-cancel-id="${appointment.id}"
                >
                    Cancelar
                </button>

            `;


            container.appendChild(card);

        });


        container
            .querySelectorAll(
                "[data-cancel-id]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.cancelId
                            );

                        cancelAppointment(
                            id
                        );

                    }
                );

            });

    }


    /* =====================================================
       CANCELAR CITA
    ===================================================== */

    function cancelAppointment(id) {

        const patient =
            getCurrentPatient();


        const index =
            patient.citas.findIndex(
                appointment =>
                    appointment.id === id
            );


        if (index === -1) {
            return;
        }


        const confirmed =
            confirm(
                "¿Deseas cancelar esta cita?"
            );


        if (!confirmed) {
            return;
        }


        patient.citas.splice(
            index,
            1
        );


        savePatient(patient);


        const container =
            document.querySelector(
                "#appointmentsList"
            );


        if (container) {

            renderAppointments(
                patient.citas,
                container
            );

        }


        alert(
            "La cita ha sido cancelada."
        );

    }


    /* =====================================================
       RENDERIZAR CONSULTAS
    ===================================================== */

    const consultationsContainer =
        document.querySelector(
            "#consultationsList"
        );


    if (consultationsContainer) {

        renderConsultations(
            patient.consultas || [],
            consultationsContainer
        );

    }


    function renderConsultations(
        consultations,
        container
    ) {

        container.innerHTML = "";


        if (!consultations.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-notes-medical"></i>

                    <h3>No hay consultas registradas</h3>

                    <p>
                        Tus consultas aparecerán
                        aquí.
                    </p>

                </div>

            `;

            return;

        }


        consultations.forEach(consultation => {

            const item =
                document.createElement("div");

            item.className =
                "consultation-card";


            item.innerHTML = `

                <div class="consultation-icon">

                    <i class="fa-solid fa-stethoscope"></i>

                </div>

                <div>

                    <span class="consultation-date">
                        ${consultation.fecha}
                    </span>

                    <h3>
                        ${consultation.especialidad}
                    </h3>

                    <p>
                        ${consultation.medico}
                    </p>

                    <small>
                        Motivo:
                        ${consultation.motivo}
                    </small>

                </div>

                <span class="status-badge">
                    ${consultation.estado}
                </span>

            `;


            container.appendChild(item);

        });

    }


    /* =====================================================
       RENDERIZAR RECETAS
    ===================================================== */

    const prescriptionsContainer =
        document.querySelector(
            "#prescriptionsList"
        );


    if (prescriptionsContainer) {

        renderPrescriptions(
            patient.recetas || [],
            prescriptionsContainer
        );

    }


    function renderPrescriptions(
        prescriptions,
        container
    ) {

        container.innerHTML = "";


        if (!prescriptions.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-prescription-bottle-medical"></i>

                    <h3>No tienes recetas registradas</h3>

                    <p>
                        Tus recetas aparecerán aquí
                        cuando sean registradas.
                    </p>

                </div>

            `;

            return;

        }


        prescriptions.forEach(prescription => {

            const card =
                document.createElement("div");

            card.className =
                "prescription-card";


            card.innerHTML = `

                <div class="prescription-header">

                    <div>

                        <span>
                            ${prescription.fecha}
                        </span>

                        <h3>
                            ${prescription.medicamento}
                        </h3>

                    </div>

                    <i class="fa-solid fa-prescription-bottle-medical"></i>

                </div>

                <div class="prescription-body">

                    <p>
                        <strong>Médico:</strong>
                        ${prescription.medico}
                    </p>

                    <p>
                        <strong>Indicación:</strong>
                        ${prescription.indicacion}
                    </p>

                </div>

                <button
                    class="btn-secondary"
                    onclick="window.print()"
                >
                    <i class="fa-solid fa-print"></i>
                    Imprimir
                </button>

            `;


            container.appendChild(card);

        });

    }


    /* =====================================================
       MIS DATOS
    ===================================================== */

    const patientForm =
        document.querySelector(
            "#patientDataForm"
        );


    if (patientForm) {

        const fields = {

            nombre:
                patientForm.querySelector(
                    "[name='nombre']"
                ),

            telefono:
                patientForm.querySelector(
                    "[name='telefono']"
                ),

            correo:
                patientForm.querySelector(
                    "[name='correo']"
                ),

            direccion:
                patientForm.querySelector(
                    "[name='direccion']"
                )

        };


        Object.keys(fields).forEach(
            key => {

                if (
                    fields[key] &&
                    patient[key]
                ) {

                    fields[key].value =
                        patient[key];

                }

            }
        );


        patientForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const current =
                    getCurrentPatient();


                Object.keys(fields).forEach(
                    key => {

                        if (fields[key]) {

                            current[key] =
                                fields[key].value.trim();

                        }

                    }
                );


                savePatient(current);


                const message =
                    document.querySelector(
                        "#dataSavedMessage"
                    );


                if (message) {

                    message.textContent =
                        "Tus datos fueron actualizados correctamente.";

                    message.classList.add(
                        "show"
                    );

                } else {

                    alert(
                        "Tus datos fueron actualizados correctamente."
                    );

                }

            }
        );

    }


    /* =====================================================
       HISTORIAL CLÍNICO
    ===================================================== */

    const historyContainer =
        document.querySelector(
            "#clinicalHistory"
        );


    if (historyContainer) {

        renderClinicalHistory(
            patient,
            historyContainer
        );

    }


    function renderClinicalHistory(
        patient,
        container
    ) {

        container.innerHTML = `

            <div class="clinical-history-header">

                <div>

                    <span>
                        Historia Clínica
                    </span>

                    <h2>
                        ${patient.historiaClinica}
                    </h2>

                </div>

                <i class="fa-solid fa-file-medical"></i>

            </div>


            <div class="clinical-history-item">

                <div class="history-date">
                    15/09/2026
                </div>

                <div>

                    <h3>
                        Consulta médica
                    </h3>

                    <p>
                        Medicina General
                    </p>

                    <small>
                        Dr. Carlos Pérez
                    </small>

                </div>

            </div>


            <div class="clinical-history-item">

                <div class="history-date">
                    20/08/2026
                </div>

                <div>

                    <h3>
                        Evaluación odontológica
                    </h3>

                    <p>
                        Odontología
                    </p>

                    <small>
                        Dra. Laura Gómez
                    </small>

                </div>

            </div>

        `;

    }


    /* =====================================================
       MÉDICOS DEL PACIENTE
    ===================================================== */

    const doctorsContainer =
        document.querySelector(
            "#patientDoctors"
        );


    if (doctorsContainer) {

        renderPatientDoctors(
            doctorsContainer
        );

    }


    function renderPatientDoctors(
        container
    ) {

        container.innerHTML = `

            <div class="patient-doctor-card">

                <div class="doctor-avatar">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div>

                    <h3>
                        Dr. Carlos Pérez
                    </h3>

                    <p>
                        Medicina General
                    </p>

                </div>

            </div>


            <div class="patient-doctor-card">

                <div class="doctor-avatar">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div>

                    <h3>
                        Dra. Laura Gómez
                    </h3>

                    <p>
                        Odontología
                    </p>

                </div>

            </div>

        `;

    }


    /* =====================================================
       CONTADOR DE CITAS
    ===================================================== */

    const appointmentCount =
        document.querySelector(
            "#appointmentCount"
        );


    if (appointmentCount) {

        appointmentCount.textContent =
            patient.citas
                ? patient.citas.length
                : 0;

    }


    /* =====================================================
       CONTADOR DE CONSULTAS
    ===================================================== */

    const consultationCount =
        document.querySelector(
            "#consultationCount"
        );


    if (consultationCount) {

        consultationCount.textContent =
            patient.consultas
                ? patient.consultas.length
                : 0;

    }


    /* =====================================================
       CONTADOR DE RECETAS
    ===================================================== */

    const prescriptionCount =
        document.querySelector(
            "#prescriptionCount"
        );


    if (prescriptionCount) {

        prescriptionCount.textContent =
            patient.recetas
                ? patient.recetas.length
                : 0;

    }

});