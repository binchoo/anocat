/**
 * Test: Card-Horizontal
 */

var decorator = AnocatDecorator.useLayout('card-horizontal');

decorator.tableBody((posts, i, j)=>{
  const post = posts.data[j];
  console.log(i, j);

  const a = document.createElement('a');
  a.href = post.link;
  a.textContent = post.title;
  return a; 
});

decorator.commit();

/**
 * Test: Card-Horizontal, rowCount, columnCount ignored.
 */

var decorator = AnocatDecorator.useLayout('card-horizontal');

decorator.tableBody((posts, i, j)=>{
  const post = posts.data[j];
  console.log(i, j);

  const a = document.createElement('a');
  a.href = post.link;
  a.textContent = post.title;
  return a; 
}, 10000, 10000);

decorator.commit();

/**
 * Test: Card-Vertical
 */

 var decorator = AnocatDecorator.useLayout('card-vertical');

 decorator.tableBody((posts, i, j)=>{
   const post = posts.data[i];
   console.log(i, j);
 
   const a = document.createElement('a');
   a.href = post.link;
   a.textContent = post.title;
   return a; 
 });
 
 decorator.commit();

/**
 * Test: Card-Vertical, rowCount, columnCount ignored.
 */

var decorator = AnocatDecorator.useLayout('card-vertical');

decorator.tableBody((posts, i, j)=>{
  const post = posts.data[i];
  console.log(i, j);

  const a = document.createElement('a');
  a.href = post.link;
  a.textContent = post.title;
  return a; 
}, 10000, 10000);

decorator.commit();

/**
 * Test: Card-Vertical, rowCount, columnCount ignored.
 */

var decorator = AnocatDecorator.useLayout('test');
decorator.commit();

