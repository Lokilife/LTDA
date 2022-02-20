import WebSocketShard from '../WebSocketShard'
import User from '../../../structures/User'
import { Payload } from '../SocketTypes'

export default function (shard: WebSocketShard, payload: Payload) {
    if (payload.op != 0 || payload.t != 'READY')
        throw Error('This isn\'t READY payload!')

    shard.user = new User(payload.d.user)
    shard.emit('ready')
}
