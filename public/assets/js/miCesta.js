import * as cart_api from "./modules/cesta-rest-api.mjs";
import * as cesta_manager from "./modules/cesta-manager.mjs";
import * as pfp_render from "./modules/profileImage-render.mjs";

const cartHandler = async () => {

  await pfp_render.loadUserProfileImage();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    document.getElementById("total").innerText = `Total: 0.00$`;
    document.getElementById("buy-button").disabled = true;
  } else {
    document.getElementById("buy-button").disabled = false;
  }

  const resultadosCesta = document.querySelector(".resultados-cesta");

  const uniqueCart = [];

  for (const item of cart) {
    if (!uniqueCart.find((element) => element.id === item.id)) {
      uniqueCart.push(item);
    }
  }

  resultadosCesta.innerHTML = "";
  if (uniqueCart.length === 0) {
    resultadosCesta.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }
  resultadosCesta.style.display = "flex";
  uniqueCart.forEach((item) => {
    const butonDelete = document.createElement("button");
    const div = document.createElement("div");
    div.classList.add("cart-item");
    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w200${item.backdrop_path}`;
    img.alt = item.title;
    img.classList.add("cart-item-image");
    const title = document.createElement("h3");
    title.textContent = item.title;

    const price = document.createElement("p");
    price.textContent = `Precio: 7.00$`;

    butonDelete.textContent = "Eliminar";
    butonDelete.setAttribute("class", "outline ");
    butonDelete.addEventListener("click", () => {
      cesta_manager.removeMovieFromCart(item.id);
      cartHandler();
    });
    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(price);
    div.appendChild(butonDelete);
    div.style.marginBottom = "10px";
    div.style.padding = "10px";
    resultadosCesta.appendChild(div);
  });
  document.getElementById("total").innerText = `Total: ${uniqueCart.length * 7.0}$`;
};

const purchaseHandler = async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("El carrito está vacío");
  } else {
    const paymentRes = await cart_api.purchaseFilms(cart);
    const paymentData = await paymentRes.json();

    window.location.href = paymentData.url;
  }
};

const buyButton = document.getElementById("buy-button");

buyButton.addEventListener("click", purchaseHandler);

window.addEventListener("load", cartHandler);
