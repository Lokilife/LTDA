[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
# LTDA (Loki's TypeScript Discord API)
LTDA is a new lib for Discord API written in TypeScript. This project was made for learning JavaScript/TypeScript, WebSockets and etc. Therefore, if you see the shit code and know the solution better, I would be glad if you wrote about it in the issues tab on the repository page, any criticism is accepted.<br/>

This project is not intended for cloning libraries such as Discord.JS, again, this project was made just for experience. Yes, I borrowed a couple of ideas from code of Discord.JS, but it was like peeping at a classmate at school on a test, how to solve the exercise correctly.

## Current version: v1.0.1.
## Features:
- This library is only compatible with ESM syntax
- This library is inconvenient to use... But i'll fix it... Somewhen...
- The library is updated very rarely due to the laziness of the author
- Author have bad English

## Usage Example (ECHO-bot):
```ts
import { Client } from 'ltda'

// (1 << 9) + (1 << 10) - GUILD_MESSAGES and GUILD_MESSAGES_REACTIONS
const client = new Client('<TOKEN>', (1 << 9) + (1 << 10), 1)

client.on('ready', async function () {
  const {
      username,
      discriminator,
      id
  } = client.user
  console.log(`Logged in Discord as ${username}#${discriminator} (${id})!`)
})

client.on('message', async (message) => {
  if (!message.content.startsWith("!echo")) return
  const content = message.content.slice(6)

  // Sending a message
  await client.api.post.channels[message.channelID].messages({content})
})

// With non supported event
client.on('MESSAGE_REACTION_REMOVE', async ({ user_id, channel_id, message_id }) => {
  const user = await client.api.get.users[user_id]()
  const message = await client.api.get.channels[channel_id].messages[message_id]()
  console.log(`${user.username} removed his reaction on message with content: "${message.content}"`)
})

client.connect()
```
## Troubleshooting
Yo, if you're have some issues with my library you can ask for help on [this Discord server](https://discord.gg/qYSAvCtDjx).<br/></br>
If you think that this is my fault, you can insult me and write issue on the repository or [this Discord server](https://discord.gg/qYSAvCtDjx).<br/>
I'm not a godlike programmer so please describe the error in detail. This should preferably include information about what you are using to run (OS, Node.JS version, loader (if it's not default), library version, etc) and steps to repeat the error.<br/>
Thx.

## Current plans:
- <s>Make API router - <span style="color: red">High priority</span></s> - <span style="color: lime">FINISHED</span> (next step is REST manager)
- Make REST manager - <span style="color: red">High priority</span> - <span style="color: yellow">In process</span>
- Make caching of data received from events - <span style="color: red">High priority</span> - <span style="color: yellow">In process</span>
- Wrap WebSocketShard in more convenient class - <span style="color: red">High priority</span> - <span style="color: yellow">In process</span>
- Support for sharding - <span style="color: orange">Medium priority</span> - <span style="color: yellow">In process</span>
- Wrap events objects in more convenient classes & typify events - <span style="color: orange">Medium priority</span> - <span style="color: yellow">In process</span>
- Wrap the REST manager in more convenient methods (for example sending message will look like this: `<TextChannel>.send("Loki, you should work harder!")`) - <span style="color: orange">Medium priority</span> - <span style="color: yellow">In process</span>
- Wrap intents in a more convenient class - <span style="color: lime">Low priority</span>
- Voice channels support - <span style="color: lime">Low priority</span>
- Handling "zombied" connections - <span style="color: lime">Low priority</span>
- WebHooks support - <span style="color: lime">Low priority</span>
- Discord OAuth2 support - <span style="color: lime">Low priority</span>

<!-- <p>P.s. undefined priority means that this have very low chance to be made cuz it's may be impossible or i don't have enough knowledge of JS/TS or i'm just lazy to do it.</p> -->

## Last update changes:
- Improved [README.md](https://github.com/Lokilife/LTDA/blob/main/README.md)
  - Impoved style of lists
  - Improved style of the list of current plans
  - Improved list of current plans
  - Improved usage example
  - Made list of last update changes
  - Fixed typos
- Made API router
- First steps of caching info received from events
- First steps of wrapping WebSocketShard to Client class

## License
[BSD 3-Clause](LICENSE)
