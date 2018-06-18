'use strict'
const logger = require('winston')
const processType = process.env.PROCESS_TYPE
logger.info(`Attempting to start ${processType} process`, { pid: process.pid })

console.log('test pull request');