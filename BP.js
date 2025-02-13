function analyzeHealth() {
    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);
    const fasting = parseInt(document.getElementById('fasting').value);
    const postPrandial = parseInt(document.getElementById('postPrandial').value);

    const results = document.getElementById('results');
    results.innerHTML = '';

    const bpAnalysis = analyzeBP(systolic, diastolic);
    results.appendChild(createModernCard('Blood Pressure Analysis', bpAnalysis));

    const sugarAnalysis = analyzeSugar(fasting, postPrandial);
    results.appendChild(createModernCard('Blood Sugar Analysis', sugarAnalysis));
}

function analyzeBP(systolic, diastolic) {
    if (systolic < 90 || diastolic < 60) {
        return {
            status: 'Warning',
            message: 'Low Blood Pressure',
            details: 'Your blood pressure is below normal range',
            color: 'yellow',
            recommendations: [
                'Increase fluid and salt intake',
                'Rise slowly from sitting/lying positions',
                'Consider consulting your doctor',
                'Monitor symptoms of dizziness'
            ]
        };
    }
    // Add other BP analysis conditions here...
    return {
        status: 'Optimal',
        message: 'Normal Blood Pressure',
        details: 'Your blood pressure is in the healthy range',
        color: 'green',
        recommendations: [
            'Maintain healthy lifestyle',
            'Continue regular exercise',
            'Keep monitoring periodically',
            'Stay hydrated'
        ]
    };
}

function analyzeSugar(fasting, postPrandial) {
    if (fasting < 70) {
        return {
            status: 'Warning',
            message: 'Low Blood Sugar',
            details: 'Your blood sugar is below normal range',
            color: 'yellow',
            recommendations: [
                'Consume fast-acting carbohydrates',
                'Monitor levels more frequently',
                'Have regular meals',
                'Consult healthcare provider'
            ]
        };
    }
    // Add other sugar analysis conditions here...
    return {
        status: 'Optimal',
        message: 'Normal Blood Sugar',
        details: 'Your blood sugar levels are in the healthy range',
        color: 'green',
        recommendations: [
            'Maintain balanced diet',
            'Continue regular exercise',
            'Monitor periodically',
            'Stay consistent with meal timing'
        ]
    };
}

function createModernCard(title, analysis) {
    const card = document.createElement('div');
    card.className = `bg-white rounded-xl p-6 shadow-lg card-hover overflow-hidden ${
        analysis.color === 'green' ? 'border-l-4 border-green-500' :
        analysis.color === 'yellow' ? 'border-l-4 border-yellow-500' :
        analysis.color === 'orange' ? 'border-l-4 border-orange-500' : 'border-l-4 border-red-500'
    }`;

    const statusColorClass = 
        analysis.color === 'green' ? 'bg-green-100 text-green-800' :
        analysis.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
        analysis.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800';

    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-800">${title}</h3>
            <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColorClass}">
                ${analysis.status}
            </span>
        </div>
        <div class="space-y-4">
            <div>
                <p class="text-lg font-medium text-gray-800">${analysis.message}</p>
                <p class="text-gray-600">${analysis.details}</p>
            </div>
            <div class="space-y-2">
                <h4 class="font-medium text-gray-800">Recommendations:</h4>
                <ul class="space-y-2">
                    ${analysis.recommendations.map(rec => `
                        <li class="flex items-center text-gray-600">
                            <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
                            </svg>
                            ${rec}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    return card;
}