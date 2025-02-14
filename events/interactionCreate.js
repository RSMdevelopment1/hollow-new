const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'open_ticket') {
            if (!fs.existsSync(configPath)) return interaction.reply({ content: '⚠️ Ticket system is not set up.', ephemeral: true });

            const config = JSON.parse(fs.readFileSync(configPath));
            const { ticketCategoryId, supportRoleId } = config;

            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                parent: ticketCategoryId,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: ['ViewChannel'] },
                    { id: interaction.user.id, deny: ['ViewChannel'] },
                    { id: supportRoleId, allow: ['ViewChannel', 'SendMessages'] }
                ]
            });

            await interaction.reply({ content: '✅ Ticket created! Check your DMs.', ephemeral: true });

            const dmMessage = await interaction.user.send('Your ticket has been opened. You can type here, and staff will see your messages.');
            client.tickets.set(dmMessage.channel.id, ticketChannel.id);

            ticketChannel.send(`<@&${supportRoleId}> New ticket opened by ${interaction.user.tag}`);
        }
    }
};
