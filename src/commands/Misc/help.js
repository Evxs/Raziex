const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, PermissionsBitField, ComponentType, StringSelectMenuOptionBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ Feeling A Little Lost?'),
    async execute (interaction, client) {
        const { options } = interaction;
                const icon = "https://cdn.discordapp.com/attachments/1205662250158006343/1221682980125413436/standard.gif?ex=661377f0&is=660102f0&hm=bb95425cea57b5f402214971ed8bc0fc149594ae65e90f866589a7fb9b77833a&";
        
                const startEmbed = new EmbedBuilder()
                .setTitle(`❓ Help Menu`)
                .setDescription('**Total Commands:** 20')
                .setThumbnail(icon)
                .setTimestamp()
                .setColor('#301934')

        
                const embed = new EmbedBuilder()
                .setTitle("AI Commands")
                .setColor('#301934')
                .setDescription('**Command Count:** 3')
                .setThumbnail(icon)
                .setTimestamp()
                .addFields({ name: "`🤖` ask-ai", value: `</ask-ai:1212535946592133120>`, inline: true})
                .addFields({ name: "`🤖` imagine", value: `</imagine:1221256146141052949>`, inline: true})
                .addFields({ name: "`🤖` toggle-chatbot", value: `</toggle-chatbot:1221277045427015690>`, inline: true})

                
                const embed2 = new EmbedBuilder()
                .setTitle("Owner Commands")
                .setDescription('**Command Count:** 1')
                .setThumbnail(icon)
                .setTimestamp()
                .setColor('#301934')
                .addFields({ name: "`👑` restart", value: `</restart:1212885610017193984>`, inline: true})

        
                const embed3 = new EmbedBuilder()
                .setTitle("Utility Commands")
                .setDescription('**Command Count:** 9')
                .setThumbnail(icon)
                .setTimestamp()
                .addFields({ name: "`🛠` help", value: `</help:>`, inline: true})
                .addFields({ name: "`🛠` invite", value: `</invite:>`, inline: true})
                .addFields({ name: "`🛠` ping", value: `</ping:>`, inline: true})
                .addFields({ name: "`🛠` avatar", value: `</avatar:1212522072291672275>`, inline: true})
                .addFields({ name: "`🛠` support", value: `</support:1212880847552647248>`, inline: true})
                .addFields({ name: "`🛠` whois", value: `</whois:1221277045427015695>`, inline: true})
                .addFields({ name: "`🛠` serverinfo", value: `</serverinfo:1212919628955787345>`, inline: true})
                .addFields({ name: "`🛠` purge", value: `</purge:1212932247603122267>`, inline: true})
                .addFields({ name: "`🛠` suggest", value: `</suggest:1221277045427015694>`, inline: true})
                .setColor('#301934')
                


                const embed4 = new EmbedBuilder()
                .setTitle("Fun Commands")
                .setColor('#301934')
                .setDescription('**Command Count:** 3')
                .setThumbnail(icon)
                .setTimestamp()
                .addFields({ name: "`🌌` howgay", value: `</howgay:1221277045427015692>`, inline: true})
                .addFields({ name: "`🌌` 8ball", value: `</8ball:1221277045427015691>`, inline: true})
                .addFields({ name: "`🌌` weather", value: `</weather:1221277045427015693>`, inline: true})



                const embed5 = new EmbedBuilder()
                .setTitle("Music Commands")
                .setColor('#301934')
                .setDescription('**Command Count:** 6')
                .setThumbnail(icon)
                .setTimestamp()
                .addFields({ name: "`🎵` play", value: `</play:1221277045427015697>`, inline: true})
                .addFields({ name: "`🎵` skip", value: `</skip:1221277045427015698>`, inline: true})
                .addFields({ name: "`🎵` stop", value: `</stop:1221277045427015699>`, inline: true})
                .addFields({ name: "`🎵` join", value: `</join:1221277045427015696>`, inline: true})
                .addFields({ name: "`🎵` volume", value: `</volume:1221277045632274472>`, inline: true})
                .addFields({ name: "`🎵` loop", value: `</loop:1222345697043550252>`, inline: true})
                 


               








                const select = new StringSelectMenuBuilder()
                .setCustomId("guild")
                .setPlaceholder("Select A Category")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                    .setLabel("AI Commands")
                    .setEmoji('🤖')
                    .setDescription(`Shows All AI Commands`)
                    .setValue("basic-info"),

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Music Commands")
                    .setEmoji('🎵')
                    .setDescription(`Shows All Music Commands`)
                    .setValue("msc"),

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Owner Commands")
                    .setEmoji('👑')
                    .setDescription(`Shows All Owner Commands`)
                    .setValue("invite-link"),

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Fun Commands")
                    .setEmoji('🌌')
                    .setDescription(`Shows All Fun Commands`)
                    .setValue("fun-cmds"),

                    new StringSelectMenuOptionBuilder()
                    .setLabel("Utility Commands")
                    .setEmoji('🛠')
                    .setDescription(`Shows All Utility Commands`)
                    .setValue("support-server"),
                )
        
                    const row = new ActionRowBuilder().addComponents(select)
        
                    const msg = await interaction.reply({
                        embeds: [startEmbed],
                        components: [row]
                    })
        
                    const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect });
        			collector.on('collect', async (i) => {
            			if (i.customId === 'guild' && i.user.id === interaction.user.id) {
                			const selectedValue = i.values[0];

                			let responseEmbed;

                			switch (selectedValue) {
                                case 'fun-cmds':
                        			responseEmbed = embed4;
                        		break;
                    			case 'basic-info':
                        			responseEmbed = embed;
                        		break;
                                case 'msc':
                        			responseEmbed = embed5;
                        		break;
                    			case 'invite-link':
                        			responseEmbed = embed2;
                        		break;
                    			case 'support-server':
                       				responseEmbed = embed3;
                        		break;
                    			default:
                        			responseEmbed = startEmbed;
                        		break;
                		}

                await i.update({ embeds: [responseEmbed], components: [row] });
            } else {
                await i.reply({ content: 'You Cannot Use This Select Menu.', ephemeral: true });
            }
        });
    }
}