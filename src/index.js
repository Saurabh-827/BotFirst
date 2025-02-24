const Discord = require("discord.js");
const axios = require("axios");
const { GatewayIntentBits, AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const express = require("express"); // Added for Render compatibility
const { EmbedBuilder } = require("discord.js");

// Create an Express app to bind to a port
const app = express();
const PORT = process.env.PORT || 3000;

// Dummy route to keep the server alive
app.get("/", (req, res) => {
	res.send("Discord bot is running!");
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const bot = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const token = process.env.BotFirst_Token;

const prefix = "!";

bot.on("ready", () => {
	console.log("Bot is ready for action!");
});

bot.on("messageCreate", async (msg) => {
	if (!msg.content.startsWith(prefix)) {
		return;
	}
	const args = msg.content.slice(prefix.length).trim().split(/ +/g);

	const command = args.shift().toLowerCase();
	console.log(args);

	if (command === "ego") {
		msg.react("😊");
	}

	if (command === "clear") {
		let num = 2;
		if (args[0]) {
			num = parseInt(args[0]) + 1;
		}
		msg.channel.bulkDelete(num);
		msg.channel.send(`Deleted ${num - 1} messages!`);
	}

	if (command === "capslock") {
		const combinedArgs = args.join(" ");
		msg.channel.send(
			`${
				msg.author.username
			} is angry and says:\n\n ${combinedArgs.toUpperCase()}`
		);
	}

	if (command === "search") {
		let query = args.join(" ");
		let getImage = async () => {
			let response = await axios.get(
				`https://imager-m7gl.onrender.com/api/photos/search?queryTerm=${query}`
			);
			console.log(response.status);
			if (response.status !== 200) {
				await axios.get(
					"https://imager-m7gl.onrender.com/api/photos/search?queryTerm=nature"
				);
				response = await axios.get(
					`https://imager-m7gl.onrender.com/api/photos/search?queryTerm=${query}`
				);
			}
			let image = response.data.map((photo) => photo.imageUrl);
			let img = image.slice(0, 5);

			return img;
		};

		try {
			let imageValue = await getImage();
			for (let img of imageValue) {
				const embed = new EmbedBuilder().setImage(img);
				await msg.channel.send({ embeds: [embed] });
			}
		} catch (error) {
			console.error("Error fetching images:", error);
			msg.channel.send(
				"⚠️ Could not fetch images. Try again later or try with different search terms."
			);
		}
	}
});
bot.on("error", (error) => {
	console.error("Discord bot error:", error);
});

process.on("unhandledRejection", (error) => {
	console.error("Unhandled promise rejection:", error);
});
bot.login(token);
