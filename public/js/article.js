function Article(name, id) {
  this.name = name;
  this.id = id;
}

if (typeof exports != 'undefined') {
  exports.Article = Article;
}