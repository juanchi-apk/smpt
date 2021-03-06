const server = require('express').Router();
const { Users, OrderLines, Product, Orders, Images, Session } = require("../db");
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4

let isLogged =  function (req, res, next) {

    const {idUser } = req.params.idUser;
    console.log('viendo que hay en req.paramas')
    console.log(idUser)
    if(!idUser) return res.redirect("http:localhost:3001/login");

 /*    const session = await Session.findAll({
        where: {
            token: ECOMMERCE_TOKEN
        },
        include: [
            {
                model: Users
            }
        ]
    }, ) */
    
    if (idUser) {
        return next();
    }
    else {
        res.sendStatus(401);
    }
};

//rutas para los usurios 

//ruta para crear un usuario POST /users
//ruta para crear un usuario POST /users
server.post('/add', async function (req, res) {
    const { name, email, usertype, adress, password } = req.body;
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

//ruta para obtener todos los usuarios
server.get('/', function (req, res) {
    Users.findAll()
        .then(function (users) {
            console.log(users)
            res.send(users);
        })
        .catch(function (error) {
            res.sendStatus(500)
        })
})

//ruta para modificar un usuario
server.put('/update/:id', function (req, res) {
    const { name, email } = req.body;
    Users.update({
        name,
        email
    }, {
        where: {
            id: req.params.id
        }
    })
        .then(function () {
            res.json({
                message: 'Se actualizo correctamente el usuario'
            })
                .catch(function (error) {
                    res.status(500).json({
                        message: 'Ocurrio un error al intentar actualizar el usuario',
                        data: error
                    })
                })
        })
})

//ruta para borrar un usuario
server.get('/delete/:id', function (req, res) {
    console.log("viendo si llega el id del usuario")
    console.log(req.params.id)

    Users.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(function () {
            res.json({
                message: 'El usuario se elimino correctamente'
            })
        })
})

//ruta para obtener todas las ordenes de un usuario

server.get('/:id/orders', async function (req, res) {
    const idUser = req.params.id;

    const userOrders = await Order.findAll({
        where: {
            userId: idUser
        }
    })

    res.send(userOrders);

})

//rutas para el carrito


//ruta para generar la orden con los items del carrito
server.post('/:idUser/cart', async function (req, res) {

    const idUser = req.params.idUser;

    const products = req.body.basket;
    console.log('viendo que hay en el products')
    console.log(products);

    const user = await Users.findAll({
        where: {
            id: idUser
        }
    })

    console.log('viendo que hay en usuario')
    console.log(user);

    const totalOrderPrice = products.reduce(function (acc, prod) {
        return acc + (prod.precio * prod.cantidad);
    }, 0);

    console.log('viendo que hay en orderPrice')
    console.log(totalOrderPrice)

    const order = await Orders.create({
        status: 'pending',
        priceOrder: totalOrderPrice,
        userId: req.params.idUser,
        orderAdress: "default"
    })


    const orderLinePromises = products.map(async function (prod) {
        console.log(prod);
        return await OrderLines.create({
            price: prod.precio,
            quantity: prod.cantidad,
            orderId: order.id,
            productId: prod.id
        })
    })


    const orderLines = await Promise.all(orderLinePromises);

    console.log('viendo si se resolvieron las promises')
    console.log(orderLines);
    console.log(user)
    console.log(order)
    res.json({
        message: 'el item se agrego correctamente',
        data: {
            user,
            order,
            orderLines
        }
    })

})



//ruta para obtener todos los items delas ordenes de un usuario
server.get('/:idUser/cart/',  async function (req, res) {



    const items = await Orders.findAll({
        where: {
            userId: req.params.idUser
        },
        include: [
            {
                model: Users
            }, {
                model: OrderLines,
                include: [
                    {
                        model: Product,
                        include: [
                            {
                                model: Images,
                            }
                        ]
                    }
                ]
            }
        ]

    })
    console.log('viendo los items de las ordenes')
    console.log(items)

    res.send(items);
})


//RUTAS PARA LOGEARSE Y DESLOGUEARSE

server.post('/login', async function (req, res) {

    const { email, password } = req.body;
    
    const user = await Users.findOne({
        where: {
            email: email
        }
    })
    
    console.log('viendo los datos del usuario')
    console.log(user)

    if (!user || !password) return res.sendStatus(401);

    const validate = await bcrypt.compare(password, user.password)

    if (!validate) { res.sendStatus(401) }

    if (validate) {
        const session = await Session.create({
            token: uuid(),
            userId: user.id,
            userType: user.usertype,
            username: user.name
        },{
            include: [
                {
                    model: Users
                }
            ]
        })
        console.log('viendo los datos de la session')
        console.log(session)
        res.send(session);
    }

    }
)
// Login con Google
server.post('/login/google', async function (req, res){
    const { token } = req.body
   

    //  TODO: verificar token
    //  https://developers.google.com/identity/sign-in/web/backend-auth

    //El objeto que se devuelve tiene que tener la misma estructura que devuelve '/login'
    res.send({
        message: 'Ok'
    })


})




server.post('/promote/:idUser', async function (req, res){
    const {password} = req.body;
    
   
    
    console.log('viendo cual es el id del usuario')
    console.log(req.params.idUser)

    const adminPassword = await bcrypt.hash("administrador", 10);

    console.log("viendo que hay en el password de admin")
    console.log(adminPassword)
    

    console.log("viendo que hay en el password del body")
    console.log(password)
    if (!password) return res.sendStatus(401);
    const validate = await bcrypt.compare(password, adminPassword)

    if(validate){
        Users.update({
            usertype: "admin"
        },{
            where:{
                id: req.params.idUser
            }
        })
        
        const user = await Users.findOne({
            where: {
                id: req.params.idUser
            }
        })

        if(!user) return res.send(400)


        const session = await Session.create({
            token: uuid(),
            userId: user.id,
            userType: "admin",
            username: user.name
        },{
            include: [
                {
                    model: Users
                }
            ]
        })
        console.log('viendo los datos de la sesion creada')
        console.log(session)
        res.send(session)
    } else {
        res.sendStatus(401);
    }
})

server.get('/resetpassword/:idUser', async function(req, res){
    if(!req.params.idUser) return res.sendStatus(400);
    const password= "defaultpassword"
    const defaultPassword = await bcrypt.hash(password, 10);
    
    console.log('viendo el id del usuario')
    console.log(req.params.idUser)

    console.log("viendo el password default")
    console.log(defaultPassword)


    await Users.update({
        password: defaultPassword
    }, {
        where: {
            id: req.params.idUser
        }
    })

    res.sendStatus(200)
})


module.exports = server;