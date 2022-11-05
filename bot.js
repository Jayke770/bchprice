import 'dotenv/config'
import { Telegraf } from 'telegraf'
import schedule from 'node-schedule'
import CoinGecko from 'coingecko-api'
import fs from 'fs-extra'
const CoinGeckoClient = new CoinGecko()
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(async (ctx) => {
    const x = (await fs.readFile('db.txt', 'utf8'))
    let data = x ? (await fs.readFile('db.txt', 'utf8')).split(',') : []
    if (!data.includes(ctx.from.id.toString())) {
        data.push(ctx.from.id)
        await fs.writeFile('db.txt', data.toString())
    }
    await ctx.reply('This bot will send the BCH price every 30 minutes.')
})
bot.launch().then(async () => {
    if (!(await fs.pathExists('db.txt'))) {
        await fs.createFile('db.txt')
    }
    console.log('Bot Started')
})
const rule = new schedule.RecurrenceRule()
rule.minute = 30
rule.tz = 'Asia/Manila'
schedule.scheduleJob(rule, async function () {
    await CoinGeckoClient.coins.fetch('bitcoin-cash').then(async (data) => {
        const users = (await fs.readFile('db.txt', 'utf8')).split(',')
        users.map(async (x) => {
            let text = 'BCH Price\n\n'
            text += `₱${data.data.market_data.current_price.php.toLocaleString()}\n`
            await bot.telegram.sendMessage(x, text)
        })
    })
})
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))