// Carrito de compras
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/**
 * @function saveCart
 * @description Guarda el carrito en el localStorage
 */
const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/**
 * @function addMovieToCart
 * @description Añade una película al carrito
 * @param {*} movie Película a añadir
 */
const addMovieToCart = (movie) => {
  cart.push(movie);
  saveCart();
};

/**
 * @function removeMovieFromCart
 * @description Elimina una película del carrito
 * @param {*} movieId Id de la película a eliminar
 */
const removeMovieFromCart = (movieId) => {
  cart = cart.filter((movie) => movie.id !== movieId);
  saveCart();
};

/**
 * @function printCart
 * @description Muestra el carrito por consola
 */
const printCart = () => {
  console.log(cart);
};

/**
 * @function loadCart
 * @description Carga el carrito desde el localStorage
 */
const loadCart = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
};
export { addMovieToCart, printCart, loadCart, removeMovieFromCart };
