const express = require('express')
const path = require('path')
const authMiddleware = require('./src/auth')

const app = express()
const PORT = process.env.PORT || 5000

const filePath = path.join(__dirname, 'public')

app.use('/', [authMiddleware, express.static(filePath)])

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
