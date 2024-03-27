const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('ℹ️ | Get Server Information'),
    async execute(interaction) {
        const { guild, user } = interaction;
        if (!guild) {
            await interaction.reply('This command must be used in a server.');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTimestamp()
            .setTitle(`Server Information for ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: 'Server Name', value: guild.name.toString(), inline: true },
                { name: 'Server ID', value: guild.id.toString(), inline: true },
                { name: 'Member Count', value: guild.members.cache.filter(member => !member.user.bot).size.toString(), inline: true },
                { name: 'Bot Count', value: guild.members.cache.filter(member => member.user.bot).size.toString(), inline: true },
                { name: 'Channel Count', value: guild.channels.cache.size.toString(), inline: true },
                { name: 'Category Count', value: guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size.toString(), inline: true },
                { name: 'Boost Count', value: (guild.premiumSubscriptionCount || 0).toString(), inline: true }
            );

        const row = new ActionRowBuilder();
        if (user.id === interaction.user.id) {
            const roleButton = new ButtonBuilder()
                .setLabel('Server Roles')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('server_roles');

            row.addComponents(roleButton);
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: false,
            components: [row]
        });

        const client = interaction.client;
        client.on('interactionCreate', async (buttonInteraction) => {
            if (!buttonInteraction.isButton() || buttonInteraction.user.id !== interaction.user.id) return;
            if (buttonInteraction.customId === 'server_roles') {
                const roles = guild.roles.cache.filter(role => role.name !== '@everyone').map(role => role.toString()).join(', ');
                const rolesEmbed = new EmbedBuilder()
                    .setColor('White')
                    .setTitle('Server Roles')
                    .setTimestamp()
                    .setDescription(roles || 'There are no roles in this server.');

                await buttonInteraction.reply({ embeds: [rolesEmbed], ephemeral: true });
            }
        });
    },
};
