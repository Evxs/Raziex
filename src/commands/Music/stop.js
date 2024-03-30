const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('🎵 | Stops The Music'),

    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **There Is Nothing Playing In The Server**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        queue.stop();
        
        const embed = new EmbedBuilder()
            .setColor('#301934')
            .setDescription(`<:music:1223525751765336074> | **I Have Stopped The Music**`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
