from flask import Flask, render_template, request, jsonify
from models import db, Receta, Ingrediente, Categoria

app = Flask(__name__)
app.config.from_pyfile('config.py')

db.init_app(app)
from flask_migrate import Migrate
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    recetas = Receta.query.all()
    categorias = Categoria.query.all()
    return render_template('index.html', recetas=recetas, categorias=categorias)

#API para obtener datos de una receta en especifico
@app.route('/api/receta/<int:id>')
def obtener_receta(id):
    receta = Receta.query.get_or_404(id)
    categoria = Categoria.query.get(receta.categoria_id)
    ingredientes = Ingrediente.query.filter_by(receta_id=receta.id).all()

    return jsonify({
            'id': receta.id,
            'nombre': receta.nombre,
            'categoria': categoria.nombre if categoria else "Sin Categoría",
            'ingredientes': [
                {
                    'nombre': ing.nombre,
                    'cantidad': ing.cantidad,
                    'unidad': ing.unidad
                } for ing in ingredientes
            ]
    })

#API para agregar recetas sin recargar la pagina
@app.route('/api/nueva_receta', methods=['POST'])
def nueva_receta():
    data = request.json
    nueva = Receta(nombre=data['nombre'], categoria_id=data['categoria_id'])
    db.session.add(nueva)
    db.session.commit()

    #Acá agregamos los ingredientes
    for ing in data['ingredientes']:
        nuevo_ingrediente = Ingrediente(
            receta_id=nueva.id,
            nombre=ing['nombre'],
            cantidad=ing['cantidad'],
            unidad=ing['unidad']
        )
        db.session.add(nuevo_ingrediente)

    db.session.commit()    
    return jsonify({'mensaje': 'Receta agregada', 'id': nueva.id})

#API para que se pueda comunicar con la base de datos en la edicion de recetas
@app.route('/api/editar_receta/<int:id>', methods=['PUT'])
def editar_receta(id):
    from models import Receta, Ingrediente
    data = request.json

    receta = Receta.query.get_or_404(id)
    receta.nombre = data['nombre']
    receta.categoria_id = data['categoria_id']

    # Actualizar nombre y categoría
    Ingrediente.query.filter_by(receta_id=id).delete()

    # Eliminar ingredientes antiguos y agregar nuevos
    for ing in data['ingredientes']:
        nuevo_ingrediente = Ingrediente(
            receta_id=id,
            nombre=ing['nombre'],
            cantidad=ing['cantidad'],
            unidad=ing['unidad']
        )
        db.session.add(nuevo_ingrediente)

    db.session.commit()
    return jsonify({'mensaje': 'Receta actualizada con éxito'})

#API de ruta para eliminar la receta definitivamente.
@app.route('/api/eliminar_receta/<int:id>', methods=['DELETE'])
def eliminar_receta(id):
    receta = Receta.query.get_or_404(id)

    # Primero, eliminamos los ingredientes relacionados
    Ingrediente.query.filter_by(receta_id=id).delete()

    # Luego eliminamos la receta
    db.session.delete(receta)
    db.session.commit()

    return jsonify({'mensaje': 'Receta eliminada correctamente'})

#Ruta para buscar las recetas
@app.route('/buscar')
def buscar():
    nombre = request.args.get("nombre", "").lower()
    recetas = Receta.query.filter(Receta.nombre.ilike(f"%{nombre}%")).all()

    return jsonify([
        {"id": receta.id, "nombre": receta.nombre} for receta in recetas
    ])


@app.route('/api/categorias')
def obtener_categorias():
    from models import Categoria
    categorias = Categoria.query.all()
    return jsonify([{'id': cat.id, 'nombre': cat.nombre} for cat in categorias])


if __name__ == '__main__':
    app.run(debug=True)
