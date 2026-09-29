document.addEventListener("DOMContentLoaded", function () {

    const modal =
        document.getElementById("specialtyModal");

    const modalOverlay =
        document.getElementById("specialtyModalOverlay");

    const closeButton =
        document.getElementById("specialtyModalClose");

    const title =
        document.getElementById("modalSpecialtyTitle");

    const number =
        document.getElementById("modalSpecialtyNumber");

    const description =
        document.getElementById("modalSpecialtyDescription");

    const video =
        document.getElementById("modalSpecialtyVideo");

    const videoSource =
        document.getElementById("modalVideoSource");

    const photoOne =
        document.getElementById("modalPhotoOne");

    const photoTwo =
        document.getElementById("modalPhotoTwo");

    const location =
        document.getElementById("modalLocation");


    let lastOpenedButton = null;


    const specialties = {

        cardiologia: {

            number: "01 · CARDIOLOGÍA",

            title: "Cardiología",

            description:
                "Área dedicada a la prevención, evaluación y atención relacionada con el corazón y el sistema circulatorio.",

            video:
                "img/especialidades/cardiologia/cardiologia.mp4",

            photoOne:
                "img/especialidades/cardiologia/entrada.jpg",

            photoTwo:
                "img/especialidades/cardiologia/puerta.jpg",

            location:
                "Puerta 3 · Área de Cardiología"

        },


        odontologia: {

            number: "02 · ODONTOLOGÍA",

            title: "Odontología",

            description:
                "Atención orientada al cuidado, prevención y mantenimiento de la salud bucal.",

            video:
                "img/especialidades/odontologia/odontologia.mp4",

            photoOne:
                "img/especialidades/odontologia/entrada.jpg",

            photoTwo:
                "img/especialidades/odontologia/puerta.jpg",

            location:
                "Puerta 4 · Área de Odontología"

        },


        pediatria: {

            number: "03 · PEDIATRÍA",

            title: "Pediatría",

            description:
                "Atención médica orientada a bebés, niños y adolescentes.",

            video:
                "img/especialidades/pediatria/pediatria.mp4",

            photoOne:
                "img/especialidades/pediatria/entrada.jpg",

            photoTwo:
                "img/especialidades/pediatria/puerta.jpg",

            location:
                "Puerta 5 · Área de Pediatría"

        },


        psicologia: {

            number: "04 · PSICOLOGÍA",

            title: "Psicología",

            description:
                "Orientación y acompañamiento relacionado con la salud mental y el bienestar emocional.",

            video:
                "img/especialidades/psicologia/psicologia.mp4",

            photoOne:
                "img/especialidades/psicologia/entrada.jpg",

            photoTwo:
                "img/especialidades/psicologia/puerta.jpg",

            location:
                "Puerta 6 · Área de Psicología"

        },


        nutricion: {

            number: "05 · NUTRICIÓN",

            title: "Nutrición",

            description:
                "Orientación para mejorar los hábitos alimenticios y promover una alimentación adecuada.",

            video:
                "img/especialidades/nutricion/nutricion.mp4",

            photoOne:
                "img/especialidades/nutricion/entrada.jpg",

            photoTwo:
                "img/especialidades/nutricion/puerta.jpg",

            location:
                "Puerta 7 · Área de Nutrición"

        }

    };


    function openModal(type, button) {

        const data =
            specialties[type];

        if (!data) {
            return;
        }


        lastOpenedButton = button;


        number.textContent =
            data.number;

        title.textContent =
            data.title;

        description.textContent =
            data.description;


        videoSource.src =
            data.video;

        video.load();


        photoOne.src =
            data.photoOne;

        photoOne.alt =
            "Entrada del área de " +
            data.title;


        photoTwo.src =
            data.photoTwo;

        photoTwo.alt =
            "Área de atención de " +
            data.title;


        location.textContent =
            data.location;


        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        closeButton.focus();

    }


    function closeModal() {

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );


        video.pause();

        video.currentTime = 0;


        if (lastOpenedButton) {

            lastOpenedButton.focus();

        }

    }


    document
        .querySelectorAll(".specialty-open")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const type =
                        this.dataset.specialty;

                    openModal(
                        type,
                        this
                    );

                }
            );

        });


    closeButton.addEventListener(
        "click",
        closeModal
    );


    modalOverlay.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeModal();

            }

        }
    );

});