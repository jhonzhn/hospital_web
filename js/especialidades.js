document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("specialtyModal");
    const modalClose = document.getElementById("modalSpecialtyClose");
    const modalTitle = document.getElementById("modalSpecialtyTitle");
    const modalDescription = document.getElementById("modalSpecialtyDescription");
    const modalConcept = document.getElementById("modalSpecialtyConcept");
    const modalLocation = document.getElementById("modalLocation");
    const modalVideo = document.getElementById("modalSpecialtyVideo");
    const videoPlaceholder = document.getElementById("videoPlaceholder");

    const specialties = {
        obstetricia: { title: "Obstetricia y salud materna", description: "Acompañamiento durante el embarazo, el puerperio y el cuidado de la salud sexual y reproductiva.", concept: "La obstetricia orienta el cuidado de la gestante y su bebé, promueve controles oportunos y resuelve dudas sobre planificación familiar y salud materna.", location: "Consulta la disponibilidad y el ambiente de atención en recepción.", youtube: "" },
        cardiologia: { title: "Cardiología", description: "Atención enfocada en la prevención y cuidado de la salud cardiovascular.", concept: "Ayuda a prevenir, evaluar y acompañar problemas relacionados con el corazón y la circulación, así como factores de riesgo como presión alta o colesterol.", location: "Consulta la puerta de atención y disponibilidad en recepción.", youtube: "" },
        odontologia: { title: "Odontología", description: "Cuidado, prevención y orientación para mantener una buena salud bucal.", concept: "Incluye evaluación de dientes y encías, educación para una correcta higiene bucal y orientación sobre tratamientos según la necesidad de cada paciente.", location: "Consulta la puerta de atención y disponibilidad en recepción.", youtube: "" },
        pediatria: { title: "Pediatría", description: "Atención médica orientada al cuidado de niños y adolescentes.", concept: "Acompaña el crecimiento, desarrollo y bienestar de niñas, niños y adolescentes, resolviendo consultas preventivas y de salud general.", location: "Consulta la puerta de atención y disponibilidad en recepción.", youtube: "" },
        psicologia: { title: "Psicología", description: "Espacio de acompañamiento para el bienestar emocional y psicológico.", concept: "Brinda escucha y orientación profesional para fortalecer el bienestar emocional, las relaciones y las herramientas para afrontar situaciones difíciles.", location: "Consulta la puerta de atención y disponibilidad en recepción.", youtube: "" },
        nutricion: { title: "Nutrición", description: "Orientación para desarrollar hábitos alimenticios saludables.", concept: "Ofrece orientación alimentaria personalizada para cada etapa de vida y ayuda a construir hábitos que favorezcan la salud y la prevención.", location: "Consulta la puerta de atención y disponibilidad en recepción.", youtube: "" }
    };

    const youtubeEmbed = (url) => {
        if (!url) return "";
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
        return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : "";
    };

    function openModal(key) {
        const specialty = specialties[key];
        if (!specialty) return;
        modalTitle.textContent = specialty.title;
        modalDescription.textContent = specialty.description;
        modalConcept.textContent = specialty.concept;
        modalLocation.textContent = specialty.location;
        const videoUrl = youtubeEmbed(specialty.youtube);
        if (videoUrl) {
            modalVideo.src = videoUrl;
            modalVideo.hidden = false;
            videoPlaceholder.hidden = true;
        } else {
            modalVideo.removeAttribute("src");
            modalVideo.hidden = true;
            videoPlaceholder.hidden = false;
        }
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        modalVideo.removeAttribute("src");
    }

    document.querySelectorAll(".specialty-open").forEach((card) => card.addEventListener("click", () => openModal(card.dataset.specialty)));
    modalClose.addEventListener("click", closeModal);
    modal.querySelectorAll("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });
});
