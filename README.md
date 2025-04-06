# RECETARIO
#### Video Demo: https://youtu.be/QjVTLsVj2i8
## Descripción:
### 📝Recetario ---> Un organizador de las recetas de la abuela.</br>
    Esta aplicación web esta desarrollada para los amantes de las recetas, realizado con tecnologías modernas y Flask.

## Introducción 🖍
Este proyecto esta creado a partir de la necesidad de querer guardar una receta culinaria sin tener que perderla escribiéndola en un chat de un/a amigo/a o en un papel. Por lo que ofrece las siguientes ventajas a la hora de emplearlo:

- **Uso multiplataforma:** Puede usarse en cualquier dispositivo como: Tablets, Celulares y Ordenadores.
-  **Categorización:** Contiene un desplazable con categorías ya definidas para el correcto almacenamiento de las recetas.
- **Se actualiza en tiempo real:** Así no hay perdida de datos al momento de agregar, editar o eliminar la receta.
- **Búsqueda en vivo:** Filtra mediante el buscador en tiempo real las recetas que uno haya agregado mediante el nombre de la receta. </br>

Este proyecto fue pensado para
- **Estudiantes de cocita, pastelería, baristas y bartenders** que deseen tener un recetario practico y sensillo a la mano.
- **Cocineros caseros** que necesiten saber los ingredientes requeridos cuando vayan a hacer las compras o para cocinar en casa.
- **Influencers** que requieran información sobre una receta en especial.</br>

## Características 👌
#### En la gestión de las recetas se maneja en CRUD completo.
1. **Creación de la receta.**
    - Usa un formulario interactivo con campos para:
        - Nombre de la receta
        - Categoría, con un desplegable para la selección.
        - Nombre del ingrediente.
        - Cantidades.
        - Unidades.
    - Se actualiza y valida en vivo para así evitar campos incompletos o vacíos.

2. **Visualización.**
    - Cuenta con un carrusel de tarjeta de recetas que contienen:
        - Nombre de la receta.
        - Ingredientes con sus respectivas medidas y unidades.
        - Botones para la edición de la receta y la eliminación de la misma.

3. **Edición de la receta.**
    - Se puede modificar todos los campos que incluyen:
        - La eliminación y creación de ingredientes.
        - Modificación de categoría.
        - Corrección de la cantidad y las unidades.
    - Cuenta con un sistema de "guardado parcial" para que no se pierdan datos.

4. **Eliminación completa y segura**
    - Tiene doble confirmación de eliminación.
    - Se elimina como cascada los ingredientes asociados.

### Búsqueda Inteligente 🔍
- Algoritmo de filtrado
    - Busca por nombre de receta (Nombre parcial o completo).
- Resultados en tiempo real.
- Historial de búsqueda (Se considera ello para una próxima implementación).

### Adaptabilidad en la interfaz 📱
- **Diseño Movil-first:**
    - Menús colapsables en pantallas pequeñas.
    - Para mayor legilidiad cuenta con un contraste ajustable.
    - Tiene tipologia escalable (REM units).

## 🚧 Arquitectura Tecnica  🚧
### Frontend
1. **Estructura del HTML5 semántica:**
    - Uso de `<selection>`, `<article>` para mejorar SEO.
2. **Estilos CSS**
    - Flex para layouts complejos.
    - Variables CSS para colores y fuentes.
    - Animaciones suaves con `transition` y `transform`.
3. **JavaScript**
    - Patrón MVC para organización del código.
    - Swiper.js para el carrusel interactivo.
    - Axios para peticiones HTTP (GET/POST/PUT/DELETE)
### Backend
1. **Flask:**
    - Rutas RESTful para manejar operaciones CRUD.
    - Blueprints para escalabilidad.
2. **Base de Datos:**
    - Modelo relacional con 3 tablas
        ```Python
        class Receta(db.Model):
                id = db.Column(db.Integer, primary_key=True)
                nombre = db.Column(db.String(100), nullable=False)
                categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id'))
    - Consultas optimizadas en SQLAlchemy.

## 🤖 Tegnologías usadas.
### Frontend
- HTML5
- CSS
- JavaScript
- Swiper.js
- Axios para peticiones asíncronas

### Backend
- Python
- Flask (Framework ligero)
- SQLite (Base de datos relacional local)

## 👾 Detalles técnicos.
- Los datos son manejados y requeridos por AJAX con Axios, evitando recargas innecesarias.
- Al momento de agregar recetas, el modal se oculta y muestra mediante `display: flex` o `none`, y es completamente interactivo.
- Los ingredientes son manipulados por JavaScript. Se crean nuevos elementos dinámicamente y recogen los datos en un arreglo para enviarlo al backend.
- La base de datos guarda una relación entre las recetas, categorías y ingredientes en tablas separadas, permitiendo consultas optimizadas.

## ⚡ Instalación
1. Clonar repositorio :
```bash
git clone https://github.com/Haco31/recetario2.0.git
cd Rcetario_2.0
```
2. Entorno virtual:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```
3. Dependencias:
```bash
pip install -r requirements.txt
```
4. Ejecuta la aplicación:
```bash
flask run
```
5. Guía de usuario:
```markdown
🖥️ Cómo Usar el Recetario (Paso a Paso)

1. Agregar una Receta Nueva:
   - Haz clic en "Agregar Receta" > Completa el nombre.
   - Selecciona una categoría existente.
   - Añade ingredientes con el botón "Agregar Ingrediente". Ejemplo correcto:
    
     Nombre: Harina
     Cantidad: 200
     Unidad: gr

   - Evita errores comunes:
     - No dejar campos vacíos.
     - Usar unidades estándar (gr, ml, tazas).

2. Edición Avanzada:
   - Al modificar ingredientes existentes, guarda cambios con el botón "Guardar"
   - Usa el botón "Cancelar" para descartar lo ingresado.
   ```

## 📁 Estructura del proyecto
### 💾 Estructura general
```csharp
Recetario_2.0/
│
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── scripts.js
│
├── templates/
│   └── index.html
│
├── recetas.db          # Base de datos SQLite
├── app.py                 # Lógica principal de Flask
├── config.py             #configuraciones
├── models.py           #tablas
└── README.md
```
### 💻 Estructura de la Base de Datos
```python
# Modelo SQLAlchemy completo
class Categoria(db.Model):
    __tablename__ = 'categoria'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True)
    recetas = db.relationship('Receta', backref='categoria', lazy=True)

class Ingrediente(db.Model):
    __tablename__ = 'ingrediente'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    cantidad = db.Column(db.Float)
    unidad = db.Column(db.String(20))
    receta_id = db.Column(db.Integer, db.ForeignKey('receta.id'))
```
## Problemas comunes y soluciones.
```markdown
### 🐛 Troubleshooting

| Problema                          | Solución                                                                           |
|------------------------|---------------------------------------------------|
| Modal no se abre             | Verifica que JavaScript esté activado en tu navegador |
| Recetas no se guardan    | Revisa que Flask esté ejecutándose ( flask run )          |
| Búsqueda lenta                | Limpia el caché del navegador (Ctrl+Shift+Del)             |
```

## 🔮 Roadmap

#### Versión	Funcionalidades
v1.0	*Agregar validación más robusta en los formularios.*</br> 
v2.0	*Imágenes + Filtros por categoría*</br> 
v3.0	*Autenticación + Compartir en redes*</br> 
v4.0    *Exportar recetas a PDF.*</br> 
v5.0    *Guardar recetas favoritas.*</br> 


## 📚 Mi aprendizaje
En este proyecto pude investigar y ahondar mas en la practica del fullstack y así poder aplicarlo en este proyecto tan retador.  
- Cómo usar Flask para manejar rutas, conectar a bases de datos y servir contenido dinámico.

- Uso de JavaScript para manipular el DOM, realizar peticiones HTTP y actualizar la interfaz de manera interactiva.

- Incorporación de librerías externas como Swiper.js y Axios para enriquecer la experiencia de usuario.

- Buenas prácticas para organizar el código, modularidad y mantenimiento del estado del frontend.

## ❓ Preguntas Frecuentes

**Q: ¿Cómo exportar mis recetas?**  
A: Próximamente en v2.0 se incluirá exportación a PDF/JSON.

**Q: ¿Dónde se guardan los datos?**  
A: Localmente en `instance/recetas.db` (archivo SQLite).

**Q: ¿Es compatible con móviles?**  
A: Sí, la interfaz se adapta a pantallas desde 320px hasta 4K.

## 🤝 Contribuir
1. Haz fork del proyecto.
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`.
3. Envía un PR con tus comentarios!.
