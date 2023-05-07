const express = require('express')
const fs = require('fs')
const router = express.Router()
const PATH_ROUTES = __dirname

const removeExt = (fileName) => {
    return fileName.split('.').shift()
}

fs.readdirSync(PATH_ROUTES).filter((file) => {
    const name = removeExt(file)
    if (name !== 'index') {
        router.use(`/${name}`, require(`./${file}`))
        console.log('CARGAR RUTA ---->', file)
    }
})

router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})

module.exports = router