// db.js - Archivo para la conexión a MongoDB
const mongoose = require("mongoose");

const uri = "mongodb+srv://pedrorenatoes:contraseña@cluster0.hzn1pip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔥 Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error de conexión a MongoDB: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
