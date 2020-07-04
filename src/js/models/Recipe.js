import { restUrl, apiKey } from '../config';
import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${restUrl}/api/get?key=${apiKey}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            //console.log(res);

        } catch (error) {
            alert(JSON.stringify(error));
        }
    }

    // calculate time for cooking the recipe
    calcTime() {
        // Assuming that we need 15 mins for each 3 ingredients
        const numImg = this.ingredients.length;
        const periods = Math.ceil(numImg / 3);

        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    // parse Ingredients from recipe obj
    parseIngredients() {

        const longUnits = ['teaspoons', 'teaspoon', 'tablespoons', 'tablespoon', 'ounces', 'ounce', 'cups', 'pounds'];
        const shortUnits = ['tsp', 'tsp', 'tbsp', 'tbsp', 'oz', 'oz', 'cup', 'pound'];
        const units = [...shortUnits, 'kg', 'gm'];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();

            longUnits.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, units[index]);
            });

            // 2. Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredient into count , unit & ingredient
            let objIng;
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            if (unitIndex > -1) {
                // There exist a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                let count;
                const arrCount = arrIng.slice(0, unitIndex);

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit , but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')

                };

            } else if (unitIndex === -1) {
                // There is NO unit and NO number ins 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        this.servings = newServings;
    }
}