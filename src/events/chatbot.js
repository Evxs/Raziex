const axios = require('axios');
const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const api_key = process.env.API_KEY
const url = process.env.API_URL

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        try {
            if (message.author.bot || message.author.id === message.client.user.id) {
                return;
            } 
            const chatbotChannels = fs.readFileSync('cbt_cn.txt', 'utf-8').split('\n');
            const currentChannelId = message.channel.id;         
            if (!chatbotChannels.includes(currentChannelId)) {
                return;
            }           
            let prompt = message.content;
            if (prompt.toLowerCase().includes('swipe')) {
                prompt = prompt.replace(/swipe/gi, '');
            } else {
                return;
            }                       
            const data = {
                'model': '', 
                'messages': [
                    {'role': 'system', 'name': 'instructions', 'content': ``},
                    {'role': 'user', 'content': prompt}
                ],
                'stream': false
            };
            const headers = {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            };
            message.channel.sendTyping();
            console.log(`User: ${message.author.id} // Prompt: ${prompt}`)
            const response = await axios.post(url, data, { headers });
            if (!response.data.choices || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
                throw new Error('No choices found in response');
            }
            const firstResponseContent = response.data.choices[0].message.content;
            const embed = new EmbedBuilder()
                .setColor('White')
                .setFooter({ text: 'Powered By Shard AI | © Swipe 2024 - 2024', iconURL: 'https://cdn.discordapp.com/attachments/1167267080861667418/1222011257037525123/ico.png?ex=6614a9ab&is=660234ab&hm=a5ecb21c6091f6796e1afc1bd2e428127a461a48312dda59120a3bdd69124b22&' })
                .setDescription(`${firstResponseContent}`); 
            await message.reply({ embeds: [embed], ephemeral: false });
            response.data.choices.slice(1).forEach(choice => {
                const subsequentContent = choice.message.content;
                const embed = new EmbedBuilder()
                .setColor('White')
                .setFooter({ text: 'Powered By Shard AI', iconURL: 'https://cdn.discordapp.com/attachments/1167267080861667418/1222011257037525123/ico.png?ex=6614a9ab&is=660234ab&hm=a5ecb21c6091f6796e1afc1bd2e428127a461a48312dda59120a3bdd69124b22&' })
                .setDescription(`${subsequentContent}`);
                message.channel.send({ embeds: [embed], ephemeral: false }); 
            }); 
        } catch (error) {
            console.log('Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:emoji_27:1215417390880268390> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('White')
            message.channel.send({ embeds: [errorEmbed] });
        }
    }
};
