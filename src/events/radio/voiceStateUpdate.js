const
    error = require("../../functions/error"),
    database = require("../../functions/database"),
    radiostation = require("../../storage/radiostation.json"),
    player = new (require("../../functions/player"))();

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").VoiceState} oldState 
 * @param {import("discord.js").VoiceState} newState 
 * @returns {void}
 */
module.exports = async (client, oldState, newState) => {
    try {
        const
            db = new database(client.db),
            databaseNames = {
                afk: `radioAFK.${oldState.guild.id}`,
                station: `radioStation.${oldState.guild.id}`
            },
            channel = await db.get(databaseNames.afk),
            station = await db.get(databaseNames.station) || "Lofi Radio";

        if (oldState.member.id === client.user.id && !newState.channelId)
            if (await db.has(databaseNames.afk)) {
                return await player
                    .setData(
                        {
                            channelId: channel,
                            guildId: oldState.guild.id,
                            adapterCreator: oldState.guild.voiceAdapterCreator
                        }
                    )
                    .radio(radiostation[station]);

            }
    } catch (e) {
        error(e)
    }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */