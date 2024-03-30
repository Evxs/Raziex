const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[X] Logging In... [X]`);
        console.log(`[X] Logged In As: ${client.user.username} [X]`);
        
        // Initial presence setup
        updatePresence(client);

        // Set interval to update presence every 7 seconds
        setInterval(() => {
            updatePresence(client);
        }, 7000);
    },
};

// Function to update presence
function updatePresence(client) {
    const serverCount = client.guilds.cache.size;
    let totalCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const statuses = [
        { name: `${serverCount} Servers!`, type: ActivityType.Watching },
        { name: `${totalCount} Members!`, type: ActivityType.Watching },
        { name: `/help`, type: ActivityType.Playing },
        { name: `/play`, type: ActivityType.Listening },
    ];

    // Randomly select a status from the array
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const selectedStatus = statuses[randomIndex];

    client.user.setPresence({
        activities: [selectedStatus],
        status: 'idle',
    });
}
