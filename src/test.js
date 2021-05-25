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

decorator.tableBody((posts, i, j)=> {
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


decorator.commit();
