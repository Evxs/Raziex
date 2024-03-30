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
            if (prompt.toLowerCase().includes('raziex')) {
                prompt = prompt.replace(/raziex/gi, '');
            } else {
                return;
            } 
            
            const user = message.author.id;
            const blacklistedUsers = JSON.parse(fs.readFileSync('./blacklisted.json'));
            if (blacklistedUsers.includes(user)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:error:1223523541987885117> | **You Are Blacklisted And Cannot Use This Chat Bot Due To Abuse, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('#301934');
            return;
            }





            const data = {
                'model': 'gpt-3.5-turbo', 
                'messages': [
                    {'role': 'system', 'name': 'instructions', 'content': `Your name is swipe, you are a helpful assistant to help anyone out, who is very chill and relaxed and asnwers all questions`},
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
                .setColor('#301934')
                .setFooter({ text: 'Powered By Shard AI | © Raziex 2024 - 2024', iconURL: 'https://cdn.discordapp.com/attachments/1167267080861667418/1222011257037525123/ico.png?ex=6614a9ab&is=660234ab&hm=a5ecb21c6091f6796e1afc1bd2e428127a461a48312dda59120a3bdd69124b22&' })
                .setDescription(`${firstResponseContent}`); 
            await message.reply({ embeds: [embed], ephemeral: false });
            response.data.choices.slice(1).forEach(choice => {
                const subsequentContent = choice.message.content;
                const embed = new EmbedBuilder()
                .setColor('#301934')
                .setFooter({ text: 'Powered By Shard AI', iconURL: 'https://cdn.discordapp.com/attachments/1167267080861667418/1222011257037525123/ico.png?ex=6614a9ab&is=660234ab&hm=a5ecb21c6091f6796e1afc1bd2e428127a461a48312dda59120a3bdd69124b22&' })
                .setDescription(`${subsequentContent}`);
                message.channel.send({ embeds: [embed], ephemeral: false }); 
            }); 
        } catch (error) {
            console.log('Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:error:1223523541987885117> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('#301934')
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
