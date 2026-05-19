const ChartRenderer = (() => {
    function renderGrafica(config) {
        const canvas = document.getElementById('waveChart');
        if (!canvas) return;

        if (config.tipo === 'wave') {
            renderOndaSenoidal(canvas, config);
            return;
        }

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: config.tipo || 'line',
            data: {
                labels: config.etiquetas || [],
                datasets: [{
                    label: config.titulo || 'Gráfica',
                    data: config.datos || [],
                    borderColor: '#56AA90',
                    backgroundColor: 'rgba(86, 170, 144, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: config.titulo || '' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function renderOndaSenoidal(canvas, config) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const frecuencia = config.frecuencia || 2;
        const amplitud = config.amplitud || 1;
        const longitudOnda = config.longitudOnda || 60;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        const paddingPercentage = 0.15;
        const padding = {
            top: height * paddingPercentage,
            right: width * paddingPercentage,
            bottom: height * paddingPercentage,
            left: width * paddingPercentage
        };

        const axesTop = padding.top;
        const axesBottom = height - padding.bottom;
        const axesLeft = padding.left;
        const axesRight = width - padding.right;
        const axesCenterY = padding.top + (height - padding.top - padding.bottom) / 2;
        const axesWidth = axesRight - axesLeft;
        const axesHeight = axesBottom - axesTop;

        const waveAmplitude = Math.min((height - padding.top - padding.bottom) / 2.5, height * 0.4);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);

        const gridLinesX = 8;
        for (let i = 0; i <= gridLinesX; i++) {
            const x = axesLeft + (i / gridLinesX) * axesWidth;
            ctx.beginPath();
            ctx.moveTo(x, axesTop);
            ctx.lineTo(x, axesBottom);
            ctx.stroke();
        }

        const gridLinesY = 4;
        for (let j = 0; j <= gridLinesY; j++) {
            const y = axesTop + (j / gridLinesY) * axesHeight;
            ctx.beginPath();
            ctx.moveTo(axesLeft, y);
            ctx.lineTo(axesRight, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        ctx.strokeStyle = '#56AA90';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const maxPeriodsByWidth = Math.max(2, Math.floor(width / 100));
        const periodos = Math.min(frecuencia * 2, maxPeriodsByWidth);
        const pasos = Math.max(100, Math.floor(width / 2));
        for (let i = 0; i <= pasos; i++) {
            const x = axesLeft + (i / pasos) * axesWidth;
            const t = (i / pasos) * periodos * 2 * Math.PI;
            const y = axesCenterY + Math.sin(frecuencia * t) * waveAmplitude;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(axesLeft, axesCenterY);
        ctx.lineTo(axesRight, axesCenterY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(axesRight, axesCenterY);
        ctx.lineTo(axesRight - 8, axesCenterY - 5);
        ctx.moveTo(axesRight, axesCenterY);
        ctx.lineTo(axesRight - 8, axesCenterY + 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(axesLeft, axesTop);
        ctx.lineTo(axesLeft, axesBottom);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(axesLeft, axesTop);
        ctx.lineTo(axesLeft - 5, axesTop + 8);
        ctx.moveTo(axesLeft, axesTop);
        ctx.lineTo(axesLeft + 5, axesTop + 8);
        ctx.stroke();

        const fontSize = 11;
        ctx.font = `${fontSize}px "Segoe UI", sans-serif`;
        ctx.fillStyle = '#4a5568';
        ctx.textAlign = 'center';

        for (let i = 0; i <= periodos; i++) {
            const x = axesLeft + (i / periodos) * axesWidth;
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, axesCenterY - 5);
            ctx.lineTo(x, axesCenterY + 5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, axesTop);
            ctx.lineTo(x, axesBottom);
            ctx.stroke();

            ctx.fillText(i + 'T', x, axesCenterY + 18);
        }

        for (let j = 0; j <= gridLinesY; j++) {
            const y = axesTop + (j / gridLinesY) * axesHeight;
            ctx.beginPath();
            ctx.moveTo(axesLeft - 5, y);
            ctx.lineTo(axesLeft + 5, y);
            ctx.stroke();
        }
    }

    return {
        renderGrafica
    };
})();