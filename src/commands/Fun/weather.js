


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Shows weather information')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('The city to get weather information for')
                .setRequired(true)),

    async execute(interaction) {
        const city = interaction.options.getString('city');

        weather.find({ search: city, degreeType: 'C' }, function(err, result) {
            if (err || typeof result !== 'object' || !result.length) {
                const errorembed = new EmbedBuilder()
                    .setDescription("**Please enter a valid location!**")
                    .setColor('#301934')
                    .setTimestamp();
                return interaction.reply({ embeds: [errorembed], ephemeral: true });
            }

            const current = result[0].current;
            const location = result[0].location;

            const embed = new EmbedBuilder()
                .setDescription(`**${current.skytext}**`)
                .setAuthor({ name: `Weather for ${current.observationpoint}`})
                .setThumbnail(current.imageUrl)
                .setColor('#301934')
                .addFields(
                    { name: 'Timezone', value: `UTC${location.timezone}`, inline: true },
                    { name: 'Degree Type', value: location.degreetype, inline: true },
                    { name: 'Temperature', value: `${current.temperature} Degrees`, inline: true },
                    { name: 'Feels Like', value: `${current.feelslike} Degrees`, inline: true },
                    { name: 'Winds', value: current.winddisplay, inline: true },
                    { name: 'Humidity', value: `${current.humidity}%`, inline: true }
                )
                .setTimestamp();
                
            interaction.reply({ embeds: [embed], ephemeral: false });
        });
    },
};
