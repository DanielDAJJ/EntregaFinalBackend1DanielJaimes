let divProduct = document.querySelector('.productContainer');
let divBottom = document.querySelector('.bottomContainer')
const socket = io();
socket.on('newProduct', nuevoProducto=>{
    let nuevoDivProduct = document.createElement('div');
    nuevoDivProduct.className = 'card';
    nuevoDivProduct.innerHTML = `<img src="${nuevoProducto.image}" alt="${nuevoProducto.title}" class="cardImg">
            <div class="card-body">
                <h5 class="card-title">${nuevoProducto.title}</h5>
                <p class="card-text">${nuevoProducto.description}</p>
                <p class="card-text">Código: ${nuevoProducto.code}</p>
                <p class="card-text">Precio: "$"${nuevoProducto.price}</p>
                <p class="card-text">Hay ${nuevoProducto.stock} disponibles</p>
                <p class="card-text">Tipo de pan: ${nuevoProducto.category}</p>
            </div>`;
    divProduct.appendChild(nuevoDivProduct);
});
socket.on('deleteProduct', productoEliminado=>{
    let productos = Array.from(document.querySelectorAll('.card'));
    productos.forEach(product => {
        if(product.querySelector('h5').innerText === productoEliminado.title){
            return divProduct.removeChild(product);
        }
    });
});
const getProducts = async () => {
    let params = new URLSearchParams(location.search);
    let page = params.get('page');
    if (!page || isNaN(Number(page))) {
        page = 1
    };
    let response = await fetch(`/api/products?page=${page}`);
    let data = await response.json();
    console.log(data);
    data.products.docs.forEach(u=>{
        let cardDivProduct = document.createElement('div');
        cardDivProduct.className = 'card';
        cardDivProduct.innerHTML = `
                <img src="${u.image}" alt="${u.title}" class="cardImg">
                <div class="card-body">
                <h5 class="card-title">${u.title}</h5>
                <hr>
                <p class="card-text">${u.description}</p>
                <hr>
                <p class="card-text">Código: ${u.code}</p>
                <p class="card-text">Precio: $${u.price}</p>
                <p class="card-text">Hay ${u.stock} disponibles</p>
                <p class="card-text">Tipo de pan: ${u.category}</p>
            </div>`;
            divProduct.appendChild(cardDivProduct);
    });
    const aFirstPage = document.createElement('a');
    aFirstPage.innerText = 'Primera Página';
    aFirstPage.href = '/?page=1';
    divBottom.appendChild(aFirstPage);
    const aPrevPage = document.createElement('a');
    aPrevPage.innerText = 'Página anterior';
    aPrevPage.href = `/?page=${data.products.prevPage}`;
    divBottom.appendChild(aPrevPage);
    if (!data.products.hasPrevPage) {
        aPrevPage.classList.add('hidden')
    };
    const aNextPage = document.createElement('a');
    aNextPage.innerText = 'Página siguiente';
    aNextPage.href = `/?page=${data.products.nextPage}`;
    divBottom.appendChild(aNextPage);
    if (!data.products.hasNextPage) {
        aNextPage.classList.add('hidden');
    };
    const aLastPage = document.createElement('a');
    aLastPage.innerText = 'Última Página';
    aLastPage.href = `/?page=${data.products.totalPages}`;
    divBottom.appendChild(aLastPage);
}
getProducts();
