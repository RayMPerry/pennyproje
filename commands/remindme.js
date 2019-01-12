const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    const INVALID_SYNTAX = `**Specify a time for me to remind you! Usage: \`>remindme 15min | Code**\``
    const NO_USER_PROVIDED = `Sorry! That user isn't part of the server anymore!`;
    const NO_OPERABLE_TIME = `Sorry! You have to specify the unit of time before the text!`;

    const DEFAULT_REMINDER_TEXT = `Here's your reminder!`;
    const DEFAULT_REMINDER_TIME = '10s';
    
    let fullReminder = args.join(' ').split('|');
    if (fullReminder.length < 2) {
        const newReminder = fullReminder.join(' ').split(' ');
        let newTime = [newReminder[0], newReminder[1]];
        const newConvertedTime = ms(newTime.join(' '));

        if (!newConvertedTime) newTime = newTime.slice(0,1);
        if (newTime.length < 2 && !Number.isNaN(Number(newTime[0]))) newTime[0] += 's'
        
        fullReminder[0] = newTime.join(' ');
        fullReminder[1] = newReminder.slice(newTime.length).join(' ');
    }
    
    fullReminder = fullReminder.map(stringFragment => {
        let _stringFragment = stringFragment.replace('<','');
        const foundMention = _stringFragment.indexOf("@");
        if (foundMention > -1) _stringFragment = _stringFragment.substring(0, foundMention);
        return _stringFragment.trim();
    });

    const reminderCreator = [message.author.id];
    if (!reminderCreator[0]) return message.channel.send(NO_USER_PROVIDED);
    if (!fullReminder[0].length) fullReminder[0] = DEFAULT_REMINDER_TIME;

    let reminderTime = fullReminder[0];
    const reminderText = fullReminder[1] || DEFAULT_REMINDER_TEXT;
    let convertedReminderTime = ms(reminderTime);
    if (!convertedReminderTime) {
        let hours, minutes;
        const reminderFragment = reminderTime.split(/h/i);
        console.log(reminderFragment);
        hours = Number(reminderFragment[0].trim());
        minutes = Number(reminderFragment[1].split(/m/i)[0].trim());
        if (!hours || !minutes) return message.channel.send(NO_OPERABLE_TIME);
        minutes += hours * 60;
        reminderTime = `${minutes}m`;
        console.log(`Hour+Minute format provided. Will attempt to remind in ${minutes} minutes.`);
        convertedReminderTime = ms(reminderTime);
    }

    if (!/\d+/.test(reminderTime) || !convertedReminderTime)
        return message.channel.send(NO_OPERABLE_TIME);
    
    let remindEmbed = new Discord.RichEmbed()
        .setColor("#15f153")
        .addField("Reminder", `${reminderText}`)
        .addField("Time", `\`${reminderTime}\``);

    const memberIdsToPing = reminderCreator
          .concat(message.mentions.members.map(member => member.id))
          .concat(message.mentions.roles.map(role => `&${role.id}`));
    
    message.channel.send(remindEmbed);

    const buildMessage = reminderText => {
        const baseMessage = ` Hey! You wanted me to remind you`;
        const messageBookend = reminderText.length ? `: ${reminderText}` : `!`;
        const membersToPing = memberIdsToPing.map(memberId => `<@${memberId}>`).join(' ');
        return `${membersToPing} ${baseMessage}${messageBookend}`;
    };

    setTimeout(_ => {
        return message.channel.send(buildMessage(reminderText));
    }, convertedReminderTime);
};

module.exports.help = {
    name: "remindme"
}
