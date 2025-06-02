const PedidosDeAyudaModel = require('../models/pedidosAyudaModel');

class PedidosDeAyudaController {
    static async getAll(req, res) {
        try {
            const pedidos = await PedidosDeAyudaModel.getAll();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo pedidos de ayuda' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const pedido = await PedidosDeAyudaModel.getById(id);
            if (pedido) res.json(pedido);
            else res.status(404).json({ error: 'Pedido de ayuda no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo pedido de ayuda' });
        }
    }

    static async create(req, res) {
        try {
            const {
                fecha_pedido,
                descripcion,
                ubicacion,
                latitud_destino,
                longitud_destino,
                id_donacion
            } = req.body;
   
            // Crear el nuevo pedido
            const nuevoPedido = await PedidosDeAyudaModel.create(
                fecha_pedido,
                descripcion,
                ubicacion,
                latitud_destino,
                longitud_destino,
                id_donacion
            );
   
            // Imprimir en consola el pedido recién creado
            console.log('Pedido creado:', nuevoPedido);
   
            // Devolver la respuesta con los datos del pedido creado
            res.status(201).json({
                message: 'Pedido de ayuda creado exitosamente',
                pedido: nuevoPedido // Devuelves el objeto con los detalles del pedido
            });
   
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creando pedido de ayuda' });
        }
    }
   
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { fecha_pedido, descripcion, estado_pedido, id_donante, ubicacion } = req.body;
            await PedidosDeAyudaModel.update(id, fecha_pedido, descripcion, estado_pedido, id_donante, ubicacion); // NUEVO: pasamos ubicacion
            res.json({ message: 'Pedido de ayuda actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando pedido de ayuda' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await PedidosDeAyudaModel.delete(id);
            res.json({ message: 'Pedido de ayuda eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando pedido de ayuda' });
        }
    }
}

module.exports = PedidosDeAyudaController;
