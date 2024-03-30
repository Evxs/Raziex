const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('👑 | Remove A User From The Blacklist')
        .addUserOption(option => option.setName('user').setDescription('The user to be removed from the blacklist').setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== '1120856443659235498') {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription('**<:error:1223523541987885117> | You do not have permission to use this command.**');
            return interaction.reply({ embeds: [embed] });
        }
        const user = interaction.options.getUser('user');
        let blacklist = [];
        try {
            blacklist = JSON.parse(fs.readFileSync('./blacklisted.json'));
        } catch (error) {
            console.error('Error reading blacklist:', error);
        }
        const index = blacklist.indexOf(user.id);
        if (index !== -1) {
            blacklist.splice(index, 1);
            fs.writeFileSync('./blacklisted.json', JSON.stringify(blacklist, null, 4));
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`**<:member:1223522386805260340> | User ${user.tag} has been removed from the blacklist.**`);
            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription('**<:error:1223523541987885117> | This user is not blacklisted.**');
            return interaction.reply({ embeds: [embed] });
        }
    },
};
