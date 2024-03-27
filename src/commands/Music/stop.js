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
                .setColor('White')
                .setDescription(`<:emoji_27:1215417390880268390> | **There Is Nothing Playing In The Server**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        queue.stop();
        
        const embed = new EmbedBuilder()
            .setColor('White')
            .setDescription(`<:emoji_28:1215417406433009694> | **I Have Stopped The Music**`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
