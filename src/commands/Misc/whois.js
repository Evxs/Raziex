const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription(`🔍 | Get User Information`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription(`Select A User`)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('id')
            .setDescription(`Enter User ID`)
            .setRequired(false)
        ),
    async execute(interaction) {
        const { client, options, member } = interaction;
        const userOption = interaction.options.getUser('user');
        const idOption = interaction.options.getString('id');
        const guild = interaction.guild;

        let user;
        if (userOption) {
            user = userOption;
        } else if (idOption) {
            const userById = await client.users.fetch(idOption);
            if (userById) {
                user = userById;
            } else {
                await interaction.reply('This User Could Not Be Found, Maybe try Again?');
                return;
            }
        } else {
            user = member.user;
        }

        const embed = new EmbedBuilder()
            .setColor('#301934')
            .setTimestamp()
            .setTitle(`User Information for ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: 'Username', value: user.username, inline: false },
                { name: 'Display Name', value: user.displayName, inline: false },
                { name: 'Account Creation Date', value: user.createdAt.toDateString(), inline: false }
            );

        if (guild) {
            const memberData = guild.members.cache.get(user.id);
            if (memberData) {
                embed.addFields({ name: 'Joined Server', value: memberData.joinedAt.toDateString(), inline: false});

                if (interaction.user.id === member.user.id) {
                    const roleButton = new ButtonBuilder()
                        .setLabel('View Roles')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('view_roles');

                    const row = new ActionRowBuilder().addComponents(roleButton);

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: false,
                        components: [row]
                    });

                    client.on('interactionCreate', async (buttonInteraction) => {
                        if (!buttonInteraction.isButton() || buttonInteraction.user.id !== interaction.user.id) return;
                        if (buttonInteraction.customId === 'view_roles') {
                            await buttonInteraction.deferUpdate();
                            const rolesEmbed = new EmbedBuilder()
                                .setColor('#301934')
                                .setTitle(`Roles of ${user.tag}`)
                                .setTimestamp()
                                .setDescription(memberData.roles.cache.filter(r => r.id !== guild.id).map(r => r.toString()).join(' ') || 'This user has no roles in this server.');

                            await interaction.followUp({ embeds: [rolesEmbed], ephemeral: true });
                        }
                    });
                } else {
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: false
                    });
                }
            }
        } else {
            await interaction.reply({
                embeds: [embed],
                ephemeral: false
            });
        }
    },
};
