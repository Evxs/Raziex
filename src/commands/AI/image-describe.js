const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image-describe')
        .setDescription('🤖 | Describe An Image Using AI')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('🖼 | Add An Image')
                .setRequired(true)),
    async execute(interaction) {
        const start_time = Date.now();
        const embed = new EmbedBuilder()
                .setImage('https://cdn.discordapp.com/attachments/1213991566692319263/1223530313049964585/standard.gif?ex=661a3066&is=6607bb66&hm=a82f66314df75e0f0ed95dab3d4913e2c810a0e89f7c97c8b1f3714fccfa6b4b&')
                .setDescription("**Generating Your AI Response... Please Wait 2-30 Seconds.**")
                .setColor('#301934')
        await interaction.reply({ embeds: [embed] }); 

        const image = interaction.options.getAttachment('image');
        if (!image || !image.url) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:error:1223523541987885117> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('#301934')
            return await interaction.editReply({ emebds: [errorEmbed]});
            
        }

        data = {
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Describe this image"
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: image.url
                    }
                  }
                ]
              }
            ],
          }

        try {
            const response = await axios.post(process.env.API_URL, data, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                }
            });

            const description = response.data.choices[0].message.content;
            const end_time = Date.now();
            const elapsed_time = (end_time - start_time) / 1000;
            const embed = new EmbedBuilder()
                    .setDescription(description)
                    .setColor('#301934')
                    .setImage(image.url)
                    .setFooter({ text: `⌛ | Time: ${elapsed_time}` });
            await interaction.editReply({content: "", embeds : [embed]});
        } catch (error) {
            console.error('Failed to get image description:', error.code);
            const errorEmbed = new EmbedBuilder()
                .setDescription('<:error:1223523541987885117> | **Uh Uh, An Error Has Occured, Believe This Was A Mistake? Join The [Support Server](https://discord.gg/3enpEZNP5s)**')
                .setColor('#301934')
            return await interaction.editReply({ embeds: [errorEmbed]});
        }
    }
};