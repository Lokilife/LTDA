import { Awaited } from './Types'

export interface Payload {
  /**
   * Operation Code
   */
  op: number
  /**
   * Packet data
   */
  d: any | null
  /**
   * Packet data type
   */
  t: string
}
export interface WebSocketEvents {
  debug: (content: any) => Awaited<void>
  payload: (payload: Payload) => Awaited<void>
}
export enum WebSocketStatus {
  LOADING,
  READY,
  CLOSED,
}
// OPCodes:
// 0	Dispatch	            Receive	        An event was dispatched.
// 1	Heartbeat	            Send/Receive	Fired periodically by the client to keep the connection alive.
// 2	Identify	            Send	        Starts a new session during the initial handshake.
// 3	Presence Update	        Send	        Update the client's presence.
// 4	Voice State Update	    Send	        Used to join/leave or move between voice channels.
// 6	Resume	                Send	        Resume a previous session that was disconnected.
// 7	Reconnect	            Receive	        You should attempt to reconnect and resume immediately.
// 8	Request Guild Members	Send	        Request information about offline guild members in a large guild.
// 9	Invalid Session	        Receive	        The session has been invalidated. You should reconnect and identify/resume accordingly.
// 10	Hello	                Receive	        Sent immediately after connecting, contains the heartbeat_interval to use.
// 11	Heartbeat ACK	        Receive	        Sent in response to receiving a heartbeat to acknowledge that it has been received.
export enum SendOPCodes {
  HEARTBEAT = 1,
  IDENTIFY = 2,
  PRESENCE_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  RESUME = 6,
  REQUEST_GUILD_MEMBERS = 8,
}
export enum ReceiveOPCodes {
  DISPATCH = 0,
  HEARTBEAT = 1,
  RECONNECT = 7,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11,
}
