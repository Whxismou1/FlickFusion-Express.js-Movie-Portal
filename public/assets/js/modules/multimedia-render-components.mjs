import * as multimedia_api from "./multimedia-rest-api.mjs";

const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

let allGenres = [];
let actualPage = 1;

const getActualPage = () => {
  return actualPage;
};

const renderMovies = async (movies) => {
  const selectedGenreIds = allGenres
    .filter((genre) => genre.hasOwnProperty("checked") && genre.checked)
    .map((genre) => genre.id);
  if (selectedGenreIds.length !== 0) {
    const resMFilet = await multimedia_api.getMoviesByFilter(selectedGenreIds, actualPage);
    const moviesFilterd = await resMFilet.json();

    if (moviesFilterd.length === 0) {
      const article = document.getElementById("peliculas-table");
      article.innerHTML = "";
      const p = document.createElement("p");
      p.textContent = "No se ha encontrado ninguna película";
      article.appendChild(p);
      return;
    }

    movies = moviesFilterd;
  }
  const article = document.getElementById("peliculas-table");
  while (article.firstChild) {
    article.removeChild(article.firstChild);
  }

  movies.forEach((movie) => {
    const button = document.createElement("button");
    button.style.margin = "5px";
    button.style.outline = "none";
    button.style.border = "none";
    button.style.backgroundColor = "transparent";
    button.setAttribute("class", "outline secondary");
    const img = document.createElement("img");
    if (movie.poster_path === null) {
      img.src = "https://dummyimage.com/150x225/000/fff.png&text=No+Image";
    } else if (movie.poster_path[0] !== "/") {
      img.src = movie.poster_path;
    } else {
      img.src = IMG_PATH + movie.poster_path;
    }
    img.alt = movie.title;
    img.width = 150;
    img.height = 225;
    button.addEventListener("click", () => {
      const path = `/showInfo${movie.id}`;
      window.location.replace(path);
    });
    button.appendChild(img);
    article.appendChild(button);
  });

  const botones = document.createElement("div");
  if (actualPage > 1) {
    const previousPage = document.createElement("button");
    previousPage.innerText = "Anterior";
    previousPage.setAttribute("class", "outline secondary");
    previousPage.style.marginRight = "5px";
    previousPage.addEventListener("click", async () => {
      if (actualPage === 1) return;
      actualPage--;
      const res = await multimedia_api.getAllFilms(actualPage);
      const data = await res.json();
      renderMovies(data);
    });
    botones.appendChild(previousPage);
  }

  if (movies.length === 20) {
    const nextPage = document.createElement("button");
    nextPage.setAttribute("class", "outline secondary");
    nextPage.style.marginRight = "5px";
    nextPage.innerText = "Siguiente";
    nextPage.addEventListener("click", async () => {
      actualPage++;
      const res = await multimedia_api.getAllFilms(actualPage);
      const data = await res.json();
      renderMovies(data);
    });
    botones.appendChild(nextPage);
  }

  article.appendChild(botones);
};

const renderTrendingMovies = (movies) => {
  const article = document.getElementById("carousel");
  article.innerHTML = ""; // Limpiamos el contenido existente en caso de que haya películas anteriores

  movies.forEach((movie) => {
    const button = document.createElement("button");
    button.style.margin = "5px";
    button.style.outline = "none";
    button.style.border = "none";
    button.style.backgroundColor = "transparent";
    button.setAttribute("class", "outline secondary");
    const img = document.createElement("img");
    img.src = IMG_PATH + movie.poster_path;
    img.alt = movie.title;
    img.width = 150;
    img.height = 225;
    button.appendChild(img);

    // Agregamos un evento de clic al botón para redirigir a la página showInfo con el id de la película como parámetro
    button.addEventListener("click", () => {
      const path = `/showInfo${movie.id}`;
      window.location.replace(path);
    });

    article.appendChild(button);
  });
};

const renderMoviesPurchased = (movies) => {
  const article = document.getElementById("pelisCompradas");
  article.innerHTML = "";

  if (movies.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No se ha encontrado ninguna película comprada";
    article.appendChild(p);
    return;
  }

  movies.forEach((movie) => {
    const button = document.createElement("button");
    button.style.margin = "5px";
    button.style.outline = "none";
    button.style.border = "none";
    button.style.backgroundColor = "transparent";
    const img = document.createElement("img");

    img.src = IMG_PATH + movie.poster_path;

    img.alt = movie.title;
    img.width = 150;
    img.height = 225;

    button.appendChild(img);
    article.appendChild(button);
  });
};

const createMovieFilters = (genres) => {
  allGenres = genres;
  const ul = document.getElementById("filtros-generos");
  genres.forEach((genre) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = genre.id;
    input.name = "genero";
    input.addEventListener("change", () => {
      genres.forEach((g) => {
        if (g.id == genre.id) {
          g.checked = input.checked;
        }
      });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(genre.name));
    li.appendChild(label);
    ul.appendChild(li);
  });
};

export {
  renderMovies,
  renderTrendingMovies,
  renderMoviesPurchased,
  getActualPage,
  createMovieFilters,
};
