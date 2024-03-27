// queueEndEvent.js

module.exports = {
    name: 'queueEnd',
    execute(player) {
      player.on('queueEnd', () => {
        player.disconnect();
      });
    }
  };
  