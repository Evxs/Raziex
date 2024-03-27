const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('💭 | Make A Suggestion For Features On Me!')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Suggest A Command, Event, Etc..')
                .setRequired(true)),
    async execute(interaction) {
        // Get the suggestion from the user
        const suggestion = interaction.options.getString('suggestion');

        // Create confirmation embed
        const confirmationEmbed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Suggestion Received')
            .setDescription(`Your suggestion "${suggestion}" has been noted!`);

        // Send confirmation embed as an ephemeral message
        await interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });

        // Your suggestion channel ID
        const suggestionChannelId = '1213157615119630387';

        // Fetch the channel
        const suggestionChannel = interaction.client.channels.cache.get(suggestionChannelId);

        // Create up and down arrow emojis
        const upArrowEmoji = interaction.client.emojis.cache.find(emoji => emoji.name === 'up_arrow');
        const downArrowEmoji = interaction.client.emojis.cache.find(emoji => emoji.name === 'down_arrow');

        // Create suggestion embed
        const suggestionEmbed = new EmbedBuilder()
            .setColor('White')
            .setTitle('New Suggestion')
            .setDescription(suggestion)
            .setAuthor({ name: `Requested By: ${interaction.user.tag}`, text: `Requested By: ${interaction.user.tag}`})
            .setFooter({ text: `Yes: ⬆ No: ⬇`});

        // Send the embed to the suggestion channel
        const suggestionMessage = await suggestionChannel.send({ embeds: [suggestionEmbed] });

        // Add reaction buttons to the suggestion message
        await suggestionMessage.react('⬆');
        await suggestionMessage.react('⬇');
    },
};
