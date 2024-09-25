document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    let mealsData = [];

    // Fetch meals from the API
    function fetchMeals(query = '') {
        fetch(apiURL + query)
            .then(response => response.json())
            .then(data => {
                mealsData = data.meals || [];
                simulateCostsAndDisplay(mealsData);
            })
            .catch(error => {
                document.getElementById('display').innerHTML = `<p>Error: ${error.message}</p>`;
            });
    }

    // Simulate cost for meals and display
    function simulateCostsAndDisplay(meals) {
        meals.forEach(meal => {
            meal.strCost = Math.floor(Math.random() * 5000) + 100; // Simulated cost
        });
        displayMeals(meals);
    }

    // Display meals
    function displayMeals(meals) {
        const mealsContainer = document.getElementById('display');
        mealsContainer.innerHTML = ''; // Clear previous results

        meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('meal-item');

            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-img">
                <h3 class="meal-name">${meal.strMeal}</h3>
                <p class="meal-cost">Cost: ₹${meal.strCost}</p>
                <div class="meal-cost-rating">
                    <div class="rating-input">
                        ${createStarRatingHTML()} <!-- Star Rating HTML -->
                    </div>
                    <button class="save-button">Save</button>
                </div>
            `;

            // Star click event
            const starInputs = mealDiv.querySelectorAll('.rating-input input');
            starInputs.forEach(star => {
                star.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const ratingValue = event.target.value;
                    setStarColor(mealDiv, ratingValue);
                });
            });

            // Save button functionality
            mealDiv.querySelector('.save-button').addEventListener('click', () => {
                const cost = meal.strCost;
                const rating = mealDiv.querySelector('.rating-input input:checked')?.value || '0';
                saveMeal(meal.strMeal, cost, rating);
            });

            // Add event listener to view meal details
            mealDiv.addEventListener('click', () => {
                showMealDetails(meal);
            });

            mealsContainer.appendChild(mealDiv);
        });
    }

    // Create Star Rating HTML (5 stars)
    function createStarRatingHTML() {
        let starHTML = '';
        for (let i = 1; i <= 5; i++) {
            starHTML += `<input type="radio" name="rating" value="${i}" id="star${i}">
                         <label for="star${i}" class="star-label">★</label>`;
        }
        return starHTML;
    }

    // Set star color based on the rating value
    function setStarColor(mealDiv, ratingValue) {
        const stars = mealDiv.querySelectorAll('.star-label');
        stars.forEach((star, index) => {
            if (index < ratingValue) {
                star.style.color = 'yellow'; // Highlight stars up to selected value
            } else {
                star.style.color = ''; // Reset the color for unselected stars
            }
        });
    }

    // Save meal data to localStorage
    function saveMeal(name, cost, rating) {
        const savedMeals = JSON.parse(localStorage.getItem('savedMeals')) || [];
        savedMeals.push({ name, cost, rating });
        localStorage.setItem('savedMeals', JSON.stringify(savedMeals));
        alert(`Saved!\nMeal: ${name}\nCost: ₹${cost}\nRating: ${rating} star(s)`);
    }

    // Show meal details in a larger, centered box
    function showMealDetails(meal) {
        const mealsContainer = document.getElementById('display');
        mealsContainer.innerHTML = ''; // Clear previous display

        const mealDetailsDiv = document.createElement('div');
        mealDetailsDiv.classList.add('meal-details');
        mealDetailsDiv.style.cssText = 'background-color: white; padding: 40px; max-width: 600px; margin: auto; text-align: center; border-radius: 10px;';

        mealDetailsDiv.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 300px;">
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
            <p><strong>Ingredients:</strong></p>
            <ul id="ingredients-list"></ul>
            <button id="back-button">Back</button>
        `;

        const ingredientsList = mealDetailsDiv.querySelector('#ingredients-list');
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
                const listItem = document.createElement('li');
                listItem.textContent = `${ingredient} - ${measure}`;
                ingredientsList.appendChild(listItem);
            }
        }

        mealsContainer.appendChild(mealDetailsDiv);

        // Back button functionality
        document.getElementById('back-button').addEventListener('click', () => {
            fetchMeals();
        });
    }

    // Search functionality
    const searchForm = document.querySelector('form');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.querySelector('.user_input').value.trim();
        fetchMeals(query);
    });

    // Fetch default meals on page load
    fetchMeals();
});
