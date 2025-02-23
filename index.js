const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 4000;

const urlMongoDb = "mongodb+srv://admin:admin@cluster0.bk8zn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const conectarDB = async () => {
    try {
        await mongoose.connect(urlMongoDb); 
        console.log("✅ Conectado a MongoDB");

        app.listen(port, () => {
            console.log(`🚀 Servidor levantado en http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error);
        process.exit(1); 
    }
};

conectarDB();
