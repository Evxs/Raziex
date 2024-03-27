const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(`🔗 | Gets The Bots Invite Link`),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`🔗 | Bot Invite`)
            .setDescription(`**Invite Me To Your Server Using The Links Below**`)
            .setTimestamp();
    




        const button2 = new ButtonBuilder()
            .setLabel('Non Admin')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/oauth2/authorize?client_id=1205684566292041800&permissions=10982197165175&scope=bot+applications.commands');

        const button = new ButtonBuilder()
            .setLabel('Admin')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/oauth2/authorize?client_id=1205684566292041800&permissions=8&scope=bot+applications.commands');

        const row = new ActionRowBuilder().addComponents(button, button2);
        await interaction.reply({
            embeds: [embed],
            ephemeral: false,
            components: [row], 
        });
    },
};