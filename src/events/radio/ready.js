const
    error = require("../../functions/error"),
    radiostation = require("../../storage/radiostation.json"),
    database = require("../../functions/database"),
    player = require("../../functions/player");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @returns {void}
 */
module.exports = async (client) => {
    try {
        client.guilds.cache.forEach(async guild => {
            const
                db = new database(client.db),
                databaseNames = {
                    afk: `radioAFK.${guild.id}`,
                    station: `radioStation.${guild.id}`
                },
                channel = await db.get(databaseNames.afk),
                station = await db.get(databaseNames.station) || "Lofi Radio";

            if (await db.has(databaseNames.afk))
                return await new player()
                    .setData(
                        {
                            channelId: channel,
                            guildId: guild.id,
                            adapterCreator: guild.voiceAdapterCreator
                        }
                    )
                    .radio(radiostation[station]);

        })
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