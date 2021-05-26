var decorator = AnocatDecorator.useLayout('card-horizontal')
  .tableBody(1, -1, (posts, i, j)=>{
    const post = posts.data[j];
    console.log(i, j);

    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;
    return a; 
  })
  .commit();