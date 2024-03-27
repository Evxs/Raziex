const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
const { Constants } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('🎵 | Join A Voice Channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('💭 | The Voice Channel to Join')),

    async execute(interaction) {
        let voiceChannel = interaction.member.voice.channel;
        const targetChannel = interaction.options.getChannel('channel');
        
        if (targetChannel) {
            voiceChannel = targetChannel;
            if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel.type)) {
                const embed = new EmbedBuilder()
                    .setColor('White')
                    .setDescription(`<:emoji_27:1215417390880268390> | **${interaction.options.getChannel('channel')} Is Not A Valid Voice Channel.**`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
        
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription('<:emoji_27:1215417390880268390> | **You Must Be In Or Enter A Valid Voice Channel.**');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        interaction.client.distube.voices.join(voiceChannel);
        
        const embed = new EmbedBuilder()
            .setColor('White')
            .setDescription(`<:emoji_28:1215417406433009694> | **I Have Joined ${voiceChannel}**`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
