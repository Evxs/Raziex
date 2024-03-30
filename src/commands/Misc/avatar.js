const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(`👤 | Get A Users Avatar`)
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
            user = member;
        }

        const userAvatar = user.displayAvatarURL({ size: 512 });

        const embed = new EmbedBuilder()
            .setColor('#301934')
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(userAvatar)
            .setTimestamp();

        const button = new ButtonBuilder()
            .setLabel('Download')
            .setStyle(ButtonStyle.Link)
            .setEmoji({ id: '1207978441949843496' })
            .setURL(user.avatarURL({ size: 512 }));
            

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            ephemeral: false, 
            components: [row],
        });
    },
};