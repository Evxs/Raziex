require('dotenv').config(); 
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
function getChoiceName(value) {
    const choicesMap = {
        'gemini-pro': '🔰 Gemini',
        'dolphine-mixtral': '🐬 Dolphine',
        'mistral-tiny': '💢 Mistral Tiny',
        'mistral-small': '💢 Mistral Small',
        'mistral-medium': '💢 Mistral Medium',
        'mistral-large': '💢 Mistral Large',
        'gpt-3.5-turbo': '🤖 ChatGPT 3.5 T',
        'gpt-3.5-turbo-16k': '🤖 ChatGPT 3.5 16K',
        'gpt-4': '🤖 ChatGPT 4',
        'claude-3-opus': '💥 Claude 3 Opus',
        'claude-2': '💥 Claude 2',
        'claude': '💥 Claude',
        'gemini-1.5-pro': '🔰 Gemini 1.5 Pro',

    };
    return choicesMap[value] || value;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask-ai')
        .setDescription('🤖 | Ask the AI anything.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('💬 | Ask Your Question Here.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('⚙️ | What Model Should I Use?')
                .addChoices(
                    { name: '🔰 Gemini 1.5 Pro', value: 'gemini-1.5-pro'},               
                    { name: '🔰 Gemini', value: 'gemini-pro' },
                    { name: '🐬 Dolphine', value: 'dolphine-mixtral'},
                    { name: '💢 Mistral Tiny', value: 'mistral-tiny' },
                    { name: '💢 Mistral Small', value: 'mistral-small' },
                    { name: '💢 Mistral Medium', value: 'mistral-medium' },
                    { name: '💢 Mistral Large', value: 'mistral-large' },
                    { name: '🤖 ChatGPT 3.5 T', value: 'gpt-3.5-turbo' },
                    { name: '🤖 ChatGPT 3.5 16K', value: 'gpt-3.5-turbo-16k' },
                    { name: '🤖 ChatGPT 4', value: 'gpt-4'},
                    { name: '💥 Claude', value: 'claude'},
                    { name: '💥 Claude 2', value: 'claude-2'},
                    { name: '💥 Claude 3 Opus', value: 'claude-3-opus'},                  
                )
                .setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        const modelValue = interaction.options.getString('model');
        const modelName = getChoiceName(modelValue);
        const api_key = process.env.API_KEY;
        const url = process.env.API_URL; 
        const data = {
            model: modelValue,
            messages: [{ role: 'user', content: prompt }],
            stream: false
        };
        const headers = {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json'
        };
        try {
            const embed = new EmbedBuilder()
                .setDescription("**<a:emoji_29:1216239344914927637> | Generating Your AI Response...**")
                .setColor('White')
            await interaction.reply({ embeds: [embed] });
            const response = await axios.post(url, data, { headers });
            const responseData = response.data.choices[0].message.content;
            const finalEmbed = new EmbedBuilder()
                .setDescription(`**<:model:1209413094204375090> Model:** ${modelName}\n<:prmpt:1209413110444589106> **Prompt:** \`\`\`${prompt}\`\`\`\n<:output:1207978464963985438> **Response:**\n${responseData}`)
                .setColor('White')
            await interaction.editReply({ embeds: [finalEmbed] });
        } catch (error) {
            console.error('Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:emoji_27:1215417390880268390> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('White')
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};