document.addEventListener("DOMContentLoaded", function () {

    const startMemory =
        document.getElementById(
            "startMemoryGame"
        );

    const startQuiz =
        document.getElementById(
            "startQuizGame"
        );

    const memoryGame =
        document.getElementById(
            "memoryGame"
        );

    const quizGame =
        document.getElementById(
            "quizGame"
        );

    const gameArea =
        document.getElementById(
            "gameArea"
        );

    const gameTitle =
        document.getElementById(
            "gameTitle"
        );

    const closeGame =
        document.getElementById(
            "closeGame"
        );


    /* =====================================================
       MOSTRAR JUEGO
    ====================================================== */

    function showGame(type) {

        gameArea.scrollIntoView({
            behavior: "smooth"
        });


        memoryGame.classList.remove(
            "active"
        );

        quizGame.classList.remove(
            "active"
        );


        if (type === "memory") {

            gameTitle.textContent =
                "Memoria saludable";

            memoryGame.classList.add(
                "active"
            );

            startMemoryGame();

        }


        if (type === "quiz") {

            gameTitle.textContent =
                "Quiz de salud";

            quizGame.classList.add(
                "active"
            );

            startQuizGame();

        }

    }


    /* =====================================================
       CERRAR
    ====================================================== */

    closeGame.addEventListener(
        "click",
        function () {

            memoryGame.classList.remove(
                "active"
            );

            quizGame.classList.remove(
                "active"
            );

            gameTitle.textContent =
                "Selecciona un juego";

        }
    );


    /* =====================================================
       JUEGO MEMORIA
    ====================================================== */

    const memoryIcons = [
        "🍎",
        "💧",
        "🥦",
        "🏃",
        "😴",
        "🦷"
    ];


    let memoryCards = [];

    let firstCard = null;

    let secondCard = null;

    let lockBoard = false;

    let matchedPairs = 0;


    function startMemoryGame() {

        const board =
            document.getElementById(
                "memoryBoard"
            );

        const message =
            document.getElementById(
                "memoryMessage"
            );


        board.innerHTML = "";

        message.textContent = "";

        firstCard = null;

        secondCard = null;

        lockBoard = false;

        matchedPairs = 0;


        memoryCards =
            [
                ...memoryIcons,
                ...memoryIcons
            ]
            .sort(
                () => Math.random() - 0.5
            );


        memoryCards.forEach(
            (icon, index) => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";

                button.className =
                    "memory-card";

                button.dataset.icon =
                    icon;

                button.dataset.index =
                    index;

                button.textContent =
                    "?";


                button.addEventListener(
                    "click",
                    function () {

                        flipCard(
                            button
                        );

                    }
                );


                board.appendChild(
                    button
                );

            }
        );

    }


    function flipCard(card) {

        if (
            lockBoard ||
            card === firstCard ||
            card.classList.contains(
                "matched"
            )
        ) {

            return;

        }


        card.classList.add(
            "flipped"
        );

        card.textContent =
            card.dataset.icon;


        if (!firstCard) {

            firstCard =
                card;

            return;

        }


        secondCard =
            card;


        checkMemoryMatch();

    }


    function checkMemoryMatch() {

        const isMatch =
            firstCard.dataset.icon ===
            secondCard.dataset.icon;


        if (isMatch) {

            firstCard.classList.add(
                "matched"
            );

            secondCard.classList.add(
                "matched"
            );

            matchedPairs++;

            resetMemoryCards();


            if (
                matchedPairs ===
                memoryIcons.length
            ) {

                document.getElementById(
                    "memoryMessage"
                ).textContent =
                    "¡Muy bien! Encontraste todas las parejas.";

            }

            return;

        }


        lockBoard = true;


        setTimeout(
            function () {

                firstCard.classList.remove(
                    "flipped"
                );

                secondCard.classList.remove(
                    "flipped"
                );

                firstCard.textContent =
                    "?";

                secondCard.textContent =
                    "?";

                resetMemoryCards();

            },
            800
        );

    }


    function resetMemoryCards() {

        firstCard = null;

        secondCard = null;

        lockBoard = false;

    }


    /* =====================================================
       QUIZ
    ====================================================== */

    const questions = [

        {

            question:
                "¿Cuál de estos hábitos ayuda a mantener una buena salud?",

            options: [
                "Dormir adecuadamente",
                "No beber agua",
                "Evitar toda actividad física",
                "Comer solo dulces"
            ],

            answer: 0

        },


        {

            question:
                "¿Qué se recomienda beber durante el día?",

            options: [
                "Agua",
                "Solo gaseosa",
                "Solo bebidas energéticas",
                "Ningún líquido"
            ],

            answer: 0

        },


        {

            question:
                "¿Qué ayuda a cuidar los dientes?",

            options: [
                "Cepillarlos regularmente",
                "No cepillarlos",
                "Comer muchos dulces",
                "No visitar al dentista"
            ],

            answer: 0

        },


        {

            question:
                "¿Qué actividad ayuda a mantenernos activos?",

            options: [
                "Caminar",
                "No movernos",
                "Dormir todo el día",
                "Evitar cualquier ejercicio"
            ],

            answer: 0

        }

    ];


    let currentQuestion = 0;

    let score = 0;


    function startQuizGame() {

        currentQuestion = 0;

        score = 0;

        renderQuestion();

    }


    function renderQuestion() {

        const question =
            questions[
                currentQuestion
            ];


        document.getElementById(
            "quizQuestion"
        ).textContent =
            question.question;


        document.getElementById(
            "quizScore"
        ).textContent =
            "Puntaje: " + score;


        const options =
            document.getElementById(
                "quizOptions"
            );


        options.innerHTML = "";


        question.options.forEach(
            (option, index) => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "quiz-option";

                button.textContent =
                    option;


                button.addEventListener(
                    "click",
                    function () {

                        selectAnswer(
                            button,
                            index
                        );

                    }
                );


                options.appendChild(
                    button
                );

            }
        );

    }


    function selectAnswer(
        button,
        selected
    ) {

        const question =
            questions[
                currentQuestion
            ];


        document
            .querySelectorAll(
                ".quiz-option"
            )
            .forEach(
                option => {

                    option.disabled =
                        true;

                }
            );


        if (
            selected ===
            question.answer
        ) {

            button.classList.add(
                "correct"
            );

            score++;

        } else {

            button.classList.add(
                "incorrect"
            );


            document
                .querySelectorAll(
                    ".quiz-option"
                )[
                    question.answer
                ]
                .classList.add(
                    "correct"
                );

        }


        document.getElementById(
            "quizScore"
        ).textContent =
            "Puntaje: " + score;

    }


    document
        .getElementById(
            "nextQuestion"
        )
        .addEventListener(
            "click",
            function () {

                currentQuestion++;


                if (
                    currentQuestion >=
                    questions.length
                ) {

                    document.getElementById(
                        "quizQuestion"
                    ).textContent =
                        "¡Terminaste el quiz!";

                    document.getElementById(
                        "quizOptions"
                    ).innerHTML = `
                        <p class="game-message">
                            Obtuviste ${score}
                            de ${questions.length}
                            respuestas correctas.
                        </p>
                    `;

                    currentQuestion = 0;

                    return;

                }


                renderQuestion();

            }
        );


    startMemory.addEventListener(
        "click",
        function () {

            showGame("memory");

        }
    );


    startQuiz.addEventListener(
        "click",
        function () {

            showGame("quiz");

        }
    );

});
