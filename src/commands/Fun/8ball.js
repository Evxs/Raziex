const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const responses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('🎱 | Ask The Magic 8-Ball A Question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question')
                .setRequired(true)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');

        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('🎱 | Magic 8-Ball')
            .setDescription(`**Question:** ${question}\n**Answer:** ${response}`);

        const button = new ButtonBuilder()
            .setLabel('Re Roll')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎲')
            .setCustomId('refresh_8ball')
            .setDisabled(false); // initially enabled

        const row = new ActionRowBuilder().addComponents(button);

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = i => i.customId === 'refresh_8ball' && i.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            const newResponse = responses[Math.floor(Math.random() * responses.length)];
            embed.setDescription(`**Question:** ${question}\n**Answer:** ${newResponse}`);
            await i.deferUpdate();
            await message.edit({ embeds: [embed] });
            button.setDisabled(true); // disable button after first click
            row.components = [button];
            await message.edit({ components: [row] });
            collector.stop(); // Stop collecting further interactions
        });

        collector.on('end', () => {
            if (!button.disabled) {
                button.setDisabled(true); // Disable button if the collector ends without any interaction
                row.components = [button];
                message.edit({ components: [row] });
            }
        });
    },
};
