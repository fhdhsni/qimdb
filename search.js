(() => {
  const http = require("http");
  const colors = require("colors");
  const Table = require("cli-table");
  let table = new Table({
    colWidths: [13, 90],
  });

  function printError(error) {
    console.error(error.message);
  }

  function get(movie) {
    const request = http.get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&r=json`, (response) => {
      response.setEncoding("utf8");
      let body = "";

      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if (response.statusCode === 200) {
          const imdb = JSON.parse(body);

          try {
            if (imdb.Response === "False") {
              throw new Error(imdb.Error);
            }
            console.log("");
            table.push(
              ["Title", imdb.Title.italic.cyan],
              ["Rating", imdb.imdbRating.red],
              ["Released", imdb.Released.green],
              ["Country", imdb.Country.green],
              ["Genre", imdb.Genre.green],
              ["Runtime", imdb.Runtime.green],
              ["Director", imdb.Director.green],
              ["Actors", imdb.Actors.green]
            );
            console.log(table.toString());
            console.log(`Poster URL:\n${imdb.Poster.green}\n`);
            console.log("IMDb page:");
            console.log("http://www.imdb.com/title/".green + imdb.imdbID.green);
            table = new Table({
              colWidths: [13, 90],
            });
          } catch (error) {
            printError(error);
          }
        } else {
          printError({ message: `Can't get ${movie}'s data (${response.statusMessage}).` });
        }
      });
    });

    request.on("error", printError);
  }
  module.exports = get;
})();
