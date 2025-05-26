const ImagenesCampanas = require('../models/imagenesCampanasModel');

exports.uploadImagenCampana = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  try {
    const base64 = req.file.buffer.toString('base64');

    const imagen = new ImagenesCampanas({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: base64
    });

    await imagen.save();

    const imageUrl = `${req.protocol}://${req.get('host')}/api/imagenes-campanas/${imagen._id}`;
    res.status(201).json({ url: imageUrl });

  } catch (err) {
    console.error('Error guardando imagen de campaña:', err);
    res.status(500).json({ error: 'Error al guardar la imagen de campaña' });
  }
};

exports.getImagenCampana = async (req, res) => {
  try {
    const { id } = req.params;
    const imagen = await ImagenesCampanas.findById(id);
    if (!imagen) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const imgBuffer = Buffer.from(imagen.data, 'base64');
    res.set('Content-Type', imagen.contentType);
    res.send(imgBuffer);

  } catch (err) {
    console.error('Error recuperando imagen de campaña:', err);
    res.status(500).json({ error: 'Error al recuperar la imagen de campaña' });
  }
};
