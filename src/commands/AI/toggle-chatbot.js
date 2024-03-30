const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-chatbot')
        .setDescription('Toggle The Chatbot For The Current Channel'),
    async execute(interaction) {
      
        const filePath = 'cbt_cn.txt';
     
        const channelId = interaction.channelId;

     
        if (fs.existsSync(filePath)) {
         
            const content = fs.readFileSync(filePath, 'utf-8');
          
            const channelIds = content.split('\n');
            if (channelIds.includes(channelId)) {
              
                const updatedChannelIds = channelIds.filter(id => id !== channelId);
                fs.writeFileSync(filePath, updatedChannelIds.join('\n'));
               
                const disableEmbed = new EmbedBuilder()
                    .setColor('#301934')
                    .setTitle('Chatbot Disabled')
                    .setDescription(`**Channel:** <#${interaction.channelId}>`)
                await interaction.reply({ embeds: [disableEmbed], ephemeral: true });
            } else {
              
                fs.appendFileSync(filePath, `\n${channelId}`);
             
                const enableEmbed = new EmbedBuilder()
                    .setColor('#301934')
                    .setTitle('Chatbot Enabled')
                    .setDescription(`**Channel:** <#${interaction.channelId}>`)
                await interaction.reply({ embeds: [enableEmbed], ephemeral: true });
            }
        } else {
          
            fs.writeFileSync(filePath, channelId);
          
            const enableEmbed = new EmbedBuilder()
                .setColor('#301934')
                .setTitle('Chatbot Enabled')
                .setDescription(`**Channel:** <#${interaction.channelId}>`)
            await interaction.reply({ embeds: [enableEmbed], ephemeral: true });
        }
    },
};
