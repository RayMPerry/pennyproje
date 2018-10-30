const Discord = require('discord.js')

module.exports.run = async(bot, message, args) => {


    let subreddits = [

        'https://media.giphy.com/media/1yLmVQfxCbfv4IZ2dm/giphy.gif',
        'https://media.giphy.com/media/7YBJuJ3lYtR2r6WjOk/giphy.gif',
        'https://media.giphy.com/media/2wgZJu6F8DkSMrvf4i/giphy.gif',
        'https://media.giphy.com/media/fMA8f90Wmyk28iDuXK/giphy.gif',
        'https://media.giphy.com/media/3bzBxrUbPAXgsIHiWR/giphy.gif',
        'https://media.giphy.com/media/555S4jcfLI4wt00HA4/giphy.gif',
        'https://media.giphy.com/media/2uI98PjNm4pyhoVEeo/giphy.gif',
        'https://media.giphy.com/media/LXgqjQ3eGyZrHeKUxU/giphy.gif',
        'https://media.giphy.com/media/E1gzGePqdVxrz06jvZ/giphy.gif',
        'https://media.giphy.com/media/2zoCK1wBN3rrIa94dS/giphy.gif',
        'https://media.giphy.com/media/1RhEW3slpX8EdNHgP8/giphy.gif',
        'https://media.giphy.com/media/EEB391fiPfK4F4mCjt/giphy.gif',
        'https://media.giphy.com/media/1wX5TvqnLJfqPnYTgM/giphy.gif',
        'https://media.giphy.com/media/a5s3dI6Wv1Qcw/giphy.gif',
        'https://thumbs.gfycat.com/GratefulComplexGlassfrog-size_restricted.gif',
        'https://media.giphy.com/media/7T2QCJN6F0L85nMLDY/giphy.gif',
        'https://media.giphy.com/media/pFVSXuW8doiq2XYZLO/giphy.gif',
        'https://media.giphy.com/media/3OzRbyltsK8EX06Aau/giphy.gif',
        




        ]
        let sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];



                let user = message.mentions.members.first()
                if(!user){
                    message.reply(`Who do you want to hug?`)
                }
                const embed = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .setDescription(`${message.author} is hugging **${user}**`)
                    .setImage(sub);
                message.channel.send({
                    embed
                });

}

module.exports.help = {
    name: "hug"
}
