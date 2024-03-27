const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set the loop mode.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Select the loop mode.')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off'},               
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue'})),

    async execute(interaction, client) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        // Check if user is in a voice channel
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription(`<:emoji_27:1215417390880268390> | **You Need To Be In A VC To Play Music.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const memberr = interaction.guild.members.cache.get(interaction.member.user?.id);
        // Check if the bot is in a voice channel and if it's not the same as the user's voice channel
        if (interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channelId !== member.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor('White')
                .setDescription(`<:emoji_27:1215417390880268390> | **You Need To Be In The Same VC As Me.**`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const repeatType = interaction.options.getString('type');
        let mode = null;
        
        switch (repeatType) {
            case 'off':
                mode = 0;
                break;
            case 'track':
                mode = 1;
                break;
            case 'queue':
                mode = 2;
                break;
            default:
                return interaction.reply({ content: `${client.emotes.error} | Invalid repeat mode!`, ephemeral: true });
        }
        const queue = client.distube.getQueue(interaction)
        mode = queue.setRepeatMode(mode);
        const modeText = mode ? (mode === 2 ? 'Repeat Queue' : 'Repeat Song') : 'Off';
        const sembed = new EmbedBuilder()
                .setColor('White')
                .setDescription(`<:emoji_28:1215417406433009694> | **Set Loop Mode To \`${modeText}\`**`);
        await interaction.reply({ embeds: [sembed], ephemeral: false });
    }
};
