const {
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ChannelType,
	channelLink,
} = require("discord.js");
require("dotenv").config();

module.exports = {
	cooldown: 10,
	data: {
		name: "suggestion",
	},
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const embed = new EmbedBuilder()
			.setTitle("建議")
			.setDescription(
				"領航員，感謝您向代號RIDER提出建議和反饋！您的反饋將會直達代號RIDER團隊，我們期待聽到您的聲音。\n在您提出建議之前，請根據引導提供如下信息，以幫助我們更好地優化遊戲。如果您準備好了，請點擊下方的綠色按鈕開啟反饋。"
			)
			.setColor("White");

		const startButton = new ButtonBuilder()
			.setLabel("開啟對話")
			.setStyle(ButtonStyle.Success)
			.setCustomId("startConversationSuggestion")
			.setEmoji("▶️");

		const endButton = new ButtonBuilder()
			.setLabel("結束對話")
			.setStyle(ButtonStyle.Danger)
			.setCustomId("endConversation")
			.setEmoji("🔚");

		const row = new ActionRowBuilder().addComponents(
			startButton,
			endButton
		);

		const thread = await interaction.channel.threads.create({
			name: "Suggestion",
			reason: "Interaction by " + interaction.user.tag,
			type: ChannelType.PrivateThread,
			invitable: false,
		});

		await thread.members.add(interaction.user.id);

		const message = await thread.send({
			embeds: [embed],
			components: [row],
		});

		await interaction.editReply({
			content:
				"領航員，我們為您創建了一個建議提交頻道，請在這裡 " +
				channelLink(thread.id) +
				" 提交您的建議與反饋",
		});
	},
};
