const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../services/jwt");
const mongoose = require("mongoose");


async function register(req, res) {
    const { email, password } = req.body;

    try {
        if (!email) return res.status(400).json({ msg: "El email es obligatorio" });
        if (!password) return res.status(400).json({ msg: "La contraseña es obligatoria" });

        const foundEmail = await User.findOne({ email });
        if (foundEmail) return res.status(400).json({ msg: "El email ya está en uso" });

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        res.status(200).json(newUser);

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Error en el email o contraseña" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Error en el email o contraseña" });
        }

        const passwordSuccess = await bcryptjs.compare(password, user.password);
        if (!passwordSuccess) {
            return res.status(400).json({ msg: "Error en el email o contraseña" });
        }

        const token = jwt.createToken(user, "12h");
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error });
    }
}


function protected(req,res) {

    return res.status(200).json({ msg: "Contenido del Endpoint protegido" });

}


async function uploadAvatar(req, res) {
    try {
        const { id: _id } = req.params; 
        console.log("ID recibido:", _id);

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ msg: "ID no válido" });
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ msg: "No se ha encontrado el usuario" });
        }

        if (!req.files || !req.files.avatar) {
            return res.status(400).json({ msg: "No se ha subido ninguna imagen" });
        }

        const filePath = req.files.avatar.path;
        const fileName = filePath.split("/").pop();
        const fileExt = fileName.split(".").pop().toLowerCase();

        if (!["png", "jpg", "jpeg"].includes(fileExt)) {
            return res.status(400).json({ msg: "Extensión no válida. Solo se permiten .png y .jpg" });
        }

        user.avatar = fileName;
        await user.save();

        res.status(200).json({ msg: "Avatar actualizado correctamente"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor", error });
    }
}

function getAvatar(req, res) {
    const { avatarName } = req.params;
    const filePath = path.join(__dirname, "../uploads", avatarName); 

    fs.stat(filePath, (err, stat) => {
        if (err || !stat) {
            return res.status(400).json({ msg: "El avatar que buscas no existe" });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

module.exports = { getAvatar };


module.exports = {
    register,
    login,
    protected,
    uploadAvatar,
    getAvatar,
};
