class AnocatDecorator {

  viewConfig = {
    top_view: undefined,
    first_header: undefined,
    second_header: undefined,
    body: undefined,
    bottom_view: undefined,
  }

  posts = {
    category: undefined,
    category_links: undefined,
    currentIndex: undefined,
    data: undefined
  };

  anocatRef;

  constructor(reference = '') {

    this.anocatRef = AnocatReference(reference);

    this.fetchCategoryPosts();

  };

  commit() {

    this.trimReference();
    //build accoring to viewConfig
  }

  trimReference() {

    const ref = this.anocatRef.get();
    const h4s = ref.getElementsByTagName('h4');

    for (let i = 0; i < h4s.length; i++)
      h4s[i].remove();

  }

  fetchCategoryPosts() {

    const as = AnocatReference.SELECT_CATEGORY_A();
    const category_per_depth = [];
    var category_links = [];

    as.forEach((it, index) => {
      category_per_depth.push(it.textContent);
      category_links.push(it.href);
    });

    this.posts.category = category_per_depth.join(' > ');
    this.posts.category_links = category_links;

    const posts = AnocatReference.SELECT_POSTS_A();
    const dates = AnocatReference.SELECT_POSTS_DATE_TD();
    var currentIndex;
    var data = [];

    posts.forEach((it, index) => {
      if (!currentIndex && it.classList.contains('current'))
        currentIndex = index;
      data.push({
        title: it.textContent,
        link: it.href,
        date: dates[index].textContent,
      });
    });

    this.posts.currentIndex = currentIndex;
    this.posts.data = data;

  }

  firstHeader(width, renderer) {

    this.viewConfig['first_header'] = {
      headerWidth: width,
      renderer: renderer
    }

    return this;

  }

  buildFirstHeader() {

    const config = this.viewConfig['first_header'];
    const {
      table,
      thead,
      tbody
    } = this.getOrCreateContext();

    const th = document.createElement('th');
    th.setAttribute('colspan', config.headerWidth);
    th.appendChild(config.renderer(this.posts));

    const tr = document.createElement('tr');
    tr.appendChild(th);

    thead.appendChild(tr);

    table ?.insertBefore(thead, table ?.firstChild);

    tr.classList.add('first-header');

  }

  secondHeader(widths, renderer) {

    const second_header_width = widths.reduce((x, y) => x + y);

    if (this.viewConfig['first_header']?.headerWidth != second_header_width)
      return undefined;

    this.viewConfig['second_header'] = {
      headerWidth: second_header_width,
      headerWidths: widths,
      columnCount: widths.length,
      renderer: renderer
    }

    this.viewConfig['first_header']['columnCount'] = this.viewConfig['second_header']['columnCount']

    return this;

  }

  buildSecondHeader() {

    const config = this.viewConfig['second_header'];
    const thead = this.getOrCreateContext().thead;
    const tr = document.createElement('tr');

    for (let i = 0; i < config.columnCount; i++) {
      const th = document.createElement('th');
      th.setAttribute('colspan', config.headerWIdths[i]);
      th.appendChild(config.renderer(this.posts, i));
      tr.appendChild(th);
    }

    thead.appendChild(tr);

    tr.classList.add('second-header');

  }

  body(renderer) {

    this.viewConfig['body'] = {
      renderer: renderer
    }

    return this;

  }

  buildBody() {

    const config = this.viewConfig['body'];

    this.trimReferenceTableBody();

    const tbody = this.getOrCreateContext().tbody;
    const data = this.posts.data;

    for (let i = 0; i < data.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < this.columnCount; j++) {
        const th = document.createElement('th');
        th.appendChild(config.renderer(this.posts, i, j));
        tr.appendChild(th);
      }
      tbody.appendChild(tr);
    }

    tbody.classList.add('table-body');

  }

  trimReferenceTableBody() {

    const tbody = this.getOrCreateContext().tbody;
    const rows = tbody.getElementsByTagName('tr');

    for (let i = rows.length - 1; i >= 0; i--)
      rows[i].remove();

  }

  getOrCreateContext() {
    const ref = this.anocatRef.get();

    return {
      table: ref.getElementsByTagName('table')?.item(0),
      thead: ref.getElementsByTagName('thead')?.item(0) ?? document.createElement('thead'),
      tbody: ref.getElementsByTagName('tbody')?.item(0) ?? document.createElement('tbody')
    };
  }

  topView(renderer) {

    this.viewConfig['top-view'] = {
      renderer: renderer
    }

    return this;

  }

  buildTopView() {

    const config = this.viewConfig['top_view'];
    const ref = this.anocatRef.get();

    ref.insertBefore(
      this.createCustomView(config.renderer, 'top-view'), ref.firstChild);

  }

  bottomView(renderer) {

    this.viewConfig['bottom-view'] = {
      renderer: renderer
    }

    return this;

  }

  buildBottomView() {

    const config = this.viewConfig['top_view'];
    const ref = this.anocatRef.get();

    ref.appendChild(
      this.createCustomView(config.renderer), 'bottom-view');

  }

  createCustomView(renderer, classname) {

    const div = document.createElement('div');

    div.classList.add(classname);
    div.appendChild(renderer(this.posts));

    return div;

  }

}

class AnocatReference {

  reference;

  constructor(query = '') {
    if ('' == query)
      this.reference = AnocatReference.select(query);
    else
      this.reference = AnocatReference.SELECT_ANOCAT();
  }

  get() {
    return this.reference;
  }

  static SELECT_ANOCAT = function () {
    return AnocatReference.select('div.another_category');
  }

  static SELECT_CATEGORY_A = function () {
    return AnocatReference.select_all('div.another_category>h4>a');
  }

  static SELECT_POSTS_A = function () {
    return AnocatReference.select_all('div.another_category th a');
  }

  static SELECT_POSTS_DATE_TD = function () {
    return AnocatReference.select_all('div.another_category td');
  }

  static select = function (query) {
    return this.reference.querySelector(query);
  }

  static select_all = function (query) {
    return this.reference.querySelectorAll(query);
  }
}
