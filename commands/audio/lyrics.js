const Command = require('./../../classes/Command.js');

module.exports = class LyricsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            group: 'audio',
            memberName: 'lyrics',
            description: "Searches for lyrics for the current song, if any, or for a query.",
            formatExplanation: {
                "[query]": "The song to look up the lyrics for."
            },
            args: [{
                key: "query",
                type: "string",
                prompt: "",
                default: ""
            }]
        });
    }

    async run(msg, { query }) {
        let name = "";
        if (query) {
            name = query;
        } else if (msg.guild.queue && msg.guild.queue.length) {
            name = msg.guild.queue[0].songTitle;
        } else return msg.error("This command requires that music be playing or that you enter a query.");

        let body = await this.client.sra.api.other.lyrics({ title: name });

        if (body.error || !body.lyrics)
            return msg.error(`The lyrics haven't been found! Make sure the title is right and the song isn't unknown.`);
        if (body.lyrics.length > 5999)
            return msg.error("The lyrics are too long! Look for something shorter.")

        let split = body.lyrics.split("\n").reduce((prev, cur) => {
            console.log(prev, (prev[prev.length-1] || "").length + "\n".length + cur.length);
            if (!prev || !prev.length)
                return [ cur ];
            else if (prev[prev.length-1].length + "\n".length + cur.length < 1024) {
                prev[prev.length-1] += "\n" + cur;
                return prev;
            }
            prev.push(cur);
            return prev;
        }, []);

        console.log(split.map(str => str.length));

        let embed = this.client.utils.embed()
            .setDescription(split[0])
            .setImage(Object.values(body.thumbnail)[0])

        split.shift();

        split.forEach(thing => {
            embed.addField("\u200b", thing);
        })

        msg.channel.send(`**${body.title}**\n_By ${body.author}_`, { embed });
    }
};