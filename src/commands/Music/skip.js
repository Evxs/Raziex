const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('🎵 | Skip The Current Song'),
    async execute(interaction, client) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;
        
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **You Need To Be In A VC To Play Music.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const queue = client.distube.getQueue(interaction);
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **There Is Nothing In The Queue.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const botVoiceChannel = queue.voiceChannel;
        if (!botVoiceChannel || (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id)) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **You And The Bot Aren't In The Same VC.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const song = await queue.skip();
            if (!song) {
                const embed = new EmbedBuilder()
                    .setColor('#301934')
                    .setDescription(`<:error:1223523541987885117> | **There is no next song to skip to!**`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:music:1223525751765336074> | **I Skipped The Current Song.**`);
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **Thier Is No Songs Up Next, I Cannot Skip.**`);
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};

