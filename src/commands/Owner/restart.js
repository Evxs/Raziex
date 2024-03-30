const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

// Made By Xerous With ❤

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restart the bot'),

    async execute(interaction) {
        const allowedUserID = '1120856443659235498';
        if (interaction.user.id !== allowedUserID) {
            return await interaction.reply({
                content: 'You are not authorized to use this command.',
                ephemeral: true,
            });
        }

        const { MessageActionRow, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageEmbed } = require('discord.js');

        const confirmationEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🔄 Restart Confirmation')
            .setDescription('Are you sure you want to restart the bot? This action will temporarily disconnect the bot from Discord.')
            .setTimestamp();

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_restart')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Primary);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_restart')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

        await interaction.reply({
            embeds: [confirmationEmbed],
            components: [row],
            ephemeral: false,
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id !== allowedUserID) {
                await i.reply({
                    content: 'You are not authorized to interact with this button.',
                    ephemeral: true,
                });
                return;
            }

            if (i.customId === 'confirm_restart') {
                await interaction.editReply('Bot is restarting...');
                restartBot();
            } else if (i.customId === 'cancel_restart') {
                await interaction.editReply('Restart canceled.');
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply('You took too long to respond.');
            }
        });
    },
};

function restartBot() {
    process.exit(0);}


    