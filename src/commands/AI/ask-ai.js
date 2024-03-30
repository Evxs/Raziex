const fs = require('fs');
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
                    { name: '🔰 Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
                    { name: '🔰 Gemini', value: 'gemini-pro' },
                    { name: '🐬 Dolphine', value: 'dolphine-mixtral' },
                    { name: '💢 Mistral Tiny', value: 'mistral-tiny' },
                    { name: '💢 Mistral Small', value: 'mistral-small' },
                    { name: '💢 Mistral Medium', value: 'mistral-medium' },
                    { name: '💢 Mistral Large', value: 'mistral-large' },
                    { name: '🤖 ChatGPT 3.5 T', value: 'gpt-3.5-turbo' },
                    { name: '🤖 ChatGPT 3.5 16K', value: 'gpt-3.5-turbo-16k' },
                    { name: '🤖 ChatGPT 4', value: 'gpt-4' },
                    { name: '💥 Claude', value: 'claude' },
                    { name: '💥 Claude 2', value: 'claude-2' },
                    { name: '💥 Claude 3 Opus', value: 'claude-3-opus' },
                )
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user.id;
        const blacklistedUsers = JSON.parse(fs.readFileSync('./blacklisted.json'));
        if (blacklistedUsers.includes(user)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:error:1223523541987885117> | **You Are Blacklisted And Cannot Use This Command, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('#301934');
            return interaction.reply({ embeds: [errorEmbed] });
        }

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
                .setImage('https://cdn.discordapp.com/attachments/1213991566692319263/1223530313049964585/standard.gif?ex=661a3066&is=6607bb66&hm=a82f66314df75e0f0ed95dab3d4913e2c810a0e89f7c97c8b1f3714fccfa6b4b&')
                .setDescription("**Generating Your AI Response... Please Wait 2-30 Seconds.**")
                .setColor('#301934')
            await interaction.reply({ embeds: [embed] });
            const response = await axios.post(url, data, { headers });
            const responseData = response.data.choices[0].message.content;
            const finalEmbed = new EmbedBuilder()
                .setDescription(`**<:model:1223522747960004628> Model:** ${modelName}\n<:prmpt:1223522398389932042> **Prompt:** \`\`\`${prompt}\`\`\`\n<:output:1223527437284020244> **Response:**\n${responseData}`)
                .setColor('#301934')
            await interaction.editReply({ embeds: [finalEmbed] });
        } catch (error) {
            console.error('Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:error:1223523541987885117> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('#301934')
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
