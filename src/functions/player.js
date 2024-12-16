
const
    {
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource,
        NoSubscriberBehavior,
        getVoiceConnection
    } = require("@discordjs/voice"),
    chooseRandom = require("./chooseRandom"),
    audioPlayer = new Map(),
    audioPlayerData = {
        behaviors: {
            maxMissedFrames: Math.round(5000 / 20),
            noSubscriber: NoSubscriberBehavior.Pause
        }
    },
    audioResourceData = {
        inlineVolume: true
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
     * @returns {import("@discordjs/voice").AudioPlayer}
     */
    async play(resource) {
        const connection = this.connection;
        const player = createAudioPlayer(audioPlayerData);
        player.play(
            createAudioResource(await this.#createStream(resource), audioResourceData)
        );
        connection.subscribe(player);
        audioPlayer.set(this.data.guildId, player);
        return player;
    }

    /**
     * @returns {import("@discordjs/voice").VoiceConnection}
     */
    get connection() {
        if (this.isConnection(this.data.guildId))
            return getVoiceConnection(this.data.guildId);

        else
            return joinVoiceChannel(this.data);
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
        return Number(player.state.resource.volume.volume * 100);
    }

    /**
     * 
     * @param {number} input 
     * @returns {number}
     */
    setVolume(input) {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (input <= 200 && input >= 0)
            player.state.resource.volume.volume = input / 100;

        connection.subscribe(player);
        return Number(this.volume);
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
    pause() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (!this.isPaused())
            player.pause();

        connection.subscribe(player);
        return this;
    }

    /**
     * 
     * @returns {void}
     */
    resume() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (this.isPaused())
            player.unpause();

        connection.subscribe(player);
        return this;
    }

    /**
     * 
     * @returns {void}
     */
    stop() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        player.stop();
        connection.destroy();
        audioPlayer.delete(this.data.guildId);
        return this;
    }

    /**
     * 
     * @param {Array<string>} resources 
     * @returns {import("@discordjs/voice").AudioResource}
     */
    async radio(resources) {
        const player = await this.play(chooseRandom(resources));
        player.on("debug", async (e) => {
            const [oldStatus, newStatus] = e.replace("state change:", "").split("\n").map(value => value.replace("from", "").replace("to", "").replaceAll(" ", "")).filter(value => value !== "").map(value => JSON.parse(value));
            if (newStatus.status === "idle") {
                const player = await this.play(chooseRandom(resources));
                return player;
            }
        });
        player.on("error", async () => {
            const player = await this.play(chooseRandom(resources));
            return player;
        });
        return player;
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
        try {
            const response = await fetch(url);
            url = response.url;
        } catch {
            url = url;
        }

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