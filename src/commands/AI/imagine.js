const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const IAPI_URL = process.env.IAPI_URL;
const API_KEY = process.env.API_KEY;




function getChoiceName(value) {
    const choicesMap = {
        'dall-e-3': '🤖 Dall E 3',
        'sdxl': '🔰 Sdxl',
        'sdxl-turbo': '🔰 Sdxl Turbo',
        'absolute-reality-v1.8.1': '🚀 Absolute Reality',


    };
    return choicesMap[value] || value;
}









module.exports = {
    data: new SlashCommandBuilder()
        .setName('imagine')
        .setDescription('🤖 | Create Images Using AI')
        .addStringOption(option => option
            .setName('prompt')
            .setDescription('💬 | Describe Your Image')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('model')
            .setDescription('⚙️ | What Model Should I Use?')
            .setRequired(true)
            .addChoices(
                { name: '🤖 Dall E 3', value: 'dall-e-3'},
                { name: '🔰 Sdxl', value: 'sdxl'},
                { name: '🔰 Sdxl Turbo', value: 'sdxl-turbo'},
                { name: '🚀 Absolute Reality', value: 'absolute-reality-v1.8.1'},


            )
        ),
        
        async execute(interaction) {
        await interaction.deferReply();
        const start_time = Date.now();
        const prompt = interaction.options.getString('prompt');
        const model = interaction.options.getString('model');
        const modelName = getChoiceName(model);
        const url = process.env.IAPI_URL;
        const api_key = process.env.API_KEY;
        const headers = {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json'
          };
      
        const data = {
            "prompt": prompt,
            "model": model,
            "response_format": 'url'
  
          };
        try {
            const response = await axios.post(url, data, { headers });
            


            if (response.status === 200) {
                const end_time = Date.now();
                const elapsed_time = (end_time - start_time) / 1000;
                const image_url = response.data.data[0].url;

                if (image_url && image_url.startsWith('https')) {
                    const image_response = await axios.get(image_url, { responseType: 'arraybuffer' });
                    const image_data = Buffer.from(image_response.data, 'binary');
                    
                    const embed = new EmbedBuilder()
                        .setDescription(`<:model:1209413094204375090> **Model:** ${modelName}\n<:style:1210396184242298931> **Prompt:**\n\`\`\`${prompt}\`\`\``)
                        .setColor('White')
                        .setTimestamp()
                        .setFooter({ text: `⌛ Time: ${elapsed_time}s` })
                        .setImage('attachment://image.png');

                    await interaction.followUp({ embeds: [embed], files: [image_data] });
                } else {
                    const errorEmbed = new EmbedBuilder()
                .setDescription('<:emoji_27:1215417390880268390> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('White')
                    await interaction.followUp({ embeds: [errorEmbed] });
                }
            } else {
                const errorEmbed = new EmbedBuilder()
                .setDescription('<:emoji_27:1215417390880268390> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('White')
                console.log(axios.HttpStatusCode)
                await interaction.followUp({ embeds: [errorEmbed] });
            }
        } catch (error) {
            console.error('Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:emoji_27:1215417390880268390> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('White')
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    },
};