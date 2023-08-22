//menu burger
const abrir = document.getElementById("abrir")
const cerrar = document.getElementById("cerrar")
const nav = document.getElementById("nav")

abrir.addEventListener("click", ()=>{
    nav.classList.add("visible")
})

cerrar.addEventListener("click", ()=>{
    nav.classList.remove("visible")
})


//comienza ecomerce

class Producto{
    constructor(id,nombre, precio, img, cantidad){
        this.id = id
        this.nombre = nombre 
        this.precio = precio
        this.img = img
        this.cantidad = cantidad;
    }
} 
class Producto_controller{
    constructor(carrito){
        this.lista_productos = []
        this.carrito = carrito
    } 
    agregarproductos(producto){
        this.lista_productos.push(producto)
    }
    mostrarproductos(){
        //conecto con dom
        const productos = document.getElementById("lista-productos")
        //renderizo en dom
        this.lista_productos.forEach((producto) => {
            productos.innerHTML += 
            `<article id="articulo-${producto.id}" class="articulo">
            <p>${producto.nombre}</p>
            <div class="img"><img src="${producto.img}" alt=""></div>
            <p>${producto.precio}</p>
            <button id="btn-${producto.id}">Agregar al carrito</button>
        </article> `

        })
        //añado evento al click añadir producto
        this.lista_productos.forEach((producto)=>{
            const btn_añadir = document.getElementById(`btn-${producto.id}`)
            btn_añadir.addEventListener("click", ()=>{
                this.carrito.agregaralcarrito(producto)
                this.carrito.mostrarproductos()
                this.carrito.guardarenstorage()
            })
        })

    }
}
class Carrito_compras{
    constructor(){
        this.lista_carrito = []
    }
    agregaralcarrito(producto){
       
        let busqueda = this.lista_carrito.find((el)=> el.id === producto.id);
        if(busqueda){
            busqueda.cantidad++; // Usa la instancia existente en lugar de crear una nueva
        }else{
            producto.cantidad = 1;
            this.lista_carrito.push(producto);
        }
        this.actualizartotal();
    }
    guardarenstorage(){
         //storage y JSON (guardo en storage pasando la lista del carrito a json con clave)
         let prod_encarrito_JSON = JSON.stringify(this.lista_carrito)
         localStorage.setItem("ProductosEnCarrito", prod_encarrito_JSON)
    }
    levantardestorage(){
        // Cargar productos del almacenamiento local
        let storage_data = localStorage.getItem("ProductosEnCarrito");
        let productos_json = JSON.parse(storage_data);
        this.lista_carrito = productos_json
        this.actualizartotal();
        this.mostrarproductos();  
   }
    eliminarproducto(producto){
            let busqueda = this.lista_carrito.find((el)=> el.id === producto.id)
            if(busqueda && producto.cantidad >1){
                producto.cantidad-= 1
                this.mostrarproductos()
            }else{
                producto.cantidad = 1
                let index = this.lista_carrito.indexOf(busqueda)
                this.lista_carrito.splice(index, 1)
                this.mostrarproductos()
            }
            this.actualizartotal()
            this.guardarenstorage()
    }
    actualizartotal(){
        let acumuladortotal = 0
        this.lista_carrito.forEach((producto)=>{
            acumuladortotal += producto.cantidad*producto.precio
        })
        const total_carrito = document.getElementById("total_carrito")
        total_carrito.innerText = "$" + acumuladortotal  // Formatear el total como un número con 2 decimales
    }
    mostrarproductos(){
        //conecto con dom
        const carrito_productos = document.getElementById("modal-cuerpo")
        //renderizo en dom
        carrito_productos.innerHTML = ""
        this.lista_carrito.forEach((producto)=>{
            carrito_productos.innerHTML += 
            `
            <article id="producto-comprar-${producto.id}">
            <div>
                <p>Nombre:</p>
                <p>${producto.nombre}</p>
            </div>
            <div>
                <p>Precio:</p>
                <p>${producto.precio}</p>
            </div>
            <div>
                <p>Cantidad:</p>
                <p>${producto.cantidad}</p>
            </div>
            <button id="btn-eliminar-${producto.id}"><i class="fa-solid fa-trash"></i></button>   
            </article>
            `
        })
        //añado evento eliminar 
        this.lista_carrito.forEach((producto)=>{
            const btn_eliminar = document.getElementById(`btn-eliminar-${producto.id}`)
            btn_eliminar.addEventListener("click", ()=>{
            this.eliminarproducto(producto)    
            })
        })
    }
   
}


const p1 = new Producto(1,"Air for one", 3500, "./img/producto.png",1)
const p2 = new Producto(2,"Jordan x-30", 7500, "./img/producto.png",1)
const p3 = new Producto(3,"Nike OTY edition", 10000, "./img/producto.png",1)
const carritodecompras = new Carrito_compras()

const producto_controller = new Producto_controller(carritodecompras)
producto_controller.agregarproductos(p1)
producto_controller.agregarproductos(p2)
producto_controller.agregarproductos(p3)
producto_controller.mostrarproductos()
//enestaparte una ves que instancie el carrito deberia ira recuperar los datos del local storage y lo muestro
carritodecompras.levantardestorage()

