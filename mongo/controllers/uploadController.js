const Image = require('../models/imageModel');

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  try {

    const base64 = req.file.buffer.toString('base64');

    const img = new Image({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: base64
    });
    await img.save();
    
    const imageUrl = `${req.protocol}://${req.get('host')}/api/image/${img._id}`;
    res.status(201).json({ url: imageUrl });
  } catch (err) {
    console.error('Error guardando imagen base64:', err);
    res.status(500).json({ error: 'Error al guardar la imagen' });
  }
};

exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const img = await Image.findById(id);
    if (!img) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
    
    const imgBuffer = Buffer.from(img.data, 'base64');
    res.set('Content-Type', img.contentType);
    res.send(imgBuffer);
  } catch (err) {
    console.error('Error recuperando imagen base64:', err);
    res.status(500).json({ error: 'Error al recuperar la imagen' });
  }
};
