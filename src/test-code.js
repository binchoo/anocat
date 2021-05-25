class AnocatDecorator {

  viewConfig = {
    top_view: undefined,
    first_header: undefined,
    second_header: undefined,
    body: undefined,
    bottom_view: undefined,
  }

  viewBuilder = {
    topView: new TopViewBuilder(),
    firstHeader: new FirstHeaderBuilder(),
    secondHeader: new SecondHeaderBuilder(),
    tableBody: new TableBodyBuilder(),
    bottomView: new BottomViewBuilder()
  } 

  posts = {
    category: undefined,
    category_links: undefined,
    currentIndex: undefined,
    data: undefined
  };

  anocatRef;

  constructor(reference) {

    if (reference)
      this.anocatRef = new AnocatReference(reference);
    else
      this.anocatRef = new AnocatReference();

    this.parsePostsInfo();

  };

  commit() {
    this.trimReference();
    this.buildView();
  }

  trimReference() {
    const ref = this.anocatRef.get();
    const h4s = ref.getElementsByTagName('h4');

    for (let i = 0; i < h4s.length; i++)
      h4s[i].remove();
  }

  buildView() {
    Object.keys(this.viewBuilder).forEach(key=>{
      const builder = this.viewBuilder[key];
      const config = this.viewConfig[key];
      if (builder && config)
        builder.build(this.anocatRef, this.posts, this.viewConfig[key]);
    });
  }

  parsePostsInfo() {
    const as = this.anocatRef.select_category_a();
    const category_per_depth = [];
    var category_links = [];

    as.forEach((it, index) => {
      category_per_depth.push(it.textContent);
      category_links.push(it.href);
    });

    this.posts.category = category_per_depth.join(' > ');
    this.posts.category_links = category_links;

    const posts = this.anocatRef.select_posts_a();
    const dates = this.anocatRef.select_posts_date_td();
    let currentIndex;
    let data = [];

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
    this.viewConfig.firstHeader = {
      headerWidth: width,
      renderer: renderer,
      className: 'first-header'
    }
    return this;
  }

  secondHeader(widths, renderer) {
    const secondHeaderWidth = widths.reduce((x, y) => x + y);

    if (this.viewConfig.firstHeader?.headerWidth != secondHeaderWidth)
      return undefined;

    this.viewConfig.secondHeader = {
      headerWidth: secondHeaderWidth,
      headerWidths: widths,
      columnCount: widths.length,
      renderer: renderer,
      className: 'second-header'
    };

    this.viewConfig.firstHeader.columnCount = this.viewConfig.secondHeader.columnCount;
    return this;
  }

  body(renderer) {
    this.viewConfig.tableBody = {
      renderer: renderer,
      className: 'table-body'
    }
    return this;
  }

  topView(renderer) {
    this.viewConfig.topView = {
      renderer: renderer,
      className: 'top-view'
    }
    return this;
  }

  bottomView(renderer) {
    this.viewConfig.bottomView = {
      renderer: renderer,
      className: 'bottom-view'
    }
    return this;
  }
}

class AnocatReference {

  constructor(query = 'div.another_category') {
      this.reference = document.querySelector(query);
  }

  get() {
    return this.reference;
  }

  select_category_a = function () {
    return this.select_all('h4>a');
  }

  select_posts_a = function () {
    return this.select_all('th a');
  }

  select_posts_date_td = function () {
    return this.select_all('td');
  }

  find_or_create_table = function () {
    return this.find_or_create('table');
  }

  find_or_create_thead = function () {
    return this.find_or_create('thead');
  }

  find_or_create_tbody = function () {
    return this.find_or_create('tbody');
  }

  select_all = function (query) {
    return this.reference.querySelectorAll(query);
  }

  find_or_create = function (tag) {
    return this.reference.getElementsByTagName(tag)?.item(0) ?? document.createElement(tag);
  }
}

class ViewBuilder {
  build(annocatRef, posts, viewConfig) {}

  wrap(view, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.appendChild(view);
    return div;
  }
}

class TopViewBuilder extends ViewBuilder {
  build(anocatRef, posts, viewConfig) {
    const ref = anocatRef.get();
    ref.insertBefore(this.wrap(viewConfig.renderer(posts), viewConfig.className), 
      ref.firstChild);
  }
}

class FirstHeaderBuilder extends ViewBuilder {
  build(anocatRef, posts, viewConfig) {
    const ref = anocatRef.get();
    const table = anocatRef.find_or_create_table();
    const thead = anocatRef.find_or_create_thead();

    const tr = document.createElement('tr');
    const th = document.createElement('th');

    th.setAttribute('colspan', viewConfig.headerWidth);

    th.appendChild(viewConfig.renderer(posts));
    tr.appendChild(th);
    thead.appendChild(tr);
    table.insertBefore(thead, table ?.firstChild);

    tr.classList.add(viewConfig.className);
  }
}

class SecondHeaderBuilder extends ViewBuilder {
  build(anocatRef, posts, viewConfig) {
    const thead = anocatRef.find_or_create_thead();
    const tr = document.createElement('tr');

    for (let i = 0; i < viewConfig.columnCount; i++) {
      const th = document.createElement('th');
      th.setAttribute('colspan', viewConfig.headerWidths[i]);
      th.appendChild(viewConfig.renderer(posts, i));
      tr.appendChild(th);
    }

    thead.appendChild(tr);

    tr.classList.add(viewConfig.className);
  }
}

class TableBodyBuilder extends ViewBuilder {
  build(anocatRef, posts, viewConfig) {
    const tbody = anocatRef.find_or_create_tbody();
    const data = posts.data;

    this.trimReferenceTableBody(tbody);

    for (let i = 0; i < data.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < this.columnCount; j++) {
        const th = document.createElement('th');
        th.appendChild(viewConfig.renderer(posts, i, j));
        tr.appendChild(th);
      }
      tbody.appendChild(tr);
    }
    tbody.classList.add(viewConfig.className);
  }

  trimReferenceTableBody(tbody) {
    const rows = tbody.getElementsByTagName('tr');
    for (let i = rows.length - 1; i >= 0; i--) rows[i].remove();
  }
}

class BottomViewBuilder extends ViewBuilder {
  build(anocatRef, posts, viewConfig) {
    const ref = anocatRef.get();
    ref.appendChild(this.wrap(viewConfig.renderer(posts), viewConfig.className));
  }
}
var decorator = new AnocatDecorator();

decorator.firstHeader(2, (posts)=> {
  const categoryString = posts['category'];
  const num = posts['data'].length;
  const h3 = document.createElement("h3");
  h3.textContent = `${categoryString} 관련글 ${num}개`;
  return h3;
});

decorator.secondHeader([1, 1], (posts,  i)=> {
  const titles = ["제목", "작성일"];
  const h3 = document.createElement("h3");
  h3.textContent = titles[i];
  return h3;
});

decorator.body((posts, i, j)=> {
  const post = posts.data[i];
  if (j == 0) {
    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;
    return a; 
  }
  if (j == 1) {
    const h5 = document.createElement('h5');
    h5.textContent = post.date;
    return h5;
  }
});

decorator.topView((posts)=> {
  const div = document.createElement('div');
  const prev = document.createElement('button');
  const next = document.createElement('button');
  const currentIndex = posts.currentIndex;
  
  prev.textContent = '최신 글';
  if (currentIndex == 0) {
    prev.disabled = true;
  } else {
    prev.onclick = ()=>{ location.href = posts.data[currentIndex - 1].link; }
  }

  next.textContent = '이전 글';
  if (currentIndex == posts.data.length - 1) {
    next.disabled = true;
  } else {
    next.onclick = ()=>{ location.href = posts.data[currentIndex + 1].link; }
  }

  div.appendChild(prev);
  div.appendChild(next);
  return div;
});
