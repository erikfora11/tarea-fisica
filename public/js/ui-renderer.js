const UIRenderer = (() => {
    const temaEmojiMap = {
        "Péndulos": "🔮",
        "Pendulos": "🔮",
        "Resortes": "🌀",
        "Ondas": "🌊",
        "Ondas Mecánicas": "🌊",
        "Ondas Electromagnéticas": "⚡"
    };

    function getTemaEmoji(tema) {
        return temaEmojiMap[tema] || "📚";
    }

    function renderLogin(showHistorialBtn) {
        const historialLength = showHistorialBtn ? HistoryManager.cargarHistorial().length : 0;
        let botonesHTML = '<button class="bento-btn" onclick="AppController.iniciarQuiz()" style="flex: 1;">Ingresar</button>';
        if (historialLength > 0) {
            botonesHTML += '<button class="bento-btn" onclick="AppController.mostrarHistorial()" style="flex: 1; margin-left: 8px; background: linear-gradient(135deg, #E4B800, #D9A500);">Ver Historial (' + historialLength + ')</button>';
        }

        const contenedor = document.getElementById("quiz-grid");
        contenedor.innerHTML = 
            '<div class="bento-card card-pregunta" style="text-align: center;">' +
                '<h2 style="color: #56AA90; margin-bottom: 15px;">Bienvenido al Quiz</h2>' +
                '<p style="margin-bottom: 12px; font-size: clamp(0.9rem, 2vw, 1rem);">Por favor ingresa tu documento de identidad:</p>' +
                '<input type="text" id="documento-input" placeholder="Número de documento">' +
                '<div style="display: flex; gap: 8px; margin-top: 5px;">' +
                    botonesHTML +
                '</div>' +
            '</div>';
    }

    function renderBienvenida(documento) {
        const contenedor = document.getElementById("quiz-grid");
        contenedor.innerHTML = 
            '<div class="bento-card card-pregunta" style="text-align: center;">' +
                '<h2 style="color: #56AA90; margin-bottom: 15px;">¡Bienvenido, ' + documento + '!</h2>' +
                '<p style="font-size: clamp(0.9rem, 2.5vw, 1.1rem); margin-bottom: 12px;">Prepárate para poner a prueba tus conocimientos de Física II.</p>' +
                '<p style="margin-bottom: 15px;">El quiz consta de <strong>10 preguntas</strong> sobre:</p>' +
                '<ul style="text-align: left; margin: 0 auto 20px; padding-left: 20px; max-width: 300px; font-size: clamp(0.85rem, 2vw, 1rem);">' +
                    '<li>Péndulos y Resortes</li>' +
                    '<li>Características de Ondas</li>' +
                    '<li>Ondas Mecánicas y Electromagnéticas</li>' +
                '</ul>' +
                '<p style="margin-bottom: 20px;">Tu calificación máxima será de <strong>5.0 puntos</strong>.</p>' +
                '<button class="bento-btn" onclick="AppController.comenzarQuiz()" style="margin: 0 auto;">Comenzar Quiz</button>' +
            '</div>';
    }

    function renderPregunta(pregunta, indice, total, puntuacion, puntosTotales) {
        const contenedor = document.getElementById("quiz-grid");
        if (!contenedor) return;

        window.requestAnimationFrame(function() {
            const opcionesHTML = pregunta.opciones.map((opcion, i) => 
                '<button class="option-btn" data-correct="' + (i === pregunta.respuesta ? 'true' : 'false') + '">' + opcion + '</button>'
            ).join('');

            const temaEmoji = getTemaEmoji(pregunta.tema);
            const temaHTML = pregunta.tema ? '<span class="tema-badge"><span class="tema-emoji">' + temaEmoji + '</span> ' + pregunta.tema + '</span>' : '';
            const progreso = indice + 1;

            const graficaHTML = pregunta.grafica 
                ? '<div class="grafica-container"><canvas id="waveChart" style="width:100%;height:200px;"></canvas></div>' 
                : '';

            contenedor.innerHTML = 
                '<div class="bento-card card-pregunta">' +
                    '<div class="card-header">' +
                        '<span class="card-counter">Pregunta ' + progreso + '/' + total + '</span>' +
                        '<span class="puntuacion">Calificación: ' + puntuacion.toFixed(1) + '/' + puntosTotales + '.0</span>' +
                    '</div>' +
                    '<div class="progress-container"><div class="progress-bar" style="width: ' + (progreso/total*100) + '%;"></div></div>' +
                    temaHTML +
                    '<p class="pregunta-texto">' + pregunta.pregunta + '</p>' +
                    graficaHTML +
                    '<div class="opciones-container">' + opcionesHTML + '</div>' +
                '</div>';

            if (pregunta.grafica) {
                window.requestAnimationFrame(function() {
                    ChartRenderer.renderGrafica(pregunta.grafica);
                });
            }
        });
    }

    function renderEspera(documento) {
        const contenedor = document.getElementById("quiz-grid");
        contenedor.innerHTML = 
            '<div class="bento-card" style="text-align: center; padding: 25px 20px;">' +
                '<h2 style="color: #E58080; margin-bottom: 15px;">Debes esperar para repetir</h2>' +
                '<p style="margin-bottom: 15px; font-size: clamp(0.85rem, 2vw, 0.95rem);">Ya completaste el quiz recientemente con este documento.</p>' +
                '<p style="margin-bottom: 20px; font-size: clamp(0.9rem, 2vw, 1rem);">Puedes volver a intentarlo después de <strong>24 horas</strong> desde tu último intento.</p>' +
                '<button class="bento-btn" onclick="AppController.mostrarLogin()" style="margin: 0 auto;">Volver</button>' +
            '</div>';
    }

    function renderFin(documento, puntuacionFinal, puntosTotales) {
        const contenedor = document.getElementById("quiz-grid");

        let mensaje = '';
        if (puntuacionFinal >= 4.5) mensaje = '¡Excelente! Dominas la física.';
        else if (puntuacionFinal >= 3.5) mensaje = '¡Buen trabajo! Tienes buen conocimiento.';
        else if (puntuacionFinal >= 2.5) mensaje = 'Puedes mejorar. Sigue estudiando.';
        else mensaje = 'Necesitas repasar más. ¡Ánimo!';

        contenedor.innerHTML = 
            '<div class="bento-card card-pregunta" style="text-align: center;">' +
                '<h2 style="color: #56AA90; font-size: clamp(1.5rem, 4vw, 2rem); margin-bottom: 15px;">¡Quiz Completado!</h2>' +
                '<p style="font-size: clamp(1rem, 2.5vw, 1.2rem); margin-bottom: 8px;">Usuario: <strong>' + documento + '</strong></p>' +
                '<p style="font-size: clamp(1.2rem, 3vw, 1.5rem); margin-bottom: 10px;">Calificación final: <strong>' + puntuacionFinal.toFixed(1) + '/' + puntosTotales + '.0</strong></p>' +
                '<p style="font-size: clamp(0.9rem, 2vw, 1.1rem); margin-bottom: 25px;">' + mensaje + '</p>' +
                '<div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">' +
                    '<button class="bento-btn" onclick="AppController.reiniciar()" style="flex: 1; min-width: 140px;">Reiniciar Quiz</button>' +
                    '<button class="bento-btn" onclick="AppController.mostrarHistorial()" style="flex: 1; min-width: 140px; background: linear-gradient(135deg, #E4B800, #D9A500);">Ver Historial</button>' +
                '</div>' +
            '</div>';
    }

    function renderHistorial() {
        const contenedor = document.getElementById("quiz-grid");
        const historial = HistoryManager.cargarHistorial();

        let tablaHTML = 
            '<div class="bento-card" style="padding: 0; max-width: 700px; margin: 0 auto;">' +
                '<div class="card-historial-header">' +
                    '<h2>Historial de Intentos</h2>' +
                '</div>' +
                '<div style="padding: 0 20px 10px;">' +
                    '<table class="historial-table">' +
                        '<thead>' +
                            '<tr>' +
                                '<th style="width: 40%;">Fecha y Hora</th>' +
                                '<th style="width: 30%;">Documento</th>' +
                                '<th style="width: 15%;">Pregs</th>' +
                                '<th style="width: 15%;">Nota</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>';

        if (historial.length === 0) {
            tablaHTML += '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--texto-secundario);">No hay intentos registrados</td></tr>';
        } else {
            historial.forEach(item => {
                const notaColor = item.puntuacion >= 4.5 ? '#2D5016' : item.puntuacion >= 3.5 ? '#56AA90' : item.puntuacion >= 2.5 ? '#D97706' : '#DC2626';
                tablaHTML += 
                    '<tr>' +
                        '<td style="font-size: clamp(0.8rem, 1.8vw, 0.9rem);">' + item.fechaFormateada + '</td>' +
                        '<td><code style="background: var(--bento-bg-override); padding: 2px 6px; border-radius: 4px; font-size: 0.85rem;">' + item.documento + '</code></td>' +
                        '<td style="text-align: center;"><span style="background: linear-gradient(135deg, #56AA90, #4A957C); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: 600;">' + item.preguntas + '</span></td>' +
                        '<td style="text-align: center;"><strong style="color: ' + notaColor + ';">' + item.puntuacion.toFixed(1) + '</strong><span style="color: var(--texto-secundario); font-size: 0.8rem;">/' + item.total + '.0</span></td>' +
                    '</tr>';
            });
        }

        tablaHTML += 
                    '</tbody>' +
                '</table>' +
            '</div>' +
            '<div style="padding: 15px 20px; border-top: 1px solid var(--bento-border); background: var(--bento-bg-override);">' +
                '<button class="bento-btn" onclick="AppController.mostrarLogin()" style="margin: 0;">Volver al Quiz</button>' +
            '</div>' +
        '</div>';

        contenedor.innerHTML = tablaHTML;
    }

    function agregarFeedback(esCorrecto, puntuacionActual, pregunta, puntosTotales) {
        const buttons = document.querySelectorAll('.option-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        var feedbackMsg = '';
        var hintMsg = '';
        if (esCorrecto) {
            document.querySelector('[data-correct="true"]').classList.add('correct-answer');
            feedbackMsg = '<div class="feedback correct">¡Correcto!</div>';
            if (pregunta.hints && pregunta.hints.correcto) {
                hintMsg = '<div class="card-feedback-correcto"><span class="hint-icon">💡</span>' + pregunta.hints.correcto + '</div>';
            }
        } else {
            buttons.forEach(btn => {
                if (btn.dataset.correct === 'true') {
                    btn.classList.add('correct-answer');
                } else {
                    btn.classList.add('wrong-answer');
                }
            });
            feedbackMsg = '<div class="feedback wrong">Incorrecto</div>';
            if (pregunta.hints && pregunta.hints.incorrecto) {
                hintMsg = '<div class="card-feedback-incorrecto"><span class="hint-icon">💡</span>' + pregunta.hints.incorrecto + '</div>';
            }
        }

        var card = document.querySelector('.bento-card');
        if (card) {
            var feedbackDiv = document.createElement('div');
            feedbackDiv.innerHTML = feedbackMsg + hintMsg;
            card.appendChild(feedbackDiv);

            var continueBtn = document.createElement('button');
            continueBtn.className = 'bento-btn';
            continueBtn.style.margin = '20px auto 0';
            continueBtn.style.display = 'block';
            continueBtn.innerHTML = 'Continuar';
            continueBtn.onclick = function() {
                const preguntas = QuizEngine.getQuestions();
                const finalizado = QuizEngine.avanzarPregunta();
                if (finalizado) {
                    const puntuacionFinal = QuizEngine.getPuntuacion();
                    const documento = QuizEngine.getUsuarioDocumento();
                    HistoryManager.guardarResultado(documento, puntuacionFinal, preguntas.length, QuizEngine.getPuntosTotales());
                    UIRenderer.renderFin(documento, puntuacionFinal, QuizEngine.getPuntosTotales());
                } else {
                    UIRenderer.renderPregunta(
                        preguntas[QuizEngine.getIndiceActual()], 
                        QuizEngine.getIndiceActual(), 
                        preguntas.length, 
                        QuizEngine.getPuntuacion(), 
                        QuizEngine.getPuntosTotales()
                    );
                }
            };
            card.appendChild(continueBtn);
            card.scrollTop = card.scrollHeight;
        }
    }

    return {
        renderLogin,
        renderBienvenida,
        renderPregunta,
        renderEspera,
        renderFin,
        renderHistorial,
        agregarFeedback
    };
})();