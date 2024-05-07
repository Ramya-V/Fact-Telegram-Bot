const { Telegraf } = require('telegraf');
const { v4: uuid } = require('uuid');
const { generateFact, deleteFact } = require('./factGenerator');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx)=>{
    ctx.reply('Please use the /fact commond to recieve new fact');
});

bot.command('fact', async(ctx)=>{
    try{
    ctx.reply('Generating fact, please wait..');
    console.log("test")
    let imgPath = `./temp/${uuid()}.jpg`;
    await generateFact(imgPath);
    await ctx.replyWithPhoto({source: imgPath});
    deleteFact(imgPath);
    }
    catch(e){
        console.log("Error while sending fact ", e);
        ctx.reply('Error while sending fact')
    }
});

bot.launch();