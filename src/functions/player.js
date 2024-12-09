
const
    {
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource,
        NoSubscriberBehavior,
        getVoiceConnection
    } = require("@discordjs/voice"),
    chooseRandom = require("./chooseRandom"),
    {
        useMainPlayer,
        QueueRepeatMode,
        useQueue,
        getVoiceConnections
    } = require("discord-player"),
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
     * @returns {import("@discordjs/voice").AudioResource}
     */
    async play(resource) {
        const connection = joinVoiceChannel(this.data);
        const player = createAudioPlayer(audioPlayerData);
        player.play(
            createAudioResource(await this.#createStream(resource), audioResourceData)
        );
        connection.subscribe(player);
        audioPlayer.set(this.data.guildId, player);
        return this;
    }

    /**
     * @returns {getVoiceConnection}
     */
    get connection() {
        return getVoiceConnections().get(this.data.guildId);
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
        const queue = (useMainPlayer()).queues.cache.get(this.data.guildId);
        return Number(queue.node.volume);
    }

    /**
     * 
     * @param {number} input 
     * @returns {number}
     */
    setVolume(input) {
        const queue = (useMainPlayer()).queues.cache.get(this.data.guildId);
        if (input <= 100 && input >= 0)
            queue.node.setVolume(input);

        return Number(this.volume);
    }

    /**
     * 
     * @returns {void}
     */
    pause() {
        const queue = (useMainPlayer()).queues.cache.get(this.data.guildId);
        if (queue.node.isPaused())
            queue.node.resume();

        else
            queue.node.pause();

        return this;
    }

    /**
     * 
     * @returns {void}
     */
    resume() {
        const queue = (useMainPlayer()).queues.cache.get(this.data.guildId);
        if (queue.node.isPaused())
            queue.node.resume();

        return this;
    }

    /**
     * 
     * @returns {boolean}
     */
    isPaused() {
        const queue = (useMainPlayer()).queues.cache.get(this.data.guildId);
        if (queue.node.isPaused())
            return true;

        else return false;
    }

    /**
     * 
     * @returns {void}
     */
    stop() {
        const queue = (useMainPlayer()).queues.cache.get(this.data.guildId);
        try {
            queue.delete();
        } catch { }
        return this;
    }

    /**
     * 
     * @param {Array<string>} resources 
     * @returns {import("@discordjs/voice").AudioResource}
     */
    async radio(resources) {
        try {
            const player = useMainPlayer();
            const play = async () => {
                try {
                    const query = (await fetch(chooseRandom(resources))).url;
                    await player.play(this.data.channelId, query, {
                        nodeOptions: {
                            pauseOnEmpty: true,
                            selfDeaf: true,
                            volume: 100,
                            leaveOnEmpty: false,
                            leaveOnEnd: false,
                            leaveOnStop: true,
                            repeatMode: QueueRepeatMode.QUEUE
                        }
                    });
                } catch {
                    await play();
                }
            };
            await play();
            player.events.on("emptyQueue", await play());
            player.events.on("playerError", await play());
            player.events.on("error", await play());
            player.events.on("connectionDestroyed", await play());
        } catch { }
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