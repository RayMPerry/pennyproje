const removeMember = require('./removeMember');

module.exports.run = async (bot, message, args) => removeMember('kick', bot, message, args);

exports.help = {
    name: 'kick'
}
