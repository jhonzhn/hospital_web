document.addEventListener("DOMContentLoaded", () => {

    const modal =
        document.getElementById("specialtyModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalVideo =
        document.getElementById("modalVideo");

    const modalVideoSource =
        document.getElementById("modalVideoSource");

    const videoPlaceholder =
        document.getElementById("videoPlaceholder");

    const photoOne =
        document.getElementById("modalPhotoOne");

    const photoTwo =
        document.getElementById("modalPhotoTwo");


    const specialties = {

        cardiologia: {
            title: "Cardiología",
            description:
                "Atención enfocada en la prevención y cuidado de la salud cardiovascular.",
            location:
                "Área de Cardiología — consulta en la puerta indicada por recepción.",
            video:
                "img/especialidades/cardiologia/cardiologia.mp4",
            photoOne:
                "img/especialidades/cardiologia/entrada.jpg",
            photoTwo:
                "img/especialidades/cardiologia/puerta.jpg"
        },

        odontologia: {
            title: "Odontología",
            description:
                "Cuidado, prevención y orientación para mantener una buena salud bucal.",
            location:
                "Área de Odontología — consulta en la puerta indicada por recepción.",
            video:
                "img/especialidades/odontologia/odontologia.mp4",
            photoOne:
                "img/especialidades/odontologia/entrada.jpg",
            photoTwo:
                "img/especialidades/odontologia/puerta.jpg"
        },

        pediatria: {
            title: "Pediatría",
            description:
                "Atención médica orientada al cuidado de niños y adolescentes.",
            location:
                "Área de Pediatría — consulta en la puerta indicada por recepción.",
            video:
                "img/especialidades/pediatria/pediatria.mp4",
            photoOne:
                "img/especialidades/pediatria/entrada.jpg",
            photoTwo:
                "img/especialidades/pediatria/puerta.jpg"
        },

        psicologia: {
            title: "Psicología",
            description:
                "Espacio de acompañamiento para el bienestar emocional y psicológico.",
            location:
                "Área de Psicología — consulta en la puerta indicada por recepción.",
            video:
                "img/especialidades/psicologia/psicologia.mp4",
            photoOne:
                "img/especialidades/psicologia/entrada.jpg",
            photoTwo:
                "img/especialidades/psicologia/puerta.jpg"
        },

        nutricion: {
            title: "Nutrición",
            description:
                "Orientación para desarrollar hábitos alimenticios saludables.",
            location:
                "Área de Nutrición — consulta en la puerta indicada por recepción.",
            video:
                "img/especialidades/nutricion/nutricion.mp4",
            photoOne:
                "img/especialidades/nutricion/entrada.jpg",
            photoTwo:
                "img/especialidades/nutricion/puerta.jpg"
        }

    };


    function openModal(key) {

        const specialty =
            specialties[key];

        if (!specialty) return;


        modalTitle.textContent =
            specialty.title;

        modalDescription.textContent =
            specialty.description;

        modalLocation.textContent =
            specialty.location;


        modalVideoSource.src =
            specialty.video;

        modalVideo.load();

        modalVideo.classList.remove(
            "has-video"
        );

        videoPlaceholder.style.display =
            "flex";


        fetch(specialty.video, {
            method: "HEAD"
        })
        .then(response => {

            if (response.ok) {

                modalVideo.classList.add(
                    "has-video"
                );

                videoPlaceholder.style.display =
                    "none";

            }

        })
        .catch(() => {});


        photoOne.src =
            specialty.photoOne;

        photoTwo.src =
            specialty.photoTwo;


        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

        modalClose.focus();

    }


    function closeModal() {

        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

        modalVideo.pause();

    }


    document
        .querySelectorAll(".specialty-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                openModal(
                    card.dataset.specialty
                );

            });

        });


    modalClose.addEventListener(
        "click",
        closeModal
    );


    document
        .querySelectorAll("[data-close-modal]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeModal
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("open")
            ) {
                closeModal();
            }

        }
    );

});