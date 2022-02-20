console.log('Comming Soon!')

import { ClientEvents, EventNames } from '../../structures/Types'
import { Singleton } from '../../util/decorators'
import WebSocketShard from './WebSocketShard'

@Singleton
/* export default */ class WebSocketManager {
    private shards: WebSocketShard[] = new Array()
    private client: WebSocketShard

    constructor(shard: WebSocketShard, client?: WebSocketShard) {
        this.shards.push(shard)

        if (!this.client)
            this.client = client
    }
    public onEvent<E extends EventNames>(eventName: E, ...args: Parameters<ClientEvents[E]>) {
        if (!this.client)
            throw Error('Client isn\'t initialized!')
        this.client.emit(eventName, ...args)
    }
}
