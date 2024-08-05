import * as multimedia_api from "./modules/multimedia-rest-api.mjs";
import * as multimedia_render_comp from "./modules/multimedia-render-components.mjs";
import * as pfp_render from "./modules/profileImage-render.mjs";
window.addEventListener("load", async () => {
  await pfp_render.loadUserProfileImage();

  const resTrending = await multimedia_api.getTrendingFilms();
  const trendingFilms = await resTrending.json();
  multimedia_render_comp.renderTrendingMovies(trendingFilms);
});
