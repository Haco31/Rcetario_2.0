let swiper;

// 1. Función para confirmar eliminación
function confirmarEliminacion(id) {
    if (confirm("¿Estás seguro de eliminar esta receta?")) {
        eliminarReceta(id);
    }
}

// 2. Función para eliminar (si no la tienes)
function eliminarReceta(id) {
    axios.delete(`/api/eliminar_receta/${id}`)
        .then(() => {
            alert("Receta eliminada correctamente");
            location.reload(); 
        })
        .catch(error => console.error("Error al eliminar:", error));
}

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("editar-btn")) {
        console.log("Evento editar-btn capturado");
        event.preventDefault(); 
        event.stopPropagation();
        const id = event.target.getAttribute("data-id");
        editarReceta(id);
    }
    if (event.target.classList.contains("eliminar-btn")) {
        event.stopPropagation();
        const id = event.target.getAttribute("data-id");
        confirmarEliminacion(id);
    }
});

document.addEventListener("DOMContentLoaded", function () {

    // Inicializar Swiper
    swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
        }
    });

    let modal = document.getElementById("modal-form");
    let btnAbrir = document.querySelector(".agregar-receta-container button");
    let btnCerrar = document.getElementById("close-modal");

    // Asegurar que el modal esté oculto al inicio
    modal.style.display = "none";

    btnAbrir.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    btnCerrar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });


    document.getElementById("buscador").addEventListener("keyup", buscarReceta);

    //Para el funcionamiento del botón cancelar
    const formulario = document.getElementById("modal-form");
    const botonCancelar = document.getElementById("cancelar-agregar");

    if (botonCancelar) {
        botonCancelar.addEventListener("click", function() {
            formulario.style.display = "none"; // Oculta el formulario
        });
    } else {
        console.error("El botón cancelar no se encontró.");
    }

    // Event listener para el botón de cancelar
    botonCancelar.addEventListener("click", function () {
        // Ocultamos el formulario al hacer clic en cancelar
        formulario.style.display = "none";
    });

    //busqueda de las recetas sin recargar
    document.getElementById("buscador").addEventListener("keyup", buscarReceta);

    // Acá se crea un evento para agregar más ingredientes dinámicamente
    document.getElementById("agregar-ingrediente").addEventListener("click", function() {
        let container = document.getElementById("ingredientes-container");
        let div = document.createElement("div");
        div.classList.add("ingrediente");
        div.innerHTML = `
            <input type="text" name="ingrediente[]" placeholder="Nombre del ingrediente">
            <input type="text" name="cantidad[]" placeholder="Cantidad">
            <input type="text" name="unidad[]" placeholder="Unidad (g, ml, tazas, etc.)">
        `;
        container.appendChild(div);
    });


});


// Acá mostramos los detalles de la receta.
function mostrarDetalle(id) {

    const card = document.querySelector(`.receta-card[onclick*="${id}"]`);
    if (!card) {
        console.error("No se encontró la tarjeta de la receta");
        return;
    }
    let detalleDiv = document.getElementById(`detalle-${id}`);
    let botonesDiv = card.querySelector('.botones-accion');

    if (!detalleDiv) {
        card.insertAdjacentHTML('beforeend', `
            <div id="detalle-${id}" class="detalle" style="display:none;"></div>
        `);
        detalleDiv = document.getElementById(`detalle-${id}`);
    }

    if (!botonesDiv) {
        card.insertAdjacentHTML('beforeend', `
            <div class="botones-accion" style="display:none;">
                <button class="editar-btn" data-id="${id}">Editar</button>
                <button class="eliminar-btn" data-id="${id}">Eliminar</button>
            </div>
        `);
        botonesDiv = card.querySelector('.botones-accion');
    }

    if (detalleDiv.style.display === "block") {
        detalleDiv.style.display = "none";
        botonesDiv.style.display = "none";
    } else {
        axios.get(`/api/receta/${id}`).then(response => {
            const data = response.data;
            detalleDiv.innerHTML = `
                <p>Categoría: ${data.categoria}</p>
                <p>Ingredientes:</p>
                <ul>
                    ${data.ingredientes.map(ing => 
                        `<li>${ing.cantidad} ${ing.unidad} de ${ing.nombre}</li>`
                    ).join('')}
                </ul>
            `;
            detalleDiv.style.display = "block";
            botonesDiv.style.display = "flex";
            console.log("Botones deberían ser visibles ahora"); // Debug
        }).catch(console.error);
    }
}

// Mostrar formulario de edición
function editarReceta(id) {
    console.log("1. Iniciando editarReceta con ID:", id);

    const detalleContainer = document.getElementById(`detalle-${id}`);
    if (!detalleContainer) {
        console.error(`Error: No se encontró el elemento detalle-${id}`);
        return;
    }

    axios.get(`/api/receta/${id}`).then(response => {
        const data = response.data;
        console.log("Datos de la receta:", data);

        const detalleDiv = document.getElementById(`detalle-${id}`);
        if (!detalleDiv) {
            console.error(`Elemento detalle-${id} no encontrado`);
            return;
        }
        

        const formHTML = `
            <div class="formulario-edicion">
                <h4>Editar Receta</h4>
                <input type="text" id="editar-nombre" value="${data.nombre}">
                <select id="editar-categoria"></select>
                <h4>Ingredientes:</h4>
                <div id="editar-ingredientes-container">
                    ${data.ingredientes.map(ing => `
                        <div class="ingrediente">
                            <input type="text" name="ingrediente[]" value="${ing.nombre}">
                            <input type="text" name="cantidad[]" value="${ing.cantidad}">
                            <input type="text" name="unidad[]" value="${ing.unidad}">
                        </div>
                    `).join('')}
                </div>
                <button onclick="guardarEdicion(${id})">Guardar Cambios</button>
            </div>
        `;

        // Insertar formulario
        detalleContainer.innerHTML = formHTML;
        detalleContainer.style.display = 'block';

        // Prevenir cierre al hacer clic en inputs/selects
        document.querySelectorAll('#editar-ingredientes-container input, #editar-categoria').forEach(el => {
            el.addEventListener('click', (e) => e.stopPropagation());
        }); 
        // Cargar categorías
        const categoriaSelect = document.getElementById('editar-categoria');
        if (categoriaSelect) {
            axios.get('/api/categorias').then(catResponse => {
                catResponse.data.forEach(cat => {
                    const option = new Option(cat.nombre, cat.id);
                    option.selected = cat.nombre === data.categoria;
                    categoriaSelect.add(option);
                });
            });
        }

    }).catch(error => console.error("Error al obtener receta:", error));
}



// Cargar ingredientes en el formulario
function cargarIngredientes(id) {
    axios.get(`/api/receta/${id}`).then(response => {
        let ingredientes = response.data.ingredientes;
        let div = document.getElementById(`nuevos-ingredientes-${id}`);
        ingredientes.forEach(ing => {
            div.innerHTML += `
                <input type="text" value="${ing.nombre}">
                <input type="text" value="${ing.cantidad}">
                <input type="text" value="${ing.unidad}">
            `;
        });
    });
}

// Guardar los cambios en la receta
function guardarEdicion(id) {
    let nuevoNombre = document.getElementById("editar-nombre").value; 
    let nuevaCategoria = document.getElementById("editar-categoria").value;
    
    let nuevosIngredientes = [];
    document.querySelectorAll("#editar-ingredientes-container .ingrediente").forEach(div => {
        let nombre = div.querySelector("input[name='ingrediente[]']").value;
        let cantidad = div.querySelector("input[name='cantidad[]']").value;
        let unidad = div.querySelector("input[name='unidad[]']").value;
        nuevosIngredientes.push({ nombre, cantidad, unidad });
    });

    axios.put(`/api/editar_receta/${id}`, {
        nombre: nuevoNombre,
        categoria_id: nuevaCategoria,
        ingredientes: nuevosIngredientes
    }).then(() => location.reload())
      .catch(error => console.error("Error al editar receta:", error));
}


//Acá es para agregar una nueva receta con ingredientes
function agregarReceta() {
    let nombre = document.getElementById("nombre").value;
    let categoria_id = document.getElementById("categoria").value;

    // Con este cod se procede a capturar los ingredientes ingresados
    let ingredientes = [];
    document.querySelectorAll(".ingrediente").forEach(div => {
        let ing = div.querySelector("input[name='ingrediente[]']").value;
        let cant = div.querySelector("input[name='cantidad[]']").value;
        let unidad = div.querySelector("input[name='unidad[]']").value;
        if (ing) {
            ingredientes.push({ nombre: ing, cantidad: cant, unidad: unidad });
        }
    });

    // Con esto se procede a enviar la receta con los ingredientes al backend
    axios.post("/api/nueva_receta", {
        nombre: nombre,
        categoria_id: categoria_id,
        ingredientes: ingredientes
    }).then(() => location.reload())
      .catch(error => console.error("Error al agregar receta:", error));
}

//Acá es para buscar las recetas
function buscarReceta() {
    let input = document.getElementById("buscador").value.toLowerCase();

    axios.get(`/buscar?nombre=${input}`)
        .then(response => {
            let recetasContainer = document.querySelector(".swiper-wrapper");
            recetasContainer.innerHTML = ""; // Limpiar recetas previas

            response.data.forEach(receta => {
                let recetaHTML = `
                    <div class="swiper-slide">
                        <div class="receta-card" onclick="mostrarDetalle(${receta.id})">
                            <div class="receta-tarjeta">
                                <h3>${receta.nombre}</h3>
                            </div>
                        </div>
                    </div>
                `;
                recetasContainer.innerHTML += recetaHTML;
            });

            if (swiper) {
                swiper.destroy(true, true); // Limpia eventos y slides
            }
            swiper = new Swiper(".swiper", {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                }
            });
        })
        .catch(error => console.error("Error al buscar recetas:", error));
}