const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');

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
        .setName('play')
        .setDescription('🎵 | Play A Song')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('💭 | Enter A Song Name Or Url')
                .setRequired(true)),
    async execute(interaction, client) {
        const query = interaction.options.getString('query');
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

        try {
            await interaction.deferReply();
            const searchResult = await client.distube.search(query, { limit: 1 });
            const song = searchResult[0];

            // Load volume level from JSON file based on server ID
            const volumeLevels = loadVolumeLevels();
            const serverVolume = volumeLevels[interaction.guildId] || 50;

            

            await client.distube.play(voiceChannel, song.url, { member: interaction.member });
            client.distube.setVolume(interaction.guildId, serverVolume);

            const likes = song.likes ? song.likes.toString() : 'N/A';
            const views = song.views ? song.views.toString() : 'N/A';
            const videoInfo = await ytdl.getInfo(song.url);
            const thumbnailUrl = videoInfo.videoDetails.thumbnails[0].url;

            const embed = new EmbedBuilder()
                .setColor('#301934')
                .setTitle('Added To Queue')
                .setDescription(`<:music:1223525751765336074> [${song.name}](${song.url})`)
                .setThumbnail(thumbnailUrl)
                .addFields(
                    { name: 'Likes', value: likes, inline: true },
                    { name: 'Views', value: views, inline: true },
                    { name: 'Author', value: videoInfo.videoDetails.author.name, inline: true },
                    { name: 'Duration', value: formatDuration(videoInfo.videoDetails.lengthSeconds), inline: true },
                    { name: 'Upload Date', value: new Date(videoInfo.videoDetails.uploadDate).toDateString(), inline: true }
                );
            interaction.followUp({ embeds: [embed] });

            // Save/update volume level for this server to JSON file
            volumeLevels[interaction.guildId] = serverVolume;
            saveVolumeLevels(volumeLevels);
        } catch (error) {
            console.error(error);
            interaction.followUp({ content: 'An error occurred while trying to play the song.', ephemeral: true });
        }
    },
};

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
}
