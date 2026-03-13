import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function DripChart({ history }) {
    const data = {
        labels: history.map((_, i) => i),
        datasets: [
            {
                label: 'Fluid Level (mL)',
                data: history,
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 3,
                shadowColor: 'rgba(0, 229, 255, 0.3)',
                shadowBlur: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111111',
                titleColor: '#ffffff',
                bodyColor: '#00e5ff',
                borderColor: '#222222',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                min: 0,
                max: 500,
                grid: {
                    color: 'rgba(0, 229, 255, 0.03)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#707070',
                    font: { size: 10, weight: 'bold' },
                    stepSize: 100,
                },
            },
        },
        animations: {
            y: { duration: 500, easing: 'easeOutQuart' },
        },
    };

    return (
        <div style={{ height: '220px', width: '100%' }}>
            <Line data={data} options={options} />
        </div>
    );
}

export default DripChart;
