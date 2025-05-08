const CatalogoDeArticuloModel = require('../models/catalogoArticuloModel');

class CatalogoDeArticuloController {
    static async getAll(req, res) {
        try {
            const articulos = await CatalogoDeArticuloModel.getAll();
            res.json(articulos);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo artículos del catálogo' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const articulo = await CatalogoDeArticuloModel.getById(id);
            if (articulo) res.json(articulo);
            else res.status(404).json({ error: 'Artículo no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo artículo del catálogo' });
        }
    }

    static async getByCategoria(req, res) {
        try {
            const { id_categoria } = req.params;
            const articulos = await CatalogoDeArticuloModel.getByCategoria(id_categoria);
            res.json(articulos);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo artículos por categoría' });
        }
    }

    static async create(req, res) {
        try {
            const { nombre_articulo, descripcion, id_categoria } = req.body;
            await CatalogoDeArticuloModel.create(nombre_articulo, descripcion, id_categoria);
            res.status(201).json({ message: 'Artículo creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando artículo del catálogo' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_articulo, descripcion, id_categoria } = req.body;
            await CatalogoDeArticuloModel.update(id, nombre_articulo, descripcion, id_categoria);
            res.json({ message: 'Artículo actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando artículo del catálogo' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await CatalogoDeArticuloModel.delete(id);
            res.json({ message: 'Artículo eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando artículo del catálogo' });
        }
    }
}

module.exports = CatalogoDeArticuloController;
