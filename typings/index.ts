import { Client } from '../lib'

const client = new Client(process.env.TOKEN, 1 << 9)
client.on('debug', console.log.bind(null, '[DEBUG]'))

client.connect()
