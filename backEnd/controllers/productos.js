const pool = require('../config/connection')
const { handleHttpError } = require('../utils/handleError')

const getProducts = async(req, resp) => {
    try {
        const { rows } = await pool.query('SELECT * FROM PRODUCTOS  ORDER BY id ASC')
        resp.status(200).json(rows)
    } catch (err) {
        handleHttpError(resp, 'ERROR_GET_PRODUCTS')
    }
}

const getProductById = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id])
        resp.status(200).json(rows)
    } catch (err) {
        handleHttpError(resp, 'ERROR_GET_PRODUCT_BY_ID')
    }
}

const createProduct = async(req, resp) => {
    try {
        const { object } = req.body
        const results = await pool.query('INSERT INTO productos (nombre_prod, cant_prod, coment_prod, fecha_prod) VALUES ($1, $2, $3, now()) RETURNING *',
        [object.nombre_prod, object.cant_prod, object.coment_prod])
        resp.status(201).send({status: true, mgs: `Producto agregado exitosamente con ID: ${results.rows[0].id_prod}`})
    } catch (err) {
        handleHttpError(resp, 'ERROR_CREATE_PRODUCT')
    }
}

const updateProduct = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { object } = req.body
        await pool.query('UPDATE productos SET nombre_prod = $2, cant_prod = $3, coment_prod = $4 WHERE id = $1',
        [id, object.nombre_prod, object.cant_prod, object.coment_prod])
        resp.status(200).send({status: true, mgs: `Producto modificado exitosamente con ID: ${id}`})
    } catch (err) {
        handleHttpError(resp, 'ERROR_UPDATE_PRODUCT')
    }
}

const deleteProduct = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id])
        resp.status(200).send({status: true, mgs: `El Producto ${results.rows[0].nombre_prod} fue eliminado exitosamente!`})
    } catch (err) {
        handleHttpError(resp, 'ERROR_DELETE_PRODUCT')
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}