'use strict'

const koa = require('koa')
    //const middleware = require('./middelware')
    //const router = require('./router')
const morgan = require('morgan')
const winston = require('../../config/winston')

const app = koa()

app.use(middleware.parseQuery())
    //app.use(router.middleware())
app.use(morgan('combined', { stream: winston.stream }))

module.exports = app