const { EmbedBuilder, ActionRowBuilder, inlineCode, bold, italic, blockQuote } = require('discord.js');
const date = require('date-and-time');
const Sheets = require('../../utils/sheets');
const ImgBB = require('../../utils/imgbb');

require('dotenv').config();

module.exports = {
    cooldown: 10,
    data: {
        name: 'startConversationSuggestion',
    },
    async execute(interaction) {
        const endConversation = new ActionRowBuilder().addComponents(interaction.message.components[0].components[1]);
        const thread = interaction.channel;
        await interaction.update({ components: [endConversation] });

        let timedOut = false;
        const userData = {
            discordId: interaction.user.id,
            discordUsername: interaction.user.username,
        }

        const collectorFilter = m => interaction.user.id === m.author.id;

        await thread.send({ content: blockQuote(bold(' 請告訴我們您的遊戲內UID（UID可以在遊戲內右下角找到）。\n')) + italic('(Only text message can be recorded)') });

        await thread.awaitMessages({
            filter: collectorFilter,
            time: 3_00_000,
            max: 1,
            errors: ['time']
        }).then(messages => {
            userData.governorId = messages.first().content;
            thread.send({ content: '收到！' });
        }).catch(() => {
            timedOut = true;
        });

        if (timedOut) {
            await thread.send({ content: bold('You did not provide your Governor ID in time. This thread will be deleted.') }).catch();
            setTimeout(function () {
                thread.delete().catch();
            }, 2_000);
            return;
        }

        await thread.send({ content: blockQuote(bold('請詳細地描述您的反饋和建議，您的想法對我們來說非常重要！')) });

        await thread.awaitMessages({
            filter: collectorFilter,
            time: 9_00_000,
            max: 1,
            errors: ['time']
        }).then(messages => {
            userData.details = (messages.first().content) ? messages.first().content : "-";

            const attachment = messages.first().attachments.first();
            if (attachment && attachment.contentType.includes('image')) userData.screenshot = attachment.proxyURL;

            thread.send({ content: '感謝您的耐心。您的建議對代號RIDER的優化和改進非常重要，再次感謝您的建議，我們將不斷努力，為領航員們提供更好的遊戲體驗！' });
        }).catch(() => {
            timedOut = true;
        });

        if (timedOut) {
            await thread.send({ content: bold('You did not provide detailed description in time. This thread will be deleted.') }).catch();
            setTimeout(function () {
                thread.delete().catch();
            }, 2_000);
            return;
        }

        if (!userData.governorId) userData.governorId = '-';
        if (!userData.details) userData.details = '-';

        const embed = new EmbedBuilder()
            .setTitle('Suggestion')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(bold('Details') + '\n' + userData.details)
            .addFields(
                { name: 'Governor ID', value: inlineCode(userData.governorId) },
            )
            .setColor('Green')
            .setTimestamp();

        if (userData.screenshot) {
            userData.screenshotUrl = await ImgBB(userData.screenshot);
            userData.screenshotFunction = '=HYPERLINK("' + userData.screenshotUrl + '", IMAGE("' + userData.screenshotUrl + '", 1))'
            embed.setImage(userData.screenshotUrl);
        } else {
            userData.screenshotFunction = '-'
        }

        const now = new Date();

        const response = await Sheets.appendRow(process.env.FEEDBACK_SHEET, 'Suggestion!A2:Z', [[interaction.user.id, interaction.user.username, userData.governorId, userData.details, date.format(now, 'MM-DD-YYYY HH:mm [GMT]ZZ'), userData.screenshotFunction]]);

        // console.log(response);

        await thread.send({ content: bold('This thread will be deleted in 10 seconds.') });

        setTimeout(function () {
            thread.delete().catch();
        }, 10_000);
    },
};