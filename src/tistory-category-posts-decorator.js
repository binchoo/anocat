
class CategoryPostDecorator {
    reference;
    hasHeader = false;
    posts = {};
    enum = {
        SELECT_CATEGORY_A: 'div.another_category>h4>a',
        SELECT_POSTS_A: 'div.another_category th a',
        SELECT_POSTS_DATA_TD: 'div.another_category td'
    }

    constructor(reference='div.another_category') {
        this.reference = document.querySelector(reference);
        this.#fetchCategoryPosts();
        this.#trimReference();
    }

    #fetchCategoryPosts() {
        const as = document.querySelectorAll(this.enum.SELECT_CATEGORY_A);
        this.posts.category = Array.prototype.map.call(as, it=>it.textContent).join(' > ');
        this.posts.category_links = Array.prototype.map.call(as, it=>it.href);

        const posts = document.querySelectorAll(this.enum.SELECT_POSTS_A);
        const dates = document.querySelectorAll(this.enum.SELECT_POSTS_DATA_TD);
        if (posts.length == dates.length) {
            var data = [];
            for (let i = 0; i < posts.length; i++) {
                data.push({
                    title: posts[i].textContent,
                    link: posts[i].href,
                    date: dates[i].textContent,
                })
            }
            this.posts.data = data;
        }
    }

    #trimReference() {
        const h4s = this.reference.getElementsByTagName('h4');
        for (let i = 0; i < h4s.length; i++)
            h4s[i].remove();
    }

    firstHeader(renderer) {
        this.hasHeader = true;

        const table = this.reference.getElementsByTagName('table')[0];
        const tr = document.createElement('tr');
        const th = document.createElement('th');

        th?.appendChild(renderer(this.posts));
        tr?.appendChild(th);
        table?.insertBefore(tr, table?.firstChild);
    }

    secondHeader(widths, renderer) {
        if (this.hasHeader == false) return
    }

    #createColumns(widths) {

    }

    body(renderer) {

    }

    topView(renderer) {

    }

    bottomView(renderer) {

    }

    commit() {

    }
}