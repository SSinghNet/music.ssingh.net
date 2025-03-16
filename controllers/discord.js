import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";
import "dotenv/config";
import sanitizeHtml from 'sanitize-html';

// Create a new client instance
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

export const sendMessage = (message) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    channel.send(message); 
};

export const sendEmbed = (album) => { 

    const truncate = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;
    const sant = (input) => sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: []
    });

    const artists = album.artists.map(artist => artist.name).join(", ");

    const embed = new EmbedBuilder()
        .setColor(0xF2545B)
        .setTitle(`${truncate(album.name, 100)} - ${artists}`)
        .setAuthor({ name: "SSingh.Net Music", iconURL: "https://music-ssingh.onrender.com/images/slogo.png", url: "https://music.ssingh.net/" })
        .setThumbnail(album.image)
        .setURL(`https://music.ssingh.net/album/${album.id}`)
        .setDescription(album.review && sant(album.review).trim() ? truncate(sant(album.review), 500) : "ㅤㅤ")
        .setFooter({ text: `${album.score}%`});
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    channel.send({ embeds: [embed] });
}