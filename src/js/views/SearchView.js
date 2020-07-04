import { elements } from './base';
const DEF_RECIPE_TITLE_SIZE = 17;
const START_PAGE = 1;
const RESULTS_PER_PAGE = 10;


// Get the value of searched query value from UI form
export const getInput = () => elements.searchInput.value;

// Clear the input after submitting form
export const clearInputs = () => {
    elements.searchInput.value = '';
};

// Clear the already searched results , before populating the new one
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

// Limit the size of Recipe titles 
export const limitRecipeTitle = (title, limit = DEF_RECIPE_TITLE_SIZE) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {

            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the title
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

// Render the recipe results to UI
export const renderRecipe = recipe => {
    const markup =
        `<li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

/** 
 * Pagination code goes here 
 * */

// type 'prev' OR 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
     <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
   
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    // calculate pages 
    let button;
    const pages = Math.ceil(numResults / resPerPage);

    if (page === 1 && pages > 1) {
        // only add 'next' button 
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Add Both 'prev' and 'next' 
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `

    } else if (page === pages && pages > 1) {
        // only add 'prev' button 
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = START_PAGE, resPerPage = RESULTS_PER_PAGE) => {

    // render results of current page

    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);

};
/** 
 * Pagination code Ends here 
 * */