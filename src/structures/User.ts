// id	snowflake	the user's id	identify
// username	string	the user's username, not unique across the platform	identify
// discriminator	string	the user's 4-digit discord-tag	identify
// avatar	?string	the user's avatar hash	identify
// bot?	boolean	whether the user belongs to an OAuth2 application	identify
// system?	boolean	whether the user is an Official Discord System user (part of the urgent message system)	identify
// mfa_enabled?	boolean	whether the user has two factor enabled on their account	identify
// banner?	?string	the user's banner hash	identify
// accent_color?	?integer	the user's banner color encoded as an integer representation of hexadecimal color code	identify
// locale?	string	the user's chosen language option	identify
// verified?	boolean	whether the email on this account has been verified	email
// email?	?string	the user's email	email
// flags?	integer	the flags on a user's account	identify
// premium_type?	integer	the type of Nitro subscription on a user's account	identify
// public_flags?	integer	the public flags on a user's account	identify

import { Snowflake } from '..'

export default class User {
    public readonly id: Snowflake
    public readonly username: string
    public readonly discriminator: string
    public readonly avatarURL?: string
    public readonly avatarHash?: string
    public readonly bot: boolean
    public readonly system: boolean
    public readonly mfaEnabled?: boolean
    public readonly bannerURL?: string
    public readonly accentColor?: number
    public readonly locale?: string
    public readonly verified?: boolean
    public readonly email?: string
    public readonly flags?: any[]
    public readonly premiumType?: 'FULL' | 'CLASSIC'
    public readonly publicFlags?: any[]
    
    constructor(data: any) {
        this.id = data.id
        this.username = data.username
        this.discriminator = data.discriminator
        this.avatarHash = data.avatar
        this.avatarURL = this.avatarHash ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.webp` : null
        this.bot = data.bot
        this.system = data.system
        this.mfaEnabled = data.mfa_enabled
        this.bannerURL = data.banner
        this.accentColor = data.accent_color
        this.locale = data.locale
        this.verified = data.verified
        this.email = data.email
        this.flags = data.flags
        this.premiumType = data.premium_type
        this.publicFlags = data.public_flags
    }
}
