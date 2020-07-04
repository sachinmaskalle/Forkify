import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    updateItem(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

    deleteItem(id) {
        // find the index from items array
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,5] splice(1,1); returns 4 ; updates [2,5]
        // [2,4,5] slice(1,1); returns 4 ; updates [2,4,5]
        this.items.splice(index, 1);
    }
}