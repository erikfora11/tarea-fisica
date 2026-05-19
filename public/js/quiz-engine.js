const QuizEngine = (() => {
    const PUNTOS_TOTALES = 5;
    let preguntas = [];
    let indiceActual = 0;
    let puntuacion = 0;
    let puntosPorPregunta = 1;
    let usuarioDocumento = null;
    let jsonCargado = false;

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const backupQuestions = [
        { id: 1, tema: "Péndulos", pregunta: "¿Cuál es la fórmula del período de un péndulo simple?", opciones: ["T = 2π√(m/k)", "T = 2π√(L/g)", "T = 2π√(g/L)", "T = 2π√(k/m)"], respuesta: 1, hints: { correcto: "L es longitud, g es gravedad", incorrecto: "La fórmula con m y k es para masa-resorte" }},
        { id: 2, tema: "Resortes", pregunta: "¿Qué establece la Ley de Hooke?", opciones: ["F = ma", "F = -kx", "F = mv²/r", "F = Gm₁m₂/r²"], respuesta: 1, hints: { correcto: "F = -kx indica que la fuerza es proporcional a la deformación", incorrecto: "F = ma es la Segunda Ley de Newton" }},
        { id: 3, tema: "Ondas", pregunta: "¿Qué relación existe entre frecuencia y período?", opciones: ["f = T", "f = 1/T", "f = T²", "f = √T"], respuesta: 1, hints: { correcto: "La frecuencia es el inverso del período", incorrecto: "No son iguales, están inversamente relacionados" }},
        { id: 4, tema: "Mecanica", pregunta: "¿Qué representa la amplitud de una onda?", opciones: ["Número de oscilaciones por segundo", "Distancia entre crestas", "Desplazamiento máximo del equilibrio", "Velocidad de propagación"], respuesta: 2, hints: { correcto: "Es el desplazamiento máximo desde el punto de equilibrio", incorrecto: "Esa es la longitud de onda, no la amplitud" }},
        { id: 5, tema: "Electromagnetica", pregunta: "¿A qué velocidad se propagan las ondas electromagnéticas en el vacío?", opciones: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], respuesta: 1, hints: { correcto: "c ≈ 3×10⁸ m/s es la velocidad de la luz", incorrecto: "Esa velocidad es mucho menor al de la luz" }}
    ];

    async function cargarPreguntas() {
        try {
            const response = await fetch(window.location.origin + '/data/preguntas.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            jsonCargado = true;
            preguntas = shuffleArray(data).slice(0, 10);
            puntosPorPregunta = PUNTOS_TOTALES / preguntas.length;
            console.log('✅ preguntas.json cargado:', preguntas.length, 'preguntas');
        } catch (err) {
            jsonCargado = false;
            preguntas = shuffleArray(backupQuestions).slice(0, 10);
            puntosPorPregunta = PUNTOS_TOTALES / preguntas.length;
            console.warn('⚠️ Error cargando preguntas.json, usando respaldo:', err.message);
        }
    }

    function getQuestions() {
        return preguntas;
    }

    function getIndiceActual() {
        return indiceActual;
    }

    function getPuntuacion() {
        return puntuacion;
    }

    function getPuntosPorPregunta() {
        return puntosPorPregunta;
    }

    function getPuntosTotales() {
        return PUNTOS_TOTALES;
    }

    function getUsuarioDocumento() {
        return usuarioDocumento;
    }

    function esJsonCargado() {
        return jsonCargado;
    }

    function iniciarQuiz(documento) {
        usuarioDocumento = documento;
        indiceActual = 0;
        puntuacion = 0;
    }

    function verificarRespuesta(esCorrecta) {
        if (esCorrecta) {
            puntuacion += puntosPorPregunta;
            if (puntuacion > PUNTOS_TOTALES) puntuacion = PUNTOS_TOTALES;
        }
        return esCorrecta;
    }

    function avanzarPregunta() {
        if (indiceActual < preguntas.length - 1) {
            indiceActual++;
            return false;
        }
        return true;
    }

    function reiniciar() {
        usuarioDocumento = null;
        indiceActual = 0;
        puntuacion = 0;
    }

    return {
        cargarPreguntas,
        getQuestions,
        getIndiceActual,
        getPuntuacion,
        getPuntosPorPregunta,
        getPuntosTotales,
        getUsuarioDocumento,
        esJsonCargado,
        iniciarQuiz,
        verificarRespuesta,
        avanzarPregunta,
        reiniciar
    };
})();