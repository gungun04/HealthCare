const doctors = {
    dentist: [
        { id: 'd1', name: 'Dr. Sarah White', specialty: 'Dentist' },
        { id: 'd2', name: 'Dr. James Chen', specialty: 'Dentist' },
        { id: 'd3', name: 'Dr. Maria Garcia', specialty: 'Dentist' }
    ],
    cardiologist: [
        { id: 'c1', name: 'Dr. John Smith', specialty: 'Cardiologist' },
        { id: 'c2', name: 'Dr. Emily Johnson', specialty: 'Cardiologist' },
        { id: 'c3', name: 'Dr. Michael Brown', specialty: 'Cardiologist' }
    ],
    general: [
        { id: 'g1', name: 'Dr. David Wilson', specialty: 'General Physician' },
        { id: 'g2', name: 'Dr. Lisa Anderson', specialty: 'General Physician' },
        { id: 'g3', name: 'Dr. Robert Lee', specialty: 'General Physician' }
    ]
};

// Store appointments
let appointments = [];

// Handle specialty selection
document.getElementById('specialtySelect').addEventListener('change', function(e) {
    const doctorSelect = document.getElementById('doctorSelect');
    const specialty = e.target.value;
    
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    doctorSelect.disabled = !specialty;
    
    if (specialty) {
        doctors[specialty].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
});

// Generate unique ID for appointments
function generateAppointmentId() {
    return 'apt_' + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(time) {
    return time.replace(/(:\d{2}):\d{2}$/, "$1");
}

// Create appointment card
function createAppointmentCard(appointment) {
    return `
        <div class="appointment-card bg-white p-6 rounded-lg shadow-md" id="${appointment.id}">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-semibold">${appointment.doctorName}</h3>
                    <p class="text-gray-600">${appointment.specialty}</p>
                </div>
                <span class="text-2xl">🩺</span>
            </div>
            <div class="space-y-2">
                <p>📅 ${formatDate(appointment.date)}</p>
                <p>⏰ ${formatTime(appointment.time)}</p>
                <p>🏥 ${appointment.consultationType === 'online' ? 'Online Consultation' : 'In-person Visit'}</p>
            </div>
            <div class="flex space-x-2 mt-4">
                <button onclick="cancelAppointment('${appointment.id}')" 
                        class="flex-1 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200">
                    Cancel
                </button>
            </div>
        </div>
    `;
}

// Handle form submission
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const specialty = document.getElementById('specialtySelect');
    const doctorSelect = document.getElementById('doctorSelect');
    const selectedDoctor = doctors[specialty.value].find(d => d.id === doctorSelect.value);

    const appointment = {
        id: generateAppointmentId(),
        doctorId: doctorSelect.value,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        consultationType: document.querySelector('input[name="consultationType"]:checked').value,
        notes: document.getElementById('appointmentNotes').value
    };

    // Add to appointments array
    appointments.push(appointment);

    // Update UI
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.insertAdjacentHTML('beforeend', createAppointmentCard(appointment));

    // Reset form
    this.reset();
    doctorSelect.disabled = true;
    doctorSelect.innerHTML = '<option value="">First select a specialty</option>';

    // Show success message
    alert('Appointment booked successfully!');
});

// Cancel appointment
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        // Remove from array
        appointments = appointments.filter(apt => apt.id !== appointmentId);
        
        // Remove from UI
        const appointmentElement = document.getElementById(appointmentId);
        appointmentElement.classList.add('opacity-0');
        setTimeout(() => {
            appointmentElement.remove();
        }, 300);

        // Show confirmation
        alert('Appointment cancelled successfully');
    }
}

// Initialize with some sample appointments
window.addEventListener('load', function() {
    const sampleAppointment = {
        id: generateAppointmentId(),
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        date: '2025-03-15',
        time: '10:30',
        consultationType: 'in-person',
        notes: 'Regular checkup'
    };
    
    appointments.push(sampleAppointment);
    document.getElementById('appointmentsList').innerHTML = createAppointmentCard(sampleAppointment);
});

document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add appointment booking logic here
    alert('Appointment booked successfully!');
});