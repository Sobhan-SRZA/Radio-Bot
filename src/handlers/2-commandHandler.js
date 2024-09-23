const
    clc = require("cli-color"),
    post = require("../functions/post"),
    loadCommand = require("../functions/loadCommand"),
    firstUpperCase = require("../functions/firstUpperCase"),
    error = require("../functions/error"),
    config = require("../../config"),
    selectLanguage = require("../functions/selectLanguage"),
    replaceValues = require("../functions/replaceValues"),
    defaultLanguage = selectLanguage(config.source.default_language);

/**
 * 
 * @param {import("discord.js").Client} client 
 * @returns {void}
 */
module.exports = async (client) => {
    try {
        ["only_message", "only_slash"].forEach((type) => {
            loadCommand(`${process.cwd()}/src/commands`, type, client.commands);
            post(
                replaceValues(defaultLanguage.replies.loadCommands, {
                    cmdCount: clc.cyanBright(client.commands.filter(a => a[type]).size),
                    type: firstUpperCase(type.replace("only_", ""))
                }),
                "S"
            );
        });
    } catch (e) {
        error(e)
    }
};
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */