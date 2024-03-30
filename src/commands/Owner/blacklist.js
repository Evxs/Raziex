const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('👑 | Add A User To The Blacklist')
        .addUserOption(option => option.setName('user').setDescription('The user to be blacklisted').setRequired(true)),
    async execute(interaction) {
        // Check if the user running the command is you
        if (interaction.user.id !== '1120856443659235498') {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription('**<:error:1223523541987885117> | You do not have permission to use this command.**');
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }

        // Get the user to be blacklisted from the command options
        const user = interaction.options.getUser('user');

        // Fetch the current blacklist
        let blacklist = [];
        try {
            blacklist = JSON.parse(fs.readFileSync('./blacklisted.json'));
        } catch (error) {
            console.error('Error reading blacklist:', error);
        }

        // Add the user ID to the blacklist if it's not already there
        if (!blacklist.includes(user.id)) {
            blacklist.push(user.id);
            // Update the blacklist file
            fs.writeFileSync('./blacklisted.json', JSON.stringify(blacklist, null, 4));
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`**<:member:1223522386805260340> | User ${user.tag} has been blacklisted.**`);
            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription('**<:error:1223523541987885117> | This user is already blacklisted.**');
            return interaction.reply({ embeds: [embed] });
        }
    },
};
