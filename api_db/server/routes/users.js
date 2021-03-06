var express = require('express');
var router = express.Router();
const {Users} = require("../../db/index");
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




router.post('/add', async function (req, res) {
    const { name, email, adress, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    Users.create({
        name: name,
        email: email,
        usertype: 'user',
        adress: adress,
        password: hashedPassword,
        isLogged: false
    })
        .then(function (user) {
            console.log(user)
            res.json({
                message: 'El usuario se creo correctamente',
                data: user
            })
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).json({
                message: 'No se pudo crear el usuario',
                data: error
            })
        })
})


module.exports = router;
