document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       JUEGO DE MEMORIA
    ============================== */

    const memoryBoard =
        document.getElementById("memoryBoard");

    const memoryMoves =
        document.getElementById("memoryMoves");

    const memoryRestart =
        document.getElementById("memoryRestart");


    const symbols = [
        "♥", "♥",
        "★", "★",
        "●", "●",
        "◆", "◆",
        "✚", "✚",
        "☀", "☀"
    ];


    let firstCard = null;
    let secondCard = null;
    let locked = false;
    let moves = 0;


    function shuffle(array) {

        return [...array].sort(
            () => Math.random() - 0.5
        );

    }


    function createMemoryGame() {

        memoryBoard.innerHTML = "";

        firstCard = null;
        secondCard = null;
        locked = false;
        moves = 0;

        updateMoves();


        shuffle(symbols).forEach(symbol => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "memory-card";

            button.textContent =
                symbol;

            button.dataset.symbol =
                symbol;

            button.addEventListener(
                "click",
                () => flipCard(button)
            );

            memoryBoard.appendChild(button);

        });

    }


    function flipCard(card) {

        if (
            locked ||
            card === firstCard ||
            card.classList.contains("matched")
        ) {
            return;
        }


        card.classList.add("flipped");


        if (!firstCard) {

            firstCard = card;
            return;

        }


        secondCard = card;

        moves++;

        updateMoves();

        checkCards();

    }


    function checkCards() {

        const match =
            firstCard.dataset.symbol ===
            secondCard.dataset.symbol;


        if (match) {

            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            resetSelection();

            return;
        }


        locked = true;


        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            resetSelection();

        }, 700);

    }


    function resetSelection() {

        firstCard = null;
        secondCard = null;
        locked = false;

    }


    function updateMoves() {

        memoryMoves.textContent =
            `${moves} movimiento${moves === 1 ? "" : "s"}`;

    }


    memoryRestart.addEventListener(
        "click",
        createMemoryGame
    );


    createMemoryGame();


    /* ==============================
       ADIVINA EL NÚMERO
    ============================== */

    const guessInput =
        document.getElementById("guessInput");

    const guessButton =
        document.getElementById("guessButton");

    const guessMessage =
        document.getElementById("guessMessage");

    const guessRestart =
        document.getElementById("guessRestart");


    let secretNumber =
        Math.floor(Math.random() * 20) + 1;


    function resetGuessGame() {

        secretNumber =
            Math.floor(Math.random() * 20) + 1;

        guessInput.value = "";

        guessMessage.textContent =
            "¡Inténtalo!";

        guessInput.focus();

    }


    function checkGuess() {

        const number =
            Number(guessInput.value);


        if (
            !number ||
            number < 1 ||
            number > 20
        ) {

            guessMessage.textContent =
                "Escribe un número del 1 al 20.";

            return;
        }


        if (number === secretNumber) {

            guessMessage.textContent =
                "🎉 ¡Correcto! ¡Lo encontraste!";

            return;
        }


        if (number < secretNumber) {

            guessMessage.textContent =
                "El número es mayor.";

        } else {

            guessMessage.textContent =
                "El número es menor.";

        }

    }


    guessButton.addEventListener(
        "click",
        checkGuess
    );


    guessInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                checkGuess();
            }

        }
    );


    guessRestart.addEventListener(
        "click",
        resetGuessGame
    );

});