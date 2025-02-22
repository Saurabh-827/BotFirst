const Discord = require("discord.js");
const axios = require("axios");
const { GatewayIntentBits } = require("discord.js");
require("dotenv").config();

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
				`https://imagestack.onrender.com/api/search/photos?query=${query}`
			);
			let image = response.data.photos
				.map((photo) => photo.imageUrl)
				.slice(0, 5);
			return image;
		};
		let imageValue = await getImage();
		for (let img of imageValue) {
			const embed = new Discord.EmbedBuilder().setImage(img);
			await msg.channel.send({ embeds: [embed] });
		}
	}
});

bot.login(token);
