import axios from 'axios';
import { apiKey, restUrl } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async  getResults() {

        try {

            const res = await axios(`${restUrl}/api/search?key=${apiKey}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(recipes);
        }
        catch (error) {
            alert(JSON.stringify(error));
        }
    }

}
