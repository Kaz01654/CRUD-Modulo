const express = require('express')
const router = express.Router()
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productos')

router.get('/getProducts', getProducts)
router.get('/getProducts/:id', getProductById)
router.post('/insertProd', createProduct)
router.put('/updateProd/:id', updateProduct)
router.delete('/deleteProd/:id', deleteProduct)

module.exports = router