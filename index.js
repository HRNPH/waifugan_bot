// Require the necessary discord.js classes
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Faces } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Get data from server 'https://api-aws-ganime.herokuapp.com/api using axios'
const axios = require('axios');

const ganMe = async() => {
    await axios.get('https://api-aws-ganime.herokuapp.com/api')
        .then(function(response) {
            // handle success
            // get image encode as 64 from response
            // decode base 64 to image file
            img = new Buffer.from(response.data.image, 'base64');
            // create image attachments file
            const imgattach = new Discord.AttachmentBuilder(img, { name: "waifu.png", description: "generated waifu from Ganime Fullbody" });
            const Imgbed = {
                title: 'GANed Waifu',
                image: {
                    url: 'attachment://waifu.png',
                },
            };
            return imgattach, Imgbed;

        }).catch(function(error) {
            // return false if server downed
            console.log(error)
            return false, false;
        })
}



// event listener on message
client.on('messageCreate', async(message) => {
    // if is bot messaage
    if (message.author.bot) return;

    if (message.content === '$ganme') {
        // get image from server
        ganMe().then((imgattach, Imgbed) => {
            // check if server downed
            if (imgattach === false || Imgbed === false) {
                // send error message to channel
                message.channel.send('Server is downed');
            } else {
                // send image to channel
                message.channel.send({ embeds: [Imgbed], files: [imgattach] });
            }


        }).catch(function(err) {
            console.log(err);
            message.channel.send('Error Contract @hrn#4151 for fixes');
        });
    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN)