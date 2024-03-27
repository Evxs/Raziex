const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const volumeFilePath = path.join(__dirname, 'volume_levels.json');
function loadVolumeLevels() {
    try {
        return JSON.parse(fs.readFileSync(volumeFilePath));
    } catch (error) {
        console.error("Error loading volume levels:", error);
        return {};
    }
}
function saveVolumeLevels(volumeLevels) {
    try {
        fs.writeFileSync(volumeFilePath, JSON.stringify(volumeLevels, null, 4));
    } catch (error) {
        console.error("Error saving volume levels:", error);
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('🎵 | Set The Volume Of The Music')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('💭 | Enter Volume Level')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription('<:emoji_27:1215417390880268390> | **There Is Nothing Playing In This Server.**');
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }       
        const botVoiceChannel = queue.voiceChannel;
        if (!botVoiceChannel || (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id)) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription(`<:emoji_27:1215417390880268390> | **You And The Bot Aren't In The Same VC.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const volume = interaction.options.getInteger('level');
        if (isNaN(volume) || volume < 0 || volume > 100) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription('<:emoji_27:1215417390880268390> | **Please Enter A Number From `1-100`**');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        queue.setVolume(volume);
        const volumeLevels = loadVolumeLevels();
        volumeLevels[interaction.guildId] = volume;
        saveVolumeLevels(volumeLevels);
        const embed = new EmbedBuilder()
            .setColor('White')
            .setDescription(`<:emoji_28:1215417406433009694> | **I Set The Volume To \`${volume}%\`**`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
