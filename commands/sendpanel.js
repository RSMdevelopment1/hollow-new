const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendpanel')
        .setDescription('Send the ticket panel'),

    async execute(interaction) {
        if (!fs.existsSync(configPath)) return interaction.reply('⚠️ The bot has not been set up yet.');

        const config = JSON.parse(fs.readFileSync(configPath));
        const { panelMessage, color, dropdownChoices } = config;

        const embed = new EmbedBuilder()
            .setTitle('📩 Open a Ticket')
            .setDescription(panelMessage)
            .setColor(color);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('open_ticket')
            .setPlaceholder('Choose a ticket type')
            .addOptions(dropdownChoices.map(choice => ({
                label: choice,
                value: choice.toLowerCase().replace(/\s+/g, '_')
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: '✅ Ticket panel sent.', ephemeral: true });
    }
};