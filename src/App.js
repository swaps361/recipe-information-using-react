import React, { useEffect, useState } from 'react';
import './App.css'; // Import your CSS file

const App = () => {
    const [mealInput, setMealInput] = useState('');
    const [mealDetails, setMealDetails] = useState('');
    const [recommendedMeals, setRecommendedMeals] = useState([]);
    const [mealList, setMealList] = useState([]);

    useEffect(() => {
        displayDefaultMeals();
    }, []);

    const displayDefaultMeals = () => {
        const defaultMealURLs = [
            'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata',
            'https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken',
            'https://www.themealdb.com/api/json/v1/1/search.php?s=Salmon',
            'https://www.themealdb.com/api/json/v1/1/search.php?s=Salad',
            'https://www.themealdb.com/api/json/v1/1/search.php?s=Seafood',
            'https://www.themealdb.com/api/json/v1/1/search.php?s=Vegetarian',
        ];

        defaultMealURLs.forEach(url => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.meals) {
                        const meal = data.meals[0];
                        setMealList(prevMeals => [...prevMeals, meal]);
                    }
                })
                .catch(error => console.error('Error fetching the meal data:', error));
        });
    };

    const viewRecipe = mealID => {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];
                    setMealDetails(meal);
                    scrollToRecipeDetails();
                    fetchRecommendedMeals();
                } else {
                    setMealDetails({ error: 'Recipe not found.' });
                }
            })
            .catch(error => {
                console.error('Error fetching the recipe:', error);
                setMealDetails({ error: 'There was an error fetching the recipe. Please try again later.' });
            });
    };

    const fetchRecommendedMeals = () => {
        const recommendedMeals = [];
        for (let i = 0; i < 3; i++) {
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(response => response.json())
                .then(data => {
                    if (data.meals) {
                        const recommendedMeal = data.meals[0];
                        recommendedMeals.push(recommendedMeal);
                        setRecommendedMeals([...recommendedMeals]);
                    }
                })
                .catch(error => console.error('Error fetching the recommended meals:', error));
        }
    };

    const scrollToRecipeDetails = () => {
        document.getElementById('recipe-anchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleInputChange = event => {
        setMealInput(event.target.value);
    };

    const handleSearch = () => {
        if (mealInput.trim() === '') {
            setMealDetails({ error: 'Please enter a meal name.' });
            return;
        }

        const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealInput}`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];
                    setMealDetails(meal);
                    scrollToRecipeDetails();
                    fetchRecommendedMeals();
                } else {
                    setMealDetails({ error: 'No meals found. Please try another search.' });
                }
            })
            .catch(error => {
                console.error('Error fetching the meal data:', error);
                setMealDetails({ error: 'There was an error fetching the meal data. Please try again later.' });
            });
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container">
            <h1 className="red-heading">Food Recipe</h1>
            <div className="search-container">
                <input
                    type="text"
                    id="meal-input"
                    placeholder="Search for a meal..."
                    value={mealInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div id="meal-list" className="meal-list">
                {mealList.map(meal => (
                    <div key={meal.idMeal} className="meal-box">
                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                        <h3>{meal.strMeal}</h3>
                        <button className="view-recipe-button" onClick={() => viewRecipe(meal.idMeal)}>
                            View Recipe
                        </button>
                    </div>
                ))}
            </div>
            <div id="meal-details" className="meal-details">
                {mealDetails ? (
                    mealDetails.error ? (
                        <p>{mealDetails.error}</p>
                    ) : (
                        <>
                            <h2>{mealDetails.strMeal}</h2>
                            <img src={mealDetails.strMealThumb} alt={mealDetails.strMeal} style={{ maxWidth: '100%', height: 'auto' }} />
                            <h3>Ingredients:</h3>
                            <ul>
                                {Array.from({ length: 20 }, (_, index) => {
                                    const ingredient = mealDetails[`strIngredient${index + 1}`];
                                    const measure = mealDetails[`strMeasure${index + 1}`];
                                    return ingredient ? <li key={index}>{`${ingredient} - ${measure}`}</li> : null;
                                })}
                            </ul>
                            <h3>Instructions:</h3>
                            <p>{mealDetails.strInstructions}</p>
                            <a href="#meal-details" className="back-to-top">
                                Back to Top
                            </a>
                        </>
                    )
                ) : null}
            </div>
            <div id="recommended-meals" className="meal-list">
                {recommendedMeals.map(recommendedMeal => (
                    <div key={recommendedMeal.idMeal} className="meal-box">
                        <img src={recommendedMeal.strMealThumb} alt={recommendedMeal.strMeal} />
                        <h3>{recommendedMeal.strMeal}</h3>
                        <button className="view-recipe-button" onClick={() => viewRecipe(recommendedMeal.idMeal)}>
                            View Recipe
                        </button>
                    </div>
                ))}
            </div>
            <a id="recipe-anchor"></a>
        </div>
    );
};

export default App;
