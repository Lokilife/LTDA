import { WebSocket } from 'ws'
import { EventEmitter } from 'events'
import {
  Payload,
  ReceiveOPCodes,
  SendOPCodes,
  WebSocketStatus,
} from './SocketTypes.js'
import { Awaited } from '../../structures/Types.js'
import DebugLogger from '../../util/DebugLogger.js'
// import WebSocketManager from './WebSocketManager.js'
import APIRouter from '../../rest/APIRouter.js'
import { ClientEvents } from '../../index.js'
import User from '../../structures/User.js'

declare interface WebSocketShard {
  on<U extends keyof ClientEvents>(
    event: U,
    listener: ClientEvents[U],
  ): this

  // YOU SHOULD DELETE IT IN THE FUTURE
  on(event: any, listener: (...args: any) => Awaited<any>): this

  emit<U extends keyof ClientEvents>(
    event: U,
    ...args: Parameters<ClientEvents[U]>
  ): boolean
}

class WebSocketShard extends EventEmitter {
  /**
   * The websocket from ws lib
   */
  private ws: WebSocket
  /**
   * Is last heartbeat confirmed
   */
  private lastHeartbeatACKed: boolean = false
  /**
   * Heartbeat timer
   */
  private heartbeatTimer: NodeJS.Timer
  /**
   * Sequence of the connection
   */
  private sequence: number = null

  private status: WebSocketStatus = WebSocketStatus.CLOSED

  private log: DebugLogger

  public user?: User

  // private manager: WebSocketManager = new WebSocketManager(this)

  public get api() {
    return APIRouter('https://discord.com/api/v9', this.token)
  } 

  constructor(
    //  private readonly api: string,
    //  private readonly version: number,
    private readonly token: string,
    public readonly intents: number,
    public readonly id: number
  ) {
    super({ captureRejections: false })
    // super({ captureRejections: true })
    this.log = new DebugLogger(`WSS #${id}`)
    this.on('debug', this.log.info)
  }

  async connect() {
    this.status = WebSocketStatus.LOADING
    // this.ws = new WebSocket(`${this.api}/${this.version}`)
    this.ws = new WebSocket(`wss://gateway.discord.gg`)
    this.ws.on('message', (data) =>
      this.onPacket(JSON.parse(data.toString('utf-8'))),
    )
  }

  private async onPacket(payload: Payload) {
    // this.emit('debug', payload)
    this.emit('payload', payload)

    switch (payload.op) {
      case 0:
        this.dispatch(payload)
        break
      case 1:
        this.emit(
          'debug',
          '[Heartbeat] Received heartbeat payload, sending heartbeat...',
        )
        this.sendHeartbeat()
        break
      case 10:
        this.emit(
          'debug',
          '[Main] Received HELLO payload, initializing heartbeat...',
        )
        await this.setHeartbeat(payload.d.heartbeat_interval)
        this.emit('debug', '[Main] Heartbeat initizalized.')
        this.emit('debug', '[Main] Sending identify payload...')
        this.send(SendOPCodes.IDENTIFY, {
          token: this.token,
          properties: {
            $os: process.platform,
            $browser: 'LTDA',
            $device: 'LTDA',
          },
          intents: this.intents,
          shard: [0, 1],
        })
        const readyPayload = await this.waitFor('READY', 5e3, () => this.destroy({code: 4004, reason: 'Invalid Token'}))
        if (!readyPayload) return
        this.emit('debug', '[Main] Received ready event.')
        this.status = WebSocketStatus.READY
        break
      case 11:
        this.emit(
          'debug',
          '[Heartbeat ACK] Received heartbeat ACK, continuing the heartbeat...',
        )
        this.lastHeartbeatACKed = true
        break
    }
  }

  private async dispatch(payload: Payload) {
    // If we are getting payload that isn't an event payload we're insulting Lokilife cuz this is private method
    if (!payload.t || payload.op != 0)
      throw Error('How the hell i got this payload? Lokilife is an idiot.\nIf you\'re a user of this library, you can slap the developer, insult him and write an issue.')

    this.emit('debug', `[Dispatcher] Got ${payload.t} payload, i'm gonna dispatch it.`)
    const handler = (await import(`./events/${payload.t}.js`).catch(() => {}))?.default
    
    if (!handler)
      return this.emit(payload.t as any, payload.d) // idk, i'm breaking types by using any type cuz i'm lazy to write types for non-supported events
    
    handler(this, payload)
  }

  private waitForPacket<T>(
    filter: (content: Payload) => boolean,
    time: number = 60e3,
    timeoutCallback?: () => T,
  ): Promise<Payload | void | T> {
    const handlePromise = (resolve, reject) => {
      const timeout = setTimeout(() =>
        timeoutCallback ? resolve(timeoutCallback()) : reject('timeout'), time)
      
      this.once('payload', (payload: Payload) => {
        clearTimeout(timeout)
        if (filter(payload)) 
          return resolve(payload)
        handlePromise(resolve, reject)
      })
    }
    return new Promise(handlePromise)
  }

  private waitFor<T>(event: string, time?: number, timeoutCallback?: () => T) {
    return this.waitForPacket(payload => payload.op == ReceiveOPCodes.DISPATCH && payload.t == event, time, timeoutCallback)
  }

  private async setHeartbeat(interval: number) {
    this.sendHeartbeat()

    await this.waitForPacket(payload => payload.op == ReceiveOPCodes.HEARTBEAT_ACK,)

    this.heartbeatTimer = setInterval(() => {
      if (!this.lastHeartbeatACKed && this.status != WebSocketStatus.LOADING) {
        this.destroy({
          code: 4009,
          reason: 'Connection is zombie',
          reset: true,
        })
        throw Error(
          'Hertbeat isn\'t ACKed from the last time, try to restart bot or write an issue in github repository of lib.',
        )
      }
      this.sendHeartbeat()
      this.lastHeartbeatACKed = false
    }, interval)
  }

  destroy({
    code = 1000,
    reason = null,
    reset = false,
  }: {
    code: number
    reason: string
    reset?: boolean
  }) {
    this.log.error(`[DESTROY]\n` +
      `  Code:   ${code};\n` +
      `  Reason: ${reason};\n` +
      `  Reset:  ${reset};`)
    clearInterval(this.heartbeatTimer)
    this.ws.close(code, reason)
    this.status = WebSocketStatus.CLOSED
  
    if (!reset)
      throw Error(reason)
  }
  
  private sendHeartbeat() {
    this.emit('debug', '[Heartbeat] Sending heartbeat...')
    this.send(SendOPCodes.HEARTBEAT, this.sequence)
  }
  
  private send(code: SendOPCodes, data: number | string | null | Object) {
    this.ws.send(
      Buffer.from(
        JSON.stringify({
          op: code,
          d: data,
        }),
      ),
    )
  }
}
export default WebSocketShard
