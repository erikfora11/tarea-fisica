const HistoryManager = (() => {
    const MAX_HISTORIAL = 10;
    const STORAGE_KEY = 'quizHistorial';

    function cargarHistorial() {
        try {
            const historial = localStorage.getItem(STORAGE_KEY);
            if (!historial) return [];
            const parsed = JSON.parse(historial);
            if (!Array.isArray(parsed)) {
                console.warn('Historial corrupted: not an array. Resetting.');
                localStorage.removeItem(STORAGE_KEY);
                return [];
            }
            return parsed;
        } catch (err) {
            console.warn('Error parsing historial from localStorage:', err.message);
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
    }

    function guardarResultado(documento, puntuacionFinal, totalPreguntas, puntosTotales) {
        try {
            const historial = cargarHistorial();
            const nuevoResultado = {
                documento: documento,
                puntuacion: puntuacionFinal,
                total: puntosTotales,
                preguntas: totalPreguntas,
                fecha: new Date().toISOString(),
                fechaFormateada: new Date().toLocaleString('es-ES')
            };
            historial.unshift(nuevoResultado);
            if (historial.length > MAX_HISTORIAL) {
                historial.pop();
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
        } catch (err) {
            console.error('Error saving result to historial:', err.message);
        }
    }

    function puedeRepetirQuiz(documento) {
        const historial = cargarHistorial();
        if (historial.length === 0) return true;

        const ultimoIntento = historial.find(item => item.documento === documento);
        if (!ultimoIntento) return true;

        const ahora = new Date().getTime();
        const ultimaFecha = new Date(ultimoIntento.fecha).getTime();
        const horasTranscurridas = (ahora - ultimaFecha) / (1000 * 60 * 60);

        return horasTranscurridas >= 24;
    }

    return {
        cargarHistorial,
        guardarResultado,
        puedeRepetirQuiz
    };
})();