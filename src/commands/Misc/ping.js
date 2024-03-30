const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(`📶 | Gets The Bots Ping`),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#301934')
            .setTitle(`📶 | Bot Ping`)
            .setDescription(`\`\`\`${interaction.client.ws.ping}ms\`\`\``)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: false, 
        });
    },
};