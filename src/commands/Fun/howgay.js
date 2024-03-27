const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, User, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('howgay')
        .setDescription('🌈 | How Gay Are You?')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select A User')
                .setRequired(false)
        ),
    async execute(interaction) {
        let targetUser = interaction.options.getUser('user');
        if (!targetUser) {
            targetUser = interaction.user;
        }

        const gayness = Math.floor(Math.random() * 101); // Random gayness level between 0 and 100

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('🏳‍🌈 | Howgay')
            .setDescription(`🏳‍🌈 | ${targetUser.username} Is ${gayness}% gay.`);

        const button2 = new ButtonBuilder()
            .setLabel('Re Roll')
            .setEmoji('🎲')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('refresh_howgay');

        const row = new ActionRowBuilder().addComponents(button2);

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = i => i.customId === 'refresh_howgay' && i.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            const newGayness = Math.floor(Math.random() * 101);
            embed.setDescription(`🏳‍🌈 | ${targetUser.username} Is ${newGayness}% Gay.`);
            button2.setDisabled(true); // Disable the button
            await i.deferUpdate();
            await message.edit({ embeds: [embed], components: [row] });
            collector.stop(); // Stop collecting further interactions
        });

        collector.on('end', () => {
            // Optionally, you can enable the button again here if needed
            // button2.setDisabled(false);
        });
    },
};

