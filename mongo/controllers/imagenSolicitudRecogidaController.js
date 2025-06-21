const ImagenSolicitudRecogida = require('../models/imagenSolicitudRecogidaModel');

exports.uploadImagenSolicitudRecogida = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  try {
    const base64 = req.file.buffer.toString('base64');

    const imagen = new ImagenSolicitudRecogida({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: base64
    });

    await imagen.save();

    const imageUrl = `${req.protocol}://${req.get('host')}/api/imagenes-solicitud-recogida/${imagen._id}`;
    res.status(201).json({ url: imageUrl });
  } catch (err) {
    console.error('Error guardando imagenSolicitudRecogida:', err);
    res.status(500).json({ error: 'Error al guardar la imagen' });
  }
};

exports.getImagenSolicitudRecogida = async (req, res) => {
  try {
    const { id } = req.params;
    const imagen = await ImagenSolicitudRecogida.findById(id);
    if (!imagen) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const buffer = Buffer.from(imagen.data, 'base64');
    res.set('Content-Type', imagen.contentType);
    res.send(buffer);
  } catch (err) {
    console.error('Error recuperando imagenSolicitudRecogida:', err);
    res.status(500).json({ error: 'Error al recuperar la imagen' });
  }
};
