const { SlashCommandBuilder, EmbedBuilder, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('🗑️ | Purge Messages')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Enter the number of messages to purge')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, options } = interaction;

        // Check if the user has the 'MANAGE_MESSAGES' permission
        if (!member.permissions.has('MANAGE_MESSAGES')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('White')
                .setDescription('You do not have permission to use this command.');

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        // Retrieve the amount of messages to purge from the options
        const amount = options.getInteger('amount');

        // Fetch messages to delete
        const messages = await interaction.channel.messages.fetch({ limit: amount });

        // Delete the messages
        const deletedMessagesCount = messages.size;
        await interaction.channel.bulkDelete(messages);

        // Construct an embed to display the total number of deleted messages
        const deletedEmbed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Purged Messages')
            .setTimestamp()
            .setDescription(`Total Messages Deleted: ${deletedMessagesCount}`);
        
        await interaction.reply({ embeds: [deletedEmbed], ephemeral: true });
    },
};


