const AppController = (function() {
async function iniciar() {
         await QuizEngine.cargarPreguntas();
         UIRenderer.renderLogin(true);
     }

    function iniciarQuiz() {
        const documento = document.getElementById("documento-input").value.trim();
        if (documento === "") {
            alert("Por favor ingresa tu documento");
            return;
        }

        if (!HistoryManager.puedeRepetirQuiz(documento)) {
            UIRenderer.renderEspera(documento);
            return;
        }

        QuizEngine.iniciarQuiz(documento);
        UIRenderer.renderBienvenida(documento);
    }

    function comenzarQuiz() {
        const preguntas = QuizEngine.getQuestions();
        UIRenderer.renderPregunta(
            preguntas[0], 
            0, 
            preguntas.length, 
            QuizEngine.getPuntuacion(), 
            QuizEngine.getPuntosTotales()
        );
    }

    function mostrarLogin() {
        UIRenderer.renderLogin(true);
    }

    function mostrarHistorial() {
        UIRenderer.renderHistorial();
    }

    function reiniciar() {
        QuizEngine.reiniciar();
        UIRenderer.renderLogin(true);
    }

    function handleOptionClick(e) {
        if (e.target.classList.contains('option-btn') && !e.target.disabled) {
            const esCorrecto = e.target.dataset.correct === 'true';
            QuizEngine.verificarRespuesta(esCorrecto);
            const pregunta = QuizEngine.getQuestions()[QuizEngine.getIndiceActual()];
            UIRenderer.agregarFeedback(
                esCorrecto, 
                QuizEngine.getPuntuacion(), 
                pregunta, 
                QuizEngine.getPuntosTotales()
            );
        }
    }

    document.addEventListener('click', handleOptionClick);

    return {
        iniciar,
        iniciarQuiz,
        comenzarQuiz,
        mostrarLogin,
        mostrarHistorial,
        reiniciar
    };
})();