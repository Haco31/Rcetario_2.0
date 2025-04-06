from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
import os


class Receta(db.Model):
    __tablename__ = 'receta'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id'))

    def __repr__(self):
        return f'<Receta {self.nombre}>'

class Categoria(db.Model):
    __tablename__ = 'categoria'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    recetas = db.relationship('Receta', backref='categoria', lazy=True)

    def __repr__(self):
        return f'<Categoria {self.nombre}>'

class Ingrediente(db.Model):
    __tablename__ = 'ingredientes'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    cantidad = db.Column(db.String(50)) 
    unidad = db.Column(db.String(50))
    receta_id = db.Column(db.Integer, db.ForeignKey('receta.id'), nullable=False)

    def __repr__(self):
        return f'<Ingrediente {self.nombre}>'