(() => {
  const search = require("./search.js");
  const movies = process.argv.slice(2);

  movies.forEach(search);
})();
