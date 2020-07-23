const Command = require('./../../classes/Command.js');
const { MessageAttachment } = require("discord.js");
const Jimp = require("jimp");

module.exports = class CropCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'crop',
            aliases: [],
            group: 'imgman',
            memberName: 'crop',
            description: "Crops an image to the specified size",
            args: [{
                key: "image",
                type: "image",
                prompt: ""
            }]
        });
    }

    asNum(msg, flag) {
        let val = msg.flags[flag];
        if (typeof val != "string")
            return "The `" + flag + "` flag requires a value."
        
        if (isNaN(val) || val.includes("."))
            return `The \`${flag}\` flag requires an integer value.`;

        return parseInt(val);
    }

    async run(msg, { image }) {
        let img = await Jimp.read(image);
        let width = img.bitmap.width;
        if (msg.flags.width) {
            let w = this.asNum(msg, "width");
            if (typeof w == "string")
                return msg.error(w);
            width = w;
        }

        let height = img.bitmap.height;
        if (msg.flags.height) {
            let h = this.asNum(msg, "height");
            if (typeof h == "string")
                return msg.error(h);
            height = h;
        }
        
        img.crop(0, 0, width, height);

        let buf = await img.getBufferAsync(Jimp.MIME_PNG);
        let att = new MessageAttachment(buf, "crop.png");

        return msg.channel.send("Here's your cropped image.", att);
    }
};