const
    {
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource,
        NoSubscriberBehavior,
        StreamType,
        getVoiceConnection
    } = require("@discordjs/voice"),
    chooseRandom = require("./chooseRandom"),
    audioPlayer = new Map(),
    queue = new Map(),
    audioResourceData = {
        inlineVolume: true,
        inputType: StreamType.Arbitrary,
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
        },
        // maxMissedFrames: Math.round(5000 / 20)
    };

/**
 * @description This is player class can be use play online resource in discord voice channel.
 * @example
 * ```js
 * // Load class.
 * const player = new Player(interaction);
 * 
 * // Play the url.
 * player.play("url");
 * 
 * // Get connection volume.
 * console.log(player.volume);
 * 
 * // Set connection volume.
 * console.log(player.setVolume(50));
 * 
 * // Pause the player.
 * if(player.isPaused())
 *  player.pause();
 * else
 *  // This one sould unpause.
 *  player.pause();
 * 
 * // Radio mode.
 * player.radio(["url"]);
 * ```
 */
module.exports = class {

    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    constructor(interaction) {
        if (interaction)
            this.data = {
                channelId: interaction.member.voice?.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true
            };

        return this;
    }

    /**
     * 
     * @param {{channelId: string, guildId: string, adapterCreator: import("discord.js").InternalDiscordGatewayAdapterCreator }} param0 
     * @returns 
     */
    setData({ channelId, guildId, adapterCreator, selfDeaf = true }) {
        this.data = {
            channelId,
            guildId,
            adapterCreator,
            selfDeaf
        };
        return this;
    }

    /**
     * 
     * @param {string} resource 
     * @returns {import("@discordjs/voice").AudioResource}
     */
    async play(resource) {
        const connection = joinVoiceChannel(this.data);
        const player = createAudioPlayer();
        player.play(
            createAudioResource(await this.#createStream(resource), audioResourceData)
        );
        connection.subscribe(player);
        audioPlayer.set(this.data.guildId, player);
        return this;
    }

    /**
     * @param {string} guildId
     * @returns {boolean}
     */
    isConnection(guildId) {
        if (getVoiceConnection(guildId))
            return true;

        else
            false;
    }

    /**
     * @returns {number}
     */
    get volume() {
        const player = audioPlayer.get(this.data.guildId);
        return player.state.resource.volume.volume;
    }

    /**
     * 
     * @param {number} input 
     * @returns {number}
     */
    setVolume(input) {
        const player = audioPlayer.get(this.data.guildId);
        if (input <= 100 && input >= 0)
            player.state.resource.volume.volume = input / 100;

        const connection = joinVoiceChannel(this.data);
        connection.subscribe(player);
        return this.volume;
    }

    /**
     * 
     * @returns {void}
     */
    pause() {
        const connection = joinVoiceChannel(this.data);
        const player = audioPlayer.get(this.data.guildId);
        if (this.isPaused())
            player.unpause();

        else
            player.pause();

        connection.subscribe(player);
        return this;
    }

    /**
     * 
     * @returns {boolean}
     */
    isPaused() {
        const player = audioPlayer.get(this.data.guildId);
        if (player.state.status === "paused")
            return true;

        else return false;
    }

    /**
     * 
     * @returns {void}
     */
    stop() {
        const connection = getVoiceConnection(this.data.guildId);
        const player = audioPlayer.get(this.data.guildId);
        try {
            player.stop();
            audioPlayer.delete(this.data.guildId);
        } catch { }
        connection.destroy();
        return this;
    }

    /**
     * 
     * @param {Array<string>} resources 
     * @returns {import("@discordjs/voice").AudioResource}
     */
    async radio(resources) {
        const connection = joinVoiceChannel(this.data);
        const player = createAudioPlayer();
        resources
            .forEach((re, index) => queue.set(++index, re));

        let count = 1;
        if (queue.size < 1)
            throw this.#error("No resource to play!");

        player.play(
            createAudioResource(await this.#createStream(chooseRandom(resources)), audioResourceData)
        );
        connection.subscribe(player);
        audioPlayer.set(this.data.guildId, player);
        player.on("debug", async (e) => {
            const [oldStatus, newStatus] = e.replace("state change:", "").split("\n").map(value => value.replace("from", "").replace("to", "").replaceAll(" ", "")).filter(value => value !== "").map(value => JSON.parse(value));
            if (newStatus.status === "idle") {
                player.play(
                    createAudioResource(await this.#createStream(queue.get(++count)), audioResourceData)
                );
                if (count === queue.size) count = 1;

                connection.subscribe(player);
                audioPlayer.set(this.data.guildId, player);
                return this;
            }
        })
        return this;
    }

    /**
     * 
     * @param {string} message 
     * @returns {Error}
     */
    #error(message) {
        class error extends Error {
            constructor(message) {
                super();
                this.name = "Player";
                this.message = message;
            }
        }
        return new error(message);
    }

    /**
     * 
     * @param {string} url 
     * @returns {stream}
     */
    async #createStream(url) {
        return url;
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