const Discord = require("discord.js")
const getResponse = require('./getResponse');

module.exports = async (mode, bot, message, args) => {
    const BAN_MODE = 'ban';
    const KICK_MODE = 'kick';
    const HELP_COMMAND = 'help';

    if (mode !== BAN_MODE && mode !== KICK_MODE) {
        console.error(NO_MODE_PROVIDED);
        throw new Error(NO_MODE_PROVIDED);
    }
    
    if (args[0] === HELP_COMMAND) {
        message.reply(`Usage: p>${mode} <user> <reason>`);
        return;
    }

    // Lowercase version.
    const modeFragment = mode + (mode === BAN_MODE ? 'n' : '');
    // Uppercase version.
    const formalModeFragment = modeFragment[0].toUpperCase() + modeFragment.substring(1);
    
    const NO_MODE_PROVIDED = `removeMember(mode) requires 'mode' to be ${BAN_MODE} or ${KICK_MODE}. mode = ${mode}.`
    const NO_USER_PROVIDED = `Please mention a user or provide the user's id!`;
    const NO_REASON_PROVIDED = `No reason provided.`;
    const INAPPROPRIATE_PERMISSIONS = `Aww, sorry! You're not cool enough to do that!`;
    const UNREMOVABLE_USER = `That person cannot be ${modeFragment}ed, dude!`
    const INVALID_CONFIRMATION = `\:no_entry_sign: That is an invalid response. Please try again.`
    const FAILED_DM = `\:exclamation: Failed to DM user after being ${modeFragment}ed!`;

    const mentionedMember = message.mentions.members.first() || message.guild.member(args[0]);
    if (!mentionedMember)
        return message.channel.send(NO_USER_PROVIDED);

    let removalReason = args.slice(1).join(" ").trim();
    if (!removalReason.length) removalReason = NO_REASON_PROVIDED;

    if (!message.member.hasPermission(`${mode.toUpperCase()}_MEMBERS`))
        return message.channel.send(INAPPROPRIATE_PERMISSIONS);
    if (mentionedMember.hasPermission("MANAGE_MESSAGES") || !mentionedMember[`${modeFragment}able`])
        return message.channel.send(UNREMOVABLE_USER);

    const removalEmbed = new Discord.RichEmbed()
          .setDescription(`~${formalModeFragment.substring(0,3)}~`)
          .setColor(mode === BAN_MODE ? '#bc0000' : '#e56b00')
          .addField(`${formalModeFragment}ed User`, `${mentionedMember} with ID ${mentionedMember.id}`)
          .addField(`${formalModeFragment}ed By`, `<@${message.author.id}> with ID ${message.author.id}`)
          .addField(`${formalModeFragment}ed In`, message.channel)
          .addField(`Time`, message.createdAt)
          .addField(`Reason`, removalReason);

    const confirmationReceipt = `\:exclamation: You are ${modeFragment}ing **${mentionedMember.user.tag}** from **${message.guild.name}**\n\`\`\`${formalModeFragment} Reason:\n\n${removalReason}\`\`\`\n \:arrow_right: Please type \`confirm\` or type \`cancel\` `;
    const sentMessage = await message.channel.send(confirmationReceipt);
    const userResponse = await getResponse(message.channel, message.author, ['confirm', 'cancel'], INVALID_CONFIRMATION).catch(console.log);
    
    console.log(userResponse);
    sentMessage.delete();
    
    if (!userResponse || userResponse === 'cancel') {
        message.channel.send(`\:information_source: **${mentionedMember.user.tag}** was not ${modeFragment}ed!`)
    } else {
        mentionedMember.user
            .send(`\:exclamation: You were ${modeFragment}ed from our server. \n\n\`\`\`Reason:\n\n${removalReason}\`\`\`\n\n*This message is an automated notification.*`)
            .then(_ => {
                mentionedMember[mode](removalReason)
                    .then(_ => {
                        message.channel.send(removalEmbed);
                        message.channel.send(`\:exclamation: User **${mentionedMember.user.tag}** was successfully ${modeFragment}ed from ${message.guild.name}!`);
                    }, removalError => {
                        message.channel.send(`\:warning: Failed to ${mode} **${mentionedMember.user.tag}**!`)
                        throw new Error(removalError);
                    });
            }, dmError => {
                message.channel.send(FAILED_DM);
                throw new Error(dmError);
            });
    }
}
