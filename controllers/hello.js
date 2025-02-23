function getHello(req, res){
    res.status(200).send({
        msg: "Hola desde Controllers",
    });

};


module.exports = {
    getHello,
};