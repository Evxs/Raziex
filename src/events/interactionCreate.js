const { Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return     
        try{
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('White')
                .setTitle('Uh Oh!')
                .setThumbnail()
                .setDescription('An Unexpected Error Has Occured!');
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } 
    },
};