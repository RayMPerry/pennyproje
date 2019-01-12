const Discord = require('discord.js');
const request = require('request');
const jsdom = require('jsdom');

const run = async (bot, message, args) => {
    const HELP_COMMAND = 'help';

    const USAGE_RESPONSE = 'Usage: p>wiki <keywords>';
    const NO_KEYWORDS = 'Sorry! I can\'t read your mind!';
    const NO_PAGE_FOUND = `Sorry! I couldn't find a page for '${args.join(' ')}'`;
    
    if (args[0] === HELP_COMMAND) {
        message.reply(USAGE_RESPONSE);
        return;
    }

    if (args.length < 1 || !args[0].length) {
        message.reply(NO_KEYWORDS);
        return;
    }

    const keywords = args
          .map(argument => encodeURIComponent(argument.trim()))
          .join('%20');

    console.log(`Attempting to search for: ${keywords.replace('%20', ' ')}...`);
    request(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${keywords}`, (error, response, body) => {
        if (response && response.statusCode && !error) {
            const queryResults = JSON.parse(body);
            const pageTitle = (queryResults.query.search || [{ title: '' }])[0].title;
            if (!pageTitle || !pageTitle.length) return message.channel.send(NO_PAGE_FOUND);
            request(`https://en.wikipedia.org/w/api.php?action=mobileview&page=${pageTitle}&sections=0&prop=text&format=json`, (error, response, body) => {
                if (response && response.statusCode && !error) {
                    const wikiPage = JSON.parse(body)
                          .mobileview
                          .sections[0]
                          .text
                          .replace(/<[^>]+>|(\[\d*\])/g, ' ')
                          .split(' ')
                          .map(textFragment => decodeURIComponent(textFragment.trim()))
                          .join(' ')
                          .replace(/\ ([\ ]*)/g, (match, p1) => match.replace(p1, ''));

                    const wikiEmbed = new Discord.RichEmbed()
                          .setTitle('**Wikipedia Search**')
                          .addField(`${pageTitle}`, wikiPage.substring(0, 1023))
                          .addField('__Full Page__', `https://en.wikipedia.org/wiki/${pageTitle.replace(' ', '_')}`)
                          .setFooter('Wikipedia Search v0.5');

                    return message.channel.send(wikiEmbed);
                }
            });
        } else {
            return message.channel.send(NO_PAGE_FOUND);
        }
    });
};

module.exports = {
    run: run,
    help: {
        name: 'wiki'
    }
};


