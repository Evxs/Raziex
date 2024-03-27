const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription(`❓ | Gets The Support server`),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`Support Server`)
            .setDescription(`In Need Of Help? Join The Server Using The Button Below!`)
            .setTimestamp();
        const button = new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setEmoji({ id: '1203789720711331870' })
            .setURL('https://discord.gg/G5Tj96UmHs');
        const row = new ActionRowBuilder().addComponents(button);    
        await interaction.reply({
            embeds: [embed],
            ephemeral: false,
            components: [row],
        });
    },
};