import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import Rafled from "./Plugin/Rafled";

require("dotenv").config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const token = process.env.DISCORD_TOKEN;
client.once(Events.ClientReady, (c: Client) => {
  if (!c.user) return;
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

try {
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (!message.inGuild() && message.content.length < 1) return;

    if (!message.mentions.has("1139064141382942760") && message.inGuild()) {
      return;
    }

    let msg = message;

    if (message.content == "<@1139064141382942760>") {
      if (message.reference && message.reference.messageId) {
        msg = await message.fetchReference();
        if (!msg) return;

        if (msg.author.bot) return;
      } else {
        // Handle the case where the message doesn't reference another message
        return;
      }
    }

    let context = "";

    if (msg.inGuild()) {
      context = `This conversation is in ${msg.guild.name} server.`;
    } else {
      context = `This conversation is in a DM.`;
    }

    const request = await Rafled.character(
      "PlLEJAkYomFS29JSoV2kWnv5lIrGXMTL",
      msg.content,
      msg.channel.id + message.author.id,
      context,
      message.author.displayName
    );

    const id = request.id;

    let status = await Rafled.status(id);

    // broadcast typing
    await message.channel.sendTyping();
    while (status.status === "processing" || status.status === "pending") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await Rafled.status(id);

      message.channel.sendTyping();
    }
    if (status.status === "completed") {
      const response = status.response as string;

      // Split the response into chunks of 2000 characters or less
      const chunks = response.match(/[\s\S]{1,2000}/g) || [];

      // Send each chunk as a separate message
      for (const chunk of chunks) {
        try {
          await message.reply(chunk);
        } catch (error) {
          console.error(
            "Failed to reply to the message. It might have been deleted.",
            error
          );
          // Optionally, you can send the message directly to the channel instead of replying
          // await message.channel.send(chunk);
          break; // Exit the loop if you don't want to attempt sending further chunks
        }
      }
    }
  });
} catch (error) {
  console.error(error);
}

// Log in to Discord with your client's token
client.login(token);
