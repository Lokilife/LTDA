[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
# LTDA (Loki's TypeScript Discord API)
LTDA is a new lib for Discord API written in TypeScript. This project was made for learning JavaScript/TypeScript, WebSockets and etc. Therefore, if you see the shit code and know the solution better, I would be glad if you wrote about it in the issues tab on the repository page, any criticism is accepted.

## Features:
### It's have non-humane events
### Author have bad English

## Current version: 1.0.0

## Usage Example (ECHO-bot):
```ts
import { Client } from 'ltda'
import fetch from 'node-fetch'

const client = new Client('<TOKEN>', 1 << 9)

client.on('payload', async function (payload) {
    // If it's not event and not ready event then ignore
    if (payload.op != 0 && payload.t == "READY") return

    const {
        username,
        discriminator,
        id
    } = payload.d.user
    console.log(`Logged in Discord as ${username}#${discriminator} (${id})!`)
})

client.on('payload', async function (payload) {
    // If it's not event and not message event then ignore
    if (payload.op != 0 && payload.t == "MESSAGE") return

    const message = payload.d
    if (!message.content.startsWith("!echo")) return
    const content = message.content.slice(6)

    // Sending a message
    fetch(`https://discord.com/api/v9/channels/${message.channel_id}/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot <TOKEN>`,
            'Content-Type': 'application/json',
        },
        body: {
            content: content
        }
    })
})

client.connect()
```

## Current plans:
### Humanize events
### Caching info received from events
### Make easier specifying intents
### Make easier work with Discord Endpoints (for example, sending a message to a channel will look like this: `<TextChannel>.send("Loki, you should work harder!")`.
### Support for sharding
### Handling zombied connections
### WebHooks support
### Make easier work with Discord OAuth2
