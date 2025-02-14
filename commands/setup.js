const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the ticket system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option => option.setName('support_role').setDescription('Select the support team role').setRequired(true))
        .addChannelOption(option => option.setName('ticket_category').setDescription('Select the ticket category').setRequired(true))
        .addStringOption(option => option.setName('dropdown_choices').setDescription('Comma-separated ticket types').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('Hex color for embed').setRequired(true)),

    async execute(interaction) {
        const supportRole = interaction.options.getRole('support_role');
        const ticketCategory = interaction.options.getChannel('ticket_category');
        const dropdownChoices = interaction.options.getString('dropdown_choices').split(',');
        const color = interaction.options.getString('color');

        await interaction.reply('Please enter your panel message. You have unlimited time.');

        const filter = msg => msg.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter, max: 1 });

        const panelMessage = collected.first().content;

        const config = {
            guildId: interaction.guildId,
            supportRoleId: supportRole.id,
            ticketCategoryId: ticketCategory.id,
            dropdownChoices,
            panelMessage,
            color
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        await interaction.followUp('✅ Ticket system configured successfully.');
    }
};
