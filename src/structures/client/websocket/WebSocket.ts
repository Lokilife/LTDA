import { WebSocket } from 'ws'
import { EventEmitter } from 'events'
import {
  Payload,
  ReceiveOPCodes,
  SendOPCodes,
  WebSocketEvents,
  WebSocketStatus,
} from '../../InternalTypes.js'

declare interface WebSocketClient {
  on<U extends keyof WebSocketEvents>(
    event: U,
    listener: WebSocketEvents[U],
  ): this

  emit<U extends keyof WebSocketEvents>(
    event: U,
    ...args: Parameters<WebSocketEvents[U]>
  ): boolean
}

class WebSocketClient extends EventEmitter {
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

  constructor(
    //  private readonly api: string,
    //  private readonly version: number,
    private readonly token: string,
    public readonly intents: number,
  ) {
    super({ captureRejections: true })
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
      case 1:
        this.emit(
          'debug',
          '[Main] [WS] Received heartbeat request, sending heartbeat...',
        )
        this.sendHeartbeat()
        break
      case 10:
        this.emit(
          'debug',
          '[Main] [WS] Received HELLO payload, initializing heartbeat...',
        )
        await this.setHeartbeat(payload.d.heartbeat_interval)
        this.emit('debug', '[Main] [WS] Heartbeat initizalized.')
        this.emit('debug', '[Main] [WS] Sending identify payload...')
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
        await this.waitForPacket((p) => p.op == 0 && p.t == 'READY')
        console.log('[DEBUG] [Main] Received READY event.')
        this.status = WebSocketStatus.READY
        break
      case 11:
        this.emit(
          'debug',
          '[Main] [WS] Received heartbeat ACK, continuing the heartbeat...',
        )
        this.lastHeartbeatACKed = true
        break
    }
  }
  private async waitForPacket(
    filter: (content: Payload) => boolean,
    time?: number,
    timeoutCallback?: () => void,
  ): Promise<Payload | void> {
    return await new Promise((resolve) => {
      this.on('payload', (payload) =>
        filter(payload) ? resolve(payload) : null,
      )
      if (time) setTimeout(() => resolve(timeoutCallback()), time)
    })
  }
  private async waitForEvent() {}
  private async setHeartbeat(interval: number) {
    this.sendHeartbeat()
    this.lastHeartbeatACKed = false

    await this.waitForPacket(
      (payload) => payload.op == ReceiveOPCodes.HEARTBEAT_ACK,
    )

    this.heartbeatTimer = setInterval(() => {
      if (!this.lastHeartbeatACKed)
        throw Error(
          "Hertbeat isn't ACKed from last time, try to restart bot or write an issue in github repository of lib.",
        )
      if (!this.lastHeartbeatACKed && this.status != WebSocketStatus.LOADING)
        return this.destroy({
          code: 4009,
          reason: 'Connection is zombie',
          reset: true,
        })
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
    reset: boolean
  }) {
    this.emit(
      'debug',
      `[DESTROY]
        Code:   ${code};
        Reason: ${reason};
        Reset:  ${reset};
        `,
    )
    clearInterval(this.heartbeatTimer)
    this.ws.close(code, reason)
  }
  private sendHeartbeat() {
    this.emit('debug', '[Heartbeat] [WS] Sending heartbeat...')
    this.send(SendOPCodes.HEARTBEAT, this.sequence)
  }
  private send(code: SendOPCodes, data: number | string | null | Object) {
    // this.emit('debug', '[Main] [WS] Sending payload: ' + JSON.stringify({
    //     op: code,
    //     d: data
    // }))
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
export default WebSocketClient
