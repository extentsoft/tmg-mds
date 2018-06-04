'use strict'
const logger = require('winston')
const processType = process.env.PROCESS_TYPE

logger.info(`Starting ${processType} process`, { pid: process.pid })

if (processType === 'cobrand-inquiry') {
    require('./services/cobrand/')
} else if (processType === 'cobrand-inquiry') {

} else if (processType === 'cobrand-inquiry-id') {

} else if (processType === 'cobrand-redeem') {

} else if (processType === 'cobrand-register') {

} else if (processType === 'cobrand-earn') {

} else if (processType === 'cobrand-update-profile') {

} else {
    throw new Error(`${processType} is an unsupported process`)
}