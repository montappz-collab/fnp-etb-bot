const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID;

if (!BOT_TOKEN) {
  console.error('ERROR: DISCORD_BOT_TOKEN not set');
  process.exit(1);
}

client.on('ready', async () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ FNP-ETB-BOT is ONLINE`);
  console.log(`   Bot Name: ${client.user.tag}`);
  console.log(`   Bot ID: ${client.user.id}`);
  console.log(`   Test Channel: ${TEST_CHANNEL_ID}`);
  console.log(`${'='.repeat(60)}\n`);

  if (TEST_CHANNEL_ID) {
    try {
      const channel = await client.channels.fetch(TEST_CHANNEL_ID);
      if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setTitle('✅ FNP-ETB-Bot is LIVE')
          .setDescription('Phase 1: Alert Logging System Active')
          .addFields(
            { name: 'Status', value: 'Connected and monitoring', inline: true },
            { name: 'Start Time', value: new Date().toISOString(), inline: true },
            { name: 'Ready', value: 'Yes', inline: true }
          )
          .setFooter({ text: 'Friday Night Pulls • ETB Alert Monitor' });

        await channel.send({ embeds: [embed] });
        console.log(`✅ VERIFICATION MESSAGE SENT to channel ${TEST_CHANNEL_ID}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send verification: ${error.message}`);
    }
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.channelId !== TEST_CHANNEL_ID) return;
  console.log(`📨 [${new Date().toISOString()}] ${message.author.tag}: ${message.content.substring(0, 80)}`);
});

client.on('error', (error) => console.error('❌ Error:', error.message));

console.log('🔌 Connecting to Discord...');
client.login(BOT_TOKEN).catch((err) => {
  console.error('❌ Login failed:', err.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  client.destroy();
  process.exit(0);
});
