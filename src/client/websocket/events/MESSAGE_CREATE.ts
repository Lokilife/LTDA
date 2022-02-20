import Message from '../../../structures/Message'
import WebSocketShard from '../WebSocketShard'
import { Payload } from '../SocketTypes'

export default function (shard: WebSocketShard, payload: Payload) {
    if (payload.op != 0 || payload.t != 'MESSAGE_CREATE')
        throw Error('This isn\'t MESSAGE_CREATE payload!')
    
    shard.emit('message', new Message(payload.d))
}
