
class CategoryPostDecorator {
    reference;
    hasHeader = false;
    headerWidth = 2;
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

    firstHeader(width, renderer) {
        const {table, thead, tbody} = this.#getContext();
        const tr = document.createElement('tr');
        const th = document.createElement('th');

        th.setAttribute('colspan', width);
        th.appendChild(renderer(this.posts));

        tr.appendChild(th);
        tr.classList.add('first-header');

        thead.appendChild(tr);
        table?.insertBefore(thead, table?.firstChild);

        this.hasHeader = true;
        this.headerWidth = width;
    }

    secondHeader(widths, renderer) {
        const {table, thead, tbody} = this.#getContext();

        if (!thead) return;
        if (this.hasHeader == false) return;
        if (this.headerWidth != widths.reduce((x, y)=> x + y)) return;
        
        const tr = document.createElement('tr')
        tr.classList.add('second-header');

        for (let i = 0; i < widths.length; i++) {
          const width = widths[i];
          const th = document.createElement('th');
          th.setAttribute('collspan', width);
          th.appendChild(renderer(this.posts, i));
          tr.appendChild(th);
        }
        thead.appendChild(tr);
        
    }

    #createColumns(widths) {
        this.#trimReferenceTableBody(); 

    }

    #trimReferenceTableBody() {
      const tbody = this.#getContext().tbody;
      const rows = tbody.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++)
        rows[i].remove();
    }

    #getContext() {
      return {
        table: this.reference.getElementsByTagName('table')?.item(0),
        thead: this.reference.getElementsByTagName('thead')?.item(0) ?? document.createElement('thead'),
        tbody: this.reference.getElementsByTagName('tbody')?.item(0) ?? document.createElement('tbody')
      }
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
