export default class Lkes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in local storage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        // find the index from items array
        const index = this.likes.findIndex(el => el.id === id);
        // [2,4,5] splice(1,1); returns 4 ; updates [2,5]
        // [2,4,5] slice(1,1); returns 4 ; updates [2,4,5]
        this.likes.splice(index, 1);

        // Persist data in local storage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from localstorage
        if (storage) this.likes = storage;
    }
}
