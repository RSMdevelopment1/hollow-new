module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        // Check if message is in DM and linked to a ticket
        if (message.channel.type === 1) {
            const ticketChannelId = client.tickets.get(message.channel.id);
            if (!ticketChannelId) return;

            // Fetch the ticket channel
            const ticketChannel = await client.channels.fetch(ticketChannelId);
            if (!ticketChannel) return;

            // Send user's message to the support team
            ticketChannel.send(`📩 **${message.author.tag}**: ${message.content}`);
        }
    }
};
