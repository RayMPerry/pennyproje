const Discord = require('discord.js');
const request = require('request');
const jsdom = require('jsdom');
const client = new Discord.Client();

const run = async (bot, message, args) => {
    const HELP_COMMAND = 'help';

    const USAGE_RESPONSE = 'Usage: p>img <keywords>';
    const NO_KEYWORDS = 'Sorry! I can\'t read your mind!';
    
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

    console.log(keywords);
    
    console.log(`Attempting to search for: ${keywords.replace('%20', ' ')}...`);

    // const buildImageMessage = (imageUrl, pageNumber, totalPages) => {
    //     console.log(imageUrl, pageNumber, totalPages);
    //     return new Discord.RichEmbed()
    //         .setTitle(`**Image Search**`)
    //         .setImage(`${imageUrl}`)
    //         .setFooter(`Page ${pageNumber}/${totalPages}`);
    // };
    
    // //`https://duckduckgo.com/?q=${keywords}&iax=images&ia=images`
    // request(`https://google.com/search?tbm=isch&q=${keywords}&tbs=imgo:1`, (error, response, body) => {
    //     if (response && response.statusCode && !error) {
    //         const dom = new jsdom.JSDOM(body);
    //         const allImageTags = dom.window.document.getElementsByTagName('img');
    //         const allImages = [];

    //         for (let index = 0; index < allImageTags.length; index++) {
    //             const imageSource = allImageTags[index].src;
    //             // const imageSize = allImageSizes[index].textContent
    //             //       .split('×')
    //             //       .map(sizeFragment => sizeFragment.trim());
    //             const imageSize = [0, 0];

    //             const newImage = {
    //                 width: imageSize[0],
    //                 height: imageSize[1],
    //                 src: imageSource
    //             };
                
    //             allImages.push(newImage);
    //         }
            
    //         let currentPage = 0;
    //         const imageEmbed = buildImageMessage(allImages[currentPage].src, (currentPage + 1), allImages.length);
            
    //         message.channel
    //             .send(imageEmbed)
    //             .then(async sentMessage => {
    //                 // Do not delete these spaces!
    //                 // Previous image
    //                 await sentMessage.react('◀');
    //                 // Cancel search
    //                 await sentMessage.react('⏹');
    //                 // Next image
    //                 await sentMessage.react('▶');
    //                 // Move to page
    //                 await sentMessage.react('🔢').then(_ => {
    //                     console.log('All reactions successful. Beginning image traversal...');
    //                 }, error => {
    //                     console.error(`There was an error reacting to the message: ${error}`);
    //                     throw new Error(error);
    //                 });
    //             });
            
    //         // let suggestion = null;
    //         // if (payload.RelatedTopics.length) {
    //         //     // Assume the first result.
    //         //     suggestion = payload.RelatedTopics[0];
            
    //         // }
            
    //     }
    // });
    
    // const reactionCollector = imageEmbed.createReactionCollector(_ => true, { time: 15000 });
    
    // message.channel
    //     .send(imageEmbed)
    //     .then(async sentMessage => {
    //         // Do not delete these spaces!
    //         // Previous image
    //         await sentMessage.react('◀');
    //         // Cancel search
    //         await sentMessage.react('⏹');
    //         // Next image
    //         await sentMessage.react('▶');
    //         // Move to page
    //         await sentMessage.react('🔢').then(_ => {
    //             console.log('All reactions successful. Beginning image traversal...');
    //         }, error => {
    //             console.error(`There was an error reacting to the message: ${error}`);
    //             throw new Error(error);
    //         });
    //     });
    
};

module.exports = {
    run: run,
    help: {
        name: 'img'
    }
};
