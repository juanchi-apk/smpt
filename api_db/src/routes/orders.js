const server = require('express').Router();

let { Orders, Users } = require('../db');

// ruta que devuelve todas las ordenes
server.get('/', function(req, res){
    
    Orders.findAll(
        {
            include:[{
                model: Users
            }]
        
        })   
        .then(function(orders){
            res.send(orders);
        })
        .catch(function(error){
            res.status(500).json({
                message: 'no se encontraron las ordenes',
                data: error
            })
        })
})

// S44 ruta que devuelve todas las ordenes por status
server.get('/search', async function(req, res){
    const status = req.query.status;

    let orders= await Orders.findAll();

    let filteredOrders = orders.filter(function(order){
        return order.status === status;
    })
    
    res.send(filteredOrders);
})

//S46 ruta que devuelve una orden particular

server.get('/search/:id', function(req, res){
   Orders.findAll({
       where:{
           id: req.params.id
       }
   })
   .then(function(order){
       res.send(order);
    })
    .catch(function(error){
        res.status(500).json({
            message: 'No se pudo obtener la orden',
            data: error
        })
    })
})

server.get('/delete/:id', function(req, res){
    Orders.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(function () {
            res.json({
                message: 'La orden se elimino correctamente'
            })
                .catch(function (error) {
                    res.status(500).json({
                        message: 'No se pudo eliminar la orden',
                        data: error
                    })
                })
        })
})


//S47 ruta para modificar una orden
server.put('/update/:id', function(req, res){
    let { status , priceOrder } = req.body;
    Orders.update({
        status,
        priceOrder
    }, {
        where: {
            id: req.params.id
        }
    })
    .then(function(){
        res.json('La orden se actualizo correctamente')
    })
})



module.exports = server;