const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionFlagsBits,
	bold,
} = require("discord.js");
const Sheets = require("../../utils/sheets");

module.exports = {
	cooldown: 60,
	category: "server",
	data: new SlashCommandBuilder()
		.setName("feedback")
		.setDescription("Feedback related commands")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("setup")
				.setDescription("Setup feedback embed and buttons")
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const embed = new EmbedBuilder()
			.setTitle("遊戲建議和錯誤報告")
			.setColor("White")
			.setDescription(
				bold("领航员，讓我們知道您的想法！") +
					"\n選擇一個問題類型，向代號RIDER開發團隊發送消息。"
			)
			.addFields(
				{
					name: "錯誤報告",
					value: "如果您在遊戲過程中遇到了問題，或發現了錯誤，請向我們反饋。",
					inline: false,
				},
				{
					name: "建議",
					value: "分享您對如何改進遊戲的想法。",
					inline: false,
				}
			);
			// .setFooter({
			// 	text: "Age of Empires Mobile",
			// 	iconURL: "https://i.ibb.co/Fm4fttV/Logo.png",
			// });

		const bugReportButton = new ButtonBuilder()
			.setLabel("錯誤報告")
			.setStyle(ButtonStyle.Danger)
			.setCustomId("bugReport")
			.setEmoji("🐛");

		const suggestionButton = new ButtonBuilder()
			.setLabel("建議")
			.setStyle(ButtonStyle.Success)
			.setCustomId("suggestion")
			.setEmoji("💡");

		const translationIssueButton = new ButtonBuilder()
			.setLabel("Translation Issue")
			.setStyle(ButtonStyle.Primary)
			.setCustomId("translationIssue")
			.setEmoji("🔤");

		const row = new ActionRowBuilder().addComponents(
			bugReportButton,
			suggestionButton
			//translationIssueButton
		);

		await interaction.channel.send({ embeds: [embed], components: [row] });

		await interaction.editReply({ content: "Feedback setup complete!" });
	},
};

function formatData(data) {
	return data.reduce((acc, row) => {
		const [id, username, issue, date] = row;
		acc[id] = { username, issue, date };
		return acc;
	}, {});
}
