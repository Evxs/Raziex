const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('🎵 | Shows The Queue'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **You Need To Be In A VC To Play Music.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(interaction.member.user?.id);

        if (interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channelId !== member.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setDescription(`<:error:1223523541987885117> | **You Need To Be In The Same VC As Me.**`);

            return interaction.reply({ embeds: [embed] });
        }

        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply(`${interaction.client.emotes.error} | There is nothing playing!`);
        await interaction.deferReply();
        const currentSong = queue.songs[0];
        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join('\n');
        
        const embed = new EmbedBuilder()
            .addFields({ name: 'Current Queue:', value: `${q}`})
            .setColor('#301934');
        
        return interaction.followUp({ embeds: [embed] });
    },
};
