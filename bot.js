import 'dotenv/config'
import { Telegraf } from 'telegraf'
import schedule from 'node-schedule'
import CoinGecko from 'coingecko-api'
const CoinGeckoClient = new CoinGecko()
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.launch().then(() => console.log("Bot Started"))
const rule = new schedule.RecurrenceRule()
rule.minute = 30
rule.tz = 'Asia/Manila'
schedule.scheduleJob(rule, async function () {
    await CoinGeckoClient.coins.fetch('bitcoin-cash').then(async (data) => {
        let text = 'BCH Price\n\n'
        text += `₱${data.data.market_data.current_price.php.toLocaleString()}\n`
        await bot.telegram.sendMessage('1391502332', text)
    })
})
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))