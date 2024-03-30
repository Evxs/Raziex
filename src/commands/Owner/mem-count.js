const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('total-members')
        .setDescription('👑 | Total Member Count Of Raziex'),
    async execute(interaction, client) {
        // Check if the user running the command is you
        if (interaction.user.id !== '1120856443659235498') {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription('**<:error:1223523541987885117> | You do not have permission to use this command.**');
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }

            let totalCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`**Total: ${totalCount}**`);
            return interaction.reply({ embeds: [embed] });

    },
};
