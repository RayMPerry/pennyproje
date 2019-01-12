const removeMember = require('./removeMember');

module.exports.run = async (bot, message, args) => removeMember('ban', bot, message, args);

exports.help = {
    name: 'ban'
}
