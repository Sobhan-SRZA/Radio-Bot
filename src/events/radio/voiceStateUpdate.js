const
    error = require("../../functions/error"),
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
            db = client.db,
            databaseNames = {
                afk: `radioAFK.${oldState.guild.id}`,
                station: `radioStation.${oldState.guild.id}`
            };

        if (oldState.member.id === client.user.id && !newState.channelId)
            if (await db.has(databaseNames.afk)) {
                const station = await db.get(databaseNames.station) || "Lofi Radio";
                player
                    .setData({
                        channelId: oldState.channelId,
                        guildId: oldState.guild.id,
                        adapterCreator: oldState.guild.voiceAdapterCreator
                    })
                    .radio(radiostation[station]);
            }

        if (oldState && !newState.channelId)
            if (player.isConnection(oldState.guild.id))
                if (!await db.has(databaseNames.afk))
                    return await player
                        .setData({
                            channelId: oldState.channelId,
                            guildId: oldState.guild.id,
                            adapterCreator: oldState.guild.voiceAdapterCreator
                        })
                        .stop();

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