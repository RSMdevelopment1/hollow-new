const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Reply to a ticket')
        .addStringOption(option => option.setName('reply').setDescription('Your reply').setRequired(true)),

    async execute(interaction) {
        const reply = interaction.options.getString('reply');

        const ticketOwner = interaction.channel.topic; 
        if (!ticketOwner) return interaction.reply('⚠️ This is not a valid ticket.');

        const user = await interaction.client.users.fetch(ticketOwner);
        if (!user) return interaction.reply('⚠️ User not found.');

        await user.send(`Support: ${reply}`);
        await interaction.reply({ content: '✅ Reply sent.', ephemeral: true });
    }
};
