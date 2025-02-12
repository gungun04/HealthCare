
        let medications = [];

        function openModal() {
            document.getElementById('addReminderModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('addReminderModal').style.display = 'none';
        }

        function addMedication(medication) {
            medications.push({
                ...medication,
                id: Date.now(),
                status: 'pending'
            });
            updateMedicationLists();
            closeModal();
            saveToLocalStorage();
        }

        function markAsTaken(id) {
            const med = medications.find(m => m.id === id);
            if (med) {
                med.status = 'taken';
                updateMedicationLists();
                saveToLocalStorage();
            }
        }

        function reschedule(id) {
            const med = medications.find(m => m.id === id);
            if (med) {
                med.time = moment().add(1, 'hour').format('HH:mm');
                med.status = 'pending';
                updateMedicationLists();
                saveToLocalStorage();
            }
        }

        function createMedicationItem(medication) {
            const li = document.createElement('li');
            li.className = `medication-item ${medication.status === 'missed' ? 'missed' : ''}`;
            
            const info = document.createElement('div');
            info.className = 'medication-info';
            info.innerHTML = `
                <div class="medication-time">${medication.time}</div>
                <div>${medication.name} - ${medication.dosage} ${medication.dosage === '1' ? 'tablet' : 'tablets'}</div>
                <div style="color: #666;">${medication.foodDependency === 'after' ? '(Take after meal)' : '(Take before meal)'}</div>
            `;

            const actions = document.createElement('div');
            actions.className = 'medication-actions';

            if (medication.status !== 'taken') {
                const takeButton = document.createElement('button');
                takeButton.className = 'button';
                takeButton.innerHTML = '✅ Take';
                takeButton.onclick = () => markAsTaken(medication.id);
                actions.appendChild(takeButton);

                if (medication.status === 'missed') {
                    const rescheduleButton = document.createElement('button');
                    rescheduleButton.className = 'button button-warning';
                    rescheduleButton.innerHTML = '🔄 Reschedule';
                    rescheduleButton.onclick = () => reschedule(medication.id);
                    actions.appendChild(rescheduleButton);
                }
            }

            li.appendChild(info);
            li.appendChild(actions);
            return li;
        }

        function updateMedicationLists() {
            const todayList = document.getElementById('todayMedications');
            const upcomingList = document.getElementById('upcomingMedications');
            const missedList = document.getElementById('missedMedications');
            
            todayList.innerHTML = '';
            upcomingList.innerHTML = '';
            missedList.innerHTML = '';

            const now = moment();

            medications.forEach(med => {
                const medTime = moment(med.time, 'HH:mm');
                const listItem = createMedicationItem(med);

                if (medTime.isBefore(now) && med.status === 'pending') {
                    med.status = 'missed';
                    missedList.appendChild(listItem);
                } else if (medTime.isSame(now, 'day')) {
                    todayList.appendChild(listItem);
                } else {
                    upcomingList.appendChild(listItem);
                }
            });

            // Update empty state messages
            if (todayList.children.length === 0) {
                todayList.innerHTML = '<li class="medication-item">No medications scheduled for today</li>';
            }
            if (upcomingList.children.length === 0) {
                upcomingList.innerHTML = '<li class="medication-item">No upcoming medications</li>';
            }
            if (missedList.children.length === 0) {
                missedList.innerHTML = '<li class="medication-item">No missed medications</li>';
            }
        }

        function saveToLocalStorage() {
            localStorage.setItem('medications', JSON.stringify(medications));
        }

        function loadFromLocalStorage() {
            const saved = localStorage.getItem('medications');
            if (saved) {
                medications = JSON.parse(saved);
                updateMedicationLists();
            }
        }

        function checkNotificationPermission() {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }

        function sendNotification(medication) {
            if (Notification.permission === 'granted') {
                new Notification('Medicine Reminder', {
                    body: `Time to take ${medication.name} - ${medication.dosage} ${medication.dosage === '1' ? 'tablet' : 'tablets'}`,
                    icon: '/favicon.ico'
                });
            }
        }

        function checkUpcomingMedications() {
            const now = moment();
            medications.forEach(med => {
                const medTime = moment(med.time, 'HH:mm');
                if (medTime.isSame(now, 'minute') && med.status === 'pending') {
                    sendNotification(med);
                }
            });
        }

        // Form submission handler
        document.getElementById('reminderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const medication = {
                name: document.getElementById('medicineName').value,
                dosage: document.getElementById('dosage').value,
                frequency: document.getElementById('frequency').value,
                time: document.getElementById('time').value,
                foodDependency: document.getElementById('foodDependency').value
            };

            addMedication(medication);
            e.target.reset();
        });

        // Close modal when clicking outside
        window.onclick = (event) => {
            const modal = document.getElementById('addReminderModal');
            if (event.target === modal) {
                closeModal();
            }
        };

        // Initialize app
        document.addEventListener('DOMContentLoaded', () => {
            loadFromLocalStorage();
            checkNotificationPermission();
            setInterval(checkUpcomingMedications, 60000); // Check every minute
        });

        // Add some example data if none exists
        if (medications.length === 0) {
            addMedication({
                name: 'Paracetamol',
                dosage: '1',
                frequency: 'daily',
                time: '09:00',
                foodDependency: 'after',
                reminderType: 'push'
            });
        }
