'use strict'
const logger = require('winston')
const processType = process.env.PROCESS_TYPE

logger.info('Starting ${processType} process', { pid: process.pid })
    /*

    if (processType === 'web') {

    } else if (processType === 'xxxx') {

    } else {
        throw new Error('${processType} is an unsupported process')
    }*/