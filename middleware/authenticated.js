const moment = require("moment");
const jwt = require("../services/jwt");

const SECRET_KEY = "dasdsdsa344j3hj4h3j43j2HJHSADA45";

function ensureAuth(req, res, next) {
    if (!req.headers.authorization) {  
        return res.status(403).send({ msg: "La cabecera no tiene auth" });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        const payload = jwt.decodeToken(token, SECRET_KEY);

        if (payload.exp <= moment().unix()) {
            return res.status(400).send({ msg: "El token ha expirado" });
        }

        req.user = payload;  
        next(); 

    } catch (error) {
        return res.status(404).send({ msg: "Token invalido" });
    }
}

module.exports = {
    ensureAuth,
};
