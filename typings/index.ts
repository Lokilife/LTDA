import { Client } from '../src'

const client = new Client('<TOKEN>', 1536, 1)

client.on('ready', async function () {
  const {
      username,
      discriminator,
      id
  } = client.user
  console.log(`Logged in Discord as ${username}#${discriminator} (${id})!`)
})

client.on('payload', payload => {
  console.log(payload)
})

client.on('message', async (message) => {
  if (!message.content.startsWith("!echo")) return
  const content = message.content.slice(6)

  // Sending a message
  console.log(await client.api.channels[message.channelID].messages.post({content}))
})

client.on('MESSAGE_REACTION_REMOVE', async ({ user_id, channel_id, message_id }) => {
  const user = await client.api.users[user_id].get()
  const message = await client.api.channels[channel_id].messages[message_id].get()
  console.log(`${user.username} removed his reaction on message with content: "${message.content}"`)
})

client.connect()
