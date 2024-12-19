const { ChannelType, PermissionFlagsBits, channelLink } = require("discord.js");
require("dotenv").config();

module.exports = {
	cooldown: 10,
	data: {
		name: "bugReport",
	},
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const channel = await interaction.guild.channels.create({
			name: "ticket-" + interaction.user.id,
			type: ChannelType.GuildText,
			parent: process.env.BUG_CATEGORY,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
					],
				},
			],
		});

		await interaction.editReply({
			content:
				"感謝您的反饋！我們已經在" +
				channelLink(channel.id, interaction.guildId) +
				"中為您創建了工單，請耐心等待官方人員的回應。",
		});
	},
};
