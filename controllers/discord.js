import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";

// Create a new client instance
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

export const sendMessage = (message) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    channel.send(message); 
};