const CategoriaDeArticuloModel = require('../models/categoriaArticuloModel');

class CategoriaDeArticuloController {
    static async getAll(req, res) {
        try {
            const categorias = await CategoriaDeArticuloModel.getAll();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo categorías de artículos' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const categoria = await CategoriaDeArticuloModel.getById(id);
            if (categoria) res.json(categoria);
            else res.status(404).json({ error: 'Categoría no encontrada' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo categoría de artículo' });
        }
    }

    static async create(req, res) {
        try {
            const { nombre_categoria } = req.body;
            await CategoriaDeArticuloModel.create(nombre_categoria);
            res.status(201).json({ message: 'Categoría creada' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando categoría de artículo' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_categoria } = req.body;
            await CategoriaDeArticuloModel.update(id, nombre_categoria);
            res.json({ message: 'Categoría actualizada' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando categoría de artículo' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await CategoriaDeArticuloModel.delete(id);
            res.json({ message: 'Categoría eliminada' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando categoría de artículo' });
        }
    }
}

module.exports = CategoriaDeArticuloController;
