let articulosCarrito = [];

const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito     = document.querySelector("#vaciar-carrito");
const carrito           = document.querySelector("#carrito");
const listaProductos    = document.querySelector("#lista-productos");

function agregarProducto(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains("agregar-carrito")) {
    const producto = evt.target.parentElement.parentElement;

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto agregado al Carro",
      showConfirmButton: false,
      timer: 1500
    });

    leerDatosProducto(producto);
  }
}

function leerDatosProducto(item) {

  const inforProducto = {
    imagen: item.querySelector("img").src,
    titulo: item.querySelector("h4").textContent,
    precio: item.querySelector(".precio span").textContent,
    id: item.querySelector("a").getAttribute("data-id"),
    cantidad: item.querySelector("#slcCantidad").value,
    talla: item.querySelector("#slcTalla").value,
  };

  // si el producto esta en el carrito
  if (articulosCarrito.some((prod) => prod.id === inforProducto.id)) {
    const productos = articulosCarrito.map((producto) => {
      if (producto.id === inforProducto.id) {
        let cantidad = parseInt(producto.cantidad);
        cantidad += 1;
        producto.cantidad = cantidad;
        return producto;
      } else {
        return producto;
      }
    });
    articulosCarrito = [...productos];
  } else {
    articulosCarrito = [...articulosCarrito, inforProducto];
  }
  dibujarCarritoHTML();
}

function dibujarCarritoHTML() {
  limpiarCarrito();
  let total = 0;
  const contenidoTotal = document.querySelector("#total-pedido");

  articulosCarrito.forEach((producto) => {
    total += (producto.precio * producto.cantidad);
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td><img src="${producto.imagen}" width="100" /></td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.talla}</td>
        <td><a href="#" class="borrar-producto" data-id="${producto.id}">❌</a></td>
        `;
    contenedorCarrito.appendChild(fila);
  });

  contenidoTotal.innerHTML = "<h4> Total Pedido "+ total +"<h4>";

  console.log(total);
  sincronizarStorage();
}

function limpiarCarrito() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  } 
}

function eliminarProducto(evt) {
  evt.preventDefault();
  if (evt.target.classList.contains("borrar-producto")) {
    const producto = evt.target.parentElement.parentElement;
    const productoId = producto.querySelector("a").getAttribute("data-id");
    articulosCarrito = articulosCarrito.filter(
      (producto) => producto.id !== productoId
    );
    localStorage.removeItem("carrito");
    dibujarCarritoHTML();
  }
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//escuchas
listaProductos.addEventListener("click", agregarProducto);

vaciarCarrito.addEventListener("click", () => {

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Desea vaciar el carro de compras?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire({
        title: "Carrito Vacio!",
        text: "Se elimino el contenido del Carro de compras.",
        icon: "success"
      });

      articulosCarrito = [];
      dibujarCarritoHTML();

    } else if (     
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "Su carro aun tiene su informacion :)",
        icon: "error"
      });
    }
  });
});

carrito.addEventListener("click", eliminarProducto);


//carga el dom inicial
window.addEventListener("DOMContentLoaded", () => {

  fetch('data/productos.json')
    .then((respuesta) => {
        return respuesta.json()
    })
    .then((data) =>{
        dibujarProductos(data)
    })
    .catch((err)=>{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en la carga de la Promesa!",
        footer: '<a href="#">'+err+'</a>'
      });
    })

  articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
  dibujarCarritoHTML();
});


function dibujarProductos(productos){
    const contenido    = document.querySelector("#lista-productos");
    let html =` <h1 id="encabezado" class="encabezado">Catalogo</h1>
                <div class="row">`;
                
    productos.forEach((productos)=>{
      html += ` <div class="four columns">
                        <div class="card">
                            <img src="img/${productos.img}" class="imagen-producto u-full-width">
                            <div class="info-card">
                                <h4>${productos.titulo}</h4>
                                <p>${productos.sexo}</p>
                                <p class="precio">${productos.precio} <span class="u-pull-right ">${productos.descuento}</span></p>
                                <p>Cantidad 
                                
                                <select id="slcCantidad" name="slcCantidad" class="cantidad">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                </select></p>

                                <p>Talla
                                                    <select id="slcTalla" name="slcTalla" class="talla">
                                                        <option value="S">S</option>
                                                        <option value="M">M</option>
                                                        <option value="L">L</option>
                                                        <option value="XL">XL</option>
                                                    </select>
                                </p>                     

                                <a href="#" class="u-full-width button input agregar-carrito" data-id="${productos.id}">Agregar al Carrito</a>
                            </div>
                        </div>
                        <!--.card-->
                </div>
                `

        
            if (productos.id % 3 === 0) {
              html += ` </div>
                        <div class="espacio"></div>      
                        <div class="row"> `
            }
            
    })
    contenido.innerHTML = html;

}