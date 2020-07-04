import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, clearLoader, renderLoader } from './views/base';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import * as ListView from './views/ListView';
import * as LikesView from './views/LikesView';


/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {

    // 1) Get the query from view 
    const query = elements.searchInput.value;

    if (query) {
        // 2) New search object and add it to state
        state.search = new Search(query);

        // 3) Prepare UI for  results 
        searchView.clearInputs();
        searchView.clearResults();

        try {
            // 4) Search for recipes
            renderLoader(elements.searchRes);
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        }
        catch (error) {
            alert('Error in Searching .... \n' + error);
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {

    // Get the hash ID from URL
    const id = window.location.hash.replace('#', '');


    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            alert(JSON.stringify(error));
        }
    }
};

window.addEventListener('hashchange', controlRecipe);

/**
 * List CONTROLLER
 */
const controlList = () => {
    // Create a new list , if there is none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list and UI as well
    state.recipe.ingredients.forEach(e => {
        const item = state.list.addItem(e.count, e.unit, e.ingredient);
        ListView.renderItem(item);
    });
};

// Handling delete and update list item events
elements.shopping.addEventListener('click', e => {
    // get the id
    //const id = e.target.closest('.shopping__item').dataset.itemid;
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle click , delete icon
    if (e.target.matches('.shopping__delete , .shopping__delete *')) {
        // Delete from state obj
        state.list.deleteItem(id);

        //Delete from UI
        ListView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * Like CONTROLLER
 */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User NOT yet liked any current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        LikesView.toggleLikeButton(true);

        // Add like to UI list
        LikesView.renderLike(newLike);

        // Else case User Has liked  current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        LikesView.toggleLikeButton(false);

        // Remove like from UI list
        LikesView.deleteLike(currentID);
    }
    LikesView.toggleLikeMenu(state.likes.getNumLikes());
}
// Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease , .btn-decrease *')) {
        // Decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase , .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add')) {
        // handle add shopping list button click event
        // then display the item in UI
        controlList();
    } else if (e.target.matches('.recipe__love , .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

// Restore liked recipes from local storage
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    LikesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes 
    state.likes.likes.forEach(like => LikesView.renderLike(like));
});
