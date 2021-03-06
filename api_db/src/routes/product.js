const server = require('express').Router();
const multer = require("multer"); // IMPORTO MULTER HACER NPM INSTALL EN API   const path = require("path")

const { Product, Categories, Images, Reviews } = require("../db");
const { query } = require('express');
const { reverse } = require('dns');

uploadFileMiddleware = multer({ dest: './public/images' }).single('image')


//ruta para obtener todos los productos
server.get('/', (req, res, next) => {
    const category = req.query.category
    let where = undefined;
    if (category) {
        where = { id: category }
    }
    Product.findAll({
        include: [{
            model: Categories,
            where: where
        },
        {
            model: Images
        },]
    })
        .then(products => {
            res.send(products);
        })
        .catch(next);
});

server.get("/image", (req, res) => {

    var path = require('path')
    const absolutePath = path.resolve(__dirname + "/../../public/images/1c3acb875d1d52ee0b15c6d04edf10ef")
    console.log(absolutePath);
    res.sendFile(absolutePath)
})

// ruta para buscar un producto por ID

server.get('/detail/:id', (req, res, next) => {
    let idProducto = req.params.id;
    Product.findAll({
        where: {
            id: idProducto
        },
        include: [{
            model: Images,
        },{
            model: Reviews
        }
        ]
    }

    )
        .then(function (productos) {
            res.send(productos[0])
        })
})

//ruta para crear un producto
server.post('/add', uploadFileMiddleware, async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    const producto = await Product.create({
        name,
        description,
        price,
        stock
    })

    const categorias = await Categories.findAll({
        where: {
            id: categoryId
        }
    })

    const images = await Images.create({
        path: req.file.filename
    })

    await producto.addCategory(categorias[0])

    await producto.addImage(images)

    // return res.send(producto)
    res.writeHead(302, {
        Location: 'http://localhost:3000/catalogo'
    });
    res.end();



})

//ruta para modificar un producto 
server.put('/:id', (req, res) => {
    const { name, description, price, stock } = req.body;
    Product.update({
        name,
        description,
        price,
        stock
    }, {
        where: {
            id: req.params.id
        }
    })
        .then((product) => {
            return res.json({
                message: "producto actualizado correctamente",
                data: product
            });
        })
        .catch(function (err) {
            console.log(req.body)
            res.status(500).json({
                message: "no se pudo actualizar el producto",
                data: err
            })
        })
})
//ruta para obtener un producto segun un keyword de busqueda

server.get('/search', async function (req, res) {
    const prod = req.query.prod.toLowerCase();

    if (!prod) { return res.status(500).json({ message: 'parametro invalido' }) }

    let allProducts = await Product.findAll({
        include:[Images]
    });

    let filtered = allProducts.filter(function (product) {

        return product.name.toLowerCase().includes(prod) || product.description.toLowerCase().includes(prod);
    })
    res.send(filtered)
})

//ruta para eliminar un producto
// server.delete("/:id", function (req, res) {
//     Product.destroy({
//         where: {
//             id: req.params.id
//         }
//     })
//         .then(() => {
//             res.send("el producto se elimino correctamente");
//         })
//         .catch(function (err) {
//             res.status(500).json({
//                 message: "no pudo eliminar el producto",
//                 data: err
//             })
//         })
// })


//ruta para eliminar un producto
// CONSULTAR PORQUE NO SE PUEDE HACER EL DELETE
server.get("/delete/:id", function (req, res) {
    Product.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.send('El producto fue eliminado');
        })
        .catch(function (err) {
            res.status(404).json({
                message: "no pudo eliminar el producto",
                data: err
            })
        })
})



//ruta para crear una categoria
server.post('/category/', function (req, res) {
    Categories.create({
        name: req.body.name,
        description: req.body.description
    })
        .then(() => {
            res.writeHead(302, {
                Location: 'http://localhost:3000/catalogo'
            });
            res.end();
        })


})


//ruta para eliminar una categoria de un producto
server.delete("/category/:idProducto/category/:idCategoria", function (req, res) {
    Categories.find({
        where: {
            id: req.params.idCategoria
        }
    })
        .then(categoria => {
            categoria.removeProduct({
                where: {
                    id: req.params.idProducto
                }
            })
            res.send("la categoria se elimino correctamente");
        })

})
//ruta para agregar una categoria a un producto
server.post("/category/:idProducto/category/:idCategoria", function (req, res) {
    Product.findAll({
        where: {
            id: req.params.idProducto
        }
    }).then(function (products) {
        const producto = products[0]
        Categories.findAll({
            where: {
                id: req.params.idCategoria
            }
        })
            .then(function (categories) {
                const category = categories[0]
                producto.addCategory(category)
                    .then(function () {
                        res.send('Categoria Asociada')
                    })
            })
    })
    // var product;
    // Product.findOrCreate({
    //     where: {
    //         id: req.params.idProducto
    //     }
    // })
    //     .then(function (products) {
    //         product = products[0];
    //         return Categories.create({
    //             name: req.body.name,
    //             description: req.body.description
    //         })
    //             .then(function (categoria) {
    //                 categoria.setProduct(product.id)
    //                 res.sendStatus(200);
    //             })
    //     })
})

//ruta para modificar una categoria
server.put("/category/:id", function (req, res) {
    Categories.update(
        {
            name: req.body.name,
            description: req.body.description
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(() => {
            res.send("se actualizo la categoria correctamente")
        })
        .catch(function (err) {
            res.status(500).json({
                message: "no se pudo crear actualizar la categoria"
            })
        })
})

//ruta para obtener todas las categorias
server.get("/category/", function (req, res, next) {
    Categories.findAll()
        .then(categories => {
            res.send(categories);
        })
        .catch(err => {
            res.status(500).json({
                message: "error al traer a las categorias",
                data: err
            })
        })


})

//ruta para eliminar una categoria
server.delete("/category/:id", function (req, res) {
    Categories.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.send("la categoria se elimino correctamente");
        })
        .catch(function (err) {
            res.status(500).json({
                message: "no se pudo eliminar la categoria"
            })
        })
})

//RUTAS PARA LOS REVIEWS

//ruta para agregar un review a un producto

server.post('/:id/review',async function(req, res){
    const idProduct = req.params.id;

    if(!idProduct) res.sendStatus(500);

    const { qualification, description } = req.body;

    const product = await Product.findByPk(idProduct)

    const review = await Reviews.create({
        qualification,
        description,
        productId: idProduct
    })
    console.log('viendo el review')
    console.log(review)

    await product.addReview(review);
/* 
    if(!product.reviews) {
        product.reviews = [];
    }else {
        product.reviews = product.reviews.push(review)
    } */
    


    res.json({
        message: 'review agregada al producto correctamente',
        data: product
    })
    /* const producto = await Product.create({
        name,
        description,
        price,
        stock
    })

    const categorias = await Categories.findAll({
        where: {
            id: categoryId
        }
    })

    const images = await Images.create({
        path: req.file.filename
    })

    await producto.addCategory(categorias[0])

    await producto.addImage(images)

    return res.send(producto) */
})

//Ruta para obtener los reviews de un producto
server.get('/:id/review',async function(req, res){
    const idProduct = req.params.id;

    const productReviews = await Reviews.findAll({
        where: {
            productId: idProduct
        }
    })

    res.send(productReviews);
})

//Ruta para actualizar un review de un producto
server.put('/:id/review/:idReview', async function(req, res){
    const idProduct = req.params.id;
    const idReview = req.params.idReview;
    const {qualification, description} = req.body

    const updateReview = await Reviews.update({
       qualification,
       description
    },{
        where: {
            id: idReview,
            productId: idProduct
        }
    })
    console.log('viendo el update review')
    console.log(updateReview);

    res.json({
        message: 'la review se actualizo correctamente',
        data: updateReview
    })
})

//ruta para borrar un review de un producto
server.delete('/:id/review/:idReview', async function(req, res){
    const idProduct = req.params.id;
    const idReview = req.params.idReview;

    const deleteReview = await Reviews.destroy({
        where: {
            id: idReview,
            productId: idProduct
        }
    })
    res.json({
        message: 'se elimino la review correctamente',
        data: deleteReview
    })
})

module.exports = server;