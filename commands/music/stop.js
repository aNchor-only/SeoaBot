const { MessageEmbed } = require('discord.js')

/**
 * @param {import('../../classes/Client')} client
 * @param {import('discord.js').Message} msg
*/
async function fn (client, msg, locale) {
  if (!msg.guild) return msg.channel.send('ㅁㄴㅇㄹ')
  let player = client.lavalink.players.get(msg.guild.id)
  player.stop()
  msg.channel.send('byebye')
  client.lavalink.leave(msg.guild.id)
}

module.exports = fn
module.exports.aliases = ['stop']
