// cache - Collection<T>
// client - Client
// resolve(id: Snowflake) - T
// fetch(id: Snowflake) - T?

import { Snowflake } from '..'
import { CommingSoon } from '../util/decorators'
import Client from '../client/Client'

export default class CachedManager<T, K = Snowflake> {
    public readonly cache: [K, T][] = []

    constructor(public readonly client: Client) {}
    
    resolve(id: K): T | void {
        return this.cache.find(([key]) => key == id)[1]
    }

    @CommingSoon()
    fetch() {}
}
