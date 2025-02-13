const foodDatabase = [
    { emoji: '🥛', name: 'Milk', defaultQuantity: '1 cup', caloriesPerUnit: 150 },
    { emoji: '🍞', name: 'Bread', defaultQuantity: '1 slice', caloriesPerUnit: 80 },
    { emoji: '🍎', name: 'Apple', defaultQuantity: '1 medium', caloriesPerUnit: 95 },
    { emoji: '🥗', name: 'Salad', defaultQuantity: '1 bowl', caloriesPerUnit: 120 },
    { emoji: '🥑', name: 'Avocado', defaultQuantity: '1/2', caloriesPerUnit: 160 },
    { emoji: '🍌', name: 'Banana', defaultQuantity: '1 medium', caloriesPerUnit: 105 },
    { emoji: '🥚', name: 'Egg', defaultQuantity: '1 large', caloriesPerUnit: 70 },
    { emoji: '🍗', name: 'Chicken Breast', defaultQuantity: '100g', caloriesPerUnit: 165 }
];

// Constants
const DAILY_CALORIE_GOAL = 2000;

// DOM elements
const searchInput = document.querySelector('.search-input');
const dropdown = document.querySelector('.dropdown');
const foodList = document.querySelector('.food-list');
const totalCaloriesSpan = document.getElementById('total-calories');
const progressCaloriesSpan = document.getElementById('progress-calories');
const progressBar = document.getElementById('progress-bar');

let selectedFoods = [];

// Update progress bar
function updateProgress(calories) {
    const percentage = Math.min((calories / DAILY_CALORIE_GOAL) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    progressCaloriesSpan.textContent = calories;
    
    // Update progress bar color based on percentage
    if (percentage > 100) {
        progressBar.style.backgroundColor = '#f44336'; // Red for over limit
    } else if (percentage > 85) {
        progressBar.style.backgroundColor = '#ff9800'; // Orange for near limit
    } else {
        progressBar.style.backgroundColor = '#4CAF50'; // Green for normal
    }
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredFoods = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(searchTerm)
    );
    
    updateDropdown(filteredFoods);
});

// Update dropdown
function updateDropdown(foods) {
    dropdown.innerHTML = '';
    
    foods.forEach(food => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `${food.emoji} ${food.name} (${food.caloriesPerUnit} kcal)`;
        
        item.addEventListener('click', () => addFoodItem(food));
        
        dropdown.appendChild(item);
    });
    
    dropdown.classList.toggle('active', foods.length > 0);
}

// Add food item to list
function addFoodItem(food) {
    const foodItem = {
        ...food,
        quantity: 1,
        totalCalories: food.caloriesPerUnit
    };
    
    selectedFoods.push(foodItem);
    updateFoodList();
    searchInput.value = '';
    dropdown.classList.remove('active');
}

// Update food list display
function updateFoodList() {
    const foodItems = foodList.querySelectorAll('.food-item:not(.food-header)');
    foodItems.forEach(item => item.remove());
    
    selectedFoods.forEach((food, index) => {
        const item = document.createElement('div');
        item.className = 'food-item';
        item.innerHTML = `
            <div>${food.emoji} ${food.name}</div>
            <div>
                <input type="number" class="quantity-input" value="${food.quantity}" 
                       min="0.25" step="0.25" data-index="${index}">
                ${food.defaultQuantity}
            </div>
            <div>${food.totalCalories} kcal</div>
            <div>
                <button class="delete-btn" data-index="${index}">×</button>
            </div>
        `;
        
        foodList.appendChild(item);
    });
    
    updateTotalCalories();
}

// Handle quantity changes
foodList.addEventListener('input', (e) => {
    if (e.target.classList.contains('quantity-input')) {
        const index = e.target.dataset.index;
        const quantity = parseFloat(e.target.value);
        
        if (quantity >= 0.25) {
            selectedFoods[index].quantity = quantity;
            selectedFoods[index].totalCalories = Math.round(
                selectedFoods[index].caloriesPerUnit * quantity
            );
            updateFoodList();
        }
    }
});

// Handle delete buttons
foodList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        selectedFoods.splice(index, 1);
        updateFoodList();
    }
});

// Update total calories
function updateTotalCalories() {
    const total = selectedFoods.reduce((sum, food) => sum + food.totalCalories, 0);
    totalCaloriesSpan.textContent = total;
    updateProgress(total);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.food-search')) {
        dropdown.classList.remove('active');
    }
});

// Initialize with sample data
[
    { emoji: '🥛', name: 'Milk', quantity: 1, caloriesPerUnit: 150, defaultQuantity: '1 cup', totalCalories: 150 },
    { emoji: '🍞', name: 'Bread', quantity: 2, caloriesPerUnit: 80, defaultQuantity: '1 slice', totalCalories: 160 },
    { emoji: '🍎', name: 'Apple', quantity: 1, caloriesPerUnit: 95, defaultQuantity: '1 medium', totalCalories: 95 },
    { emoji: '🥗', name: 'Salad', quantity: 1, caloriesPerUnit: 120, defaultQuantity: '1 bowl', totalCalories: 120 }
].forEach(food => selectedFoods.push(food));

updateFoodList();


const ctx = document.getElementById('calorieChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Calorie Intake',
            data: [1800, 2100, 1950, 2000, 1850, 2200, 2100],
            borderColor: '#4CAF50',
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 2500
            }
        }
    }
});

// Add event listener to Start Tracking button
document.querySelector('.btn-primary').addEventListener('click', () => {
    document.querySelector('.food-input').scrollIntoView({ 
        behavior: 'smooth' 
    });
});