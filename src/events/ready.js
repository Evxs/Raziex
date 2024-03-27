const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Logging In...`);
        console.log(`✅ ${client.user.username} is online!`);
        updatePresence(client);
        setInterval(() => {
            updatePresence(client);
        }, 7000);
    },
};
function updatePresence(client) {
    const serverCount = client.guilds.cache.size;
    const statuses = [
        { name: `${serverCount} Servers!`, type: ActivityType.Watching },
        { name: `/help`, type: ActivityType.Playing },
        { name: `/play`, type: ActivityType.Listening },
    ];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const selectedStatus = statuses[randomIndex];
    client.user.setPresence({
        activities: [selectedStatus],
        status: 'idle',
    });
}
