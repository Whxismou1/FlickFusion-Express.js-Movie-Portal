import * as multimedia_render_comp from "./modules/multimedia-render-components.mjs";
import * as multimedia_api from "./modules/multimedia-rest-api.mjs";
import * as bbdd_api from "./modules/bbdd-rest-api.mjs";
import * as pfp_render from "./modules/profileImage-render.mjs";
window.addEventListener("load", async () => {
  await pfp_render.loadUserProfileImage();

  const actualPage = multimedia_render_comp.getActualPage();
  const res = await multimedia_api.getAllFilms(actualPage);
  const data = await res.json();

  const resGenres = await multimedia_api.getAllGenres();
  const dataGenres = await resGenres.json();

  multimedia_render_comp.createMovieFilters(dataGenres);
  multimedia_render_comp.renderMovies(data);

  const misPelisCompradasBBDD = await bbdd_api.getPurchasedFilmsDB();
  const misPelisCompradas = await misPelisCompradasBBDD.json();

  const pelis = [];
  for (const peli of misPelisCompradas) {
    pelis.push(peli);
  }

  multimedia_render_comp.renderMoviesPurchased(pelis);
});

const searchHandler = async (e) => {
  e.preventDefault();
  const query = e.target.multimediabar.value;
  if (query.length > 0) {
    const res = await multimedia_api.searchByName(query);
    const data = await res.json();

    if (data.length === 0) {
      const article = document.getElementById("peliculas-table");
      article.innerHTML = "";
      const p = document.createElement("p");
      p.textContent = "No se ha encontrado ninguna película";
      article.appendChild(p);
      return;
    }

    multimedia_render_comp.renderMovies(data);
  } else {
    const res = await multimedia_api.getAllFilms(1);
    const data = await res.json();
    multimedia_render_comp.renderMovies(data);
  }
};

const searchBar = document.forms["multimedia-search"];
searchBar.addEventListener("submit", searchHandler);
