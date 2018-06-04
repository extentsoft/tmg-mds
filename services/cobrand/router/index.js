'use strict'

const Router = require('koa-router')
const api_inquiry = require('./api')

const router = new Router()

router.get('/api/v1/tweets', api.tweet.get)
module.exports = router