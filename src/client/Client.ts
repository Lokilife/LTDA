import CachedManager from '../managers/CachedManager'
import Message from '../structures/Message'
import User from '../structures/User'
import EventEmitter from 'events'

export interface ClientOptions {
    cacheMessagesLimit?: number
}

export default class Client extends EventEmitter {
    public readonly cacheMessagesLimit: number
    public readonly messages: CachedManager<Message>
    public readonly roles: CachedManager<any>
    public readonly users: CachedManager<User>
    public readonly channels: CachedManager<any>
    public readonly user?: User

    constructor(options: ClientOptions) {
        super({ captureRejections: true })

        this.cacheMessagesLimit = options.cacheMessagesLimit || 100

    }
}
