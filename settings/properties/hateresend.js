module.exports = {
    name: "Re-send hateful message",
    type: "bool",
    extendable: false,
    description: "Whether the bot should send the message, without the swears. " + 
        "Keep in mind that doing so will automatically disable the Anti-swear response. " + 
        "Also note that this requires that I have the \"Manage webhooks\" permission.",
    category: "Anti-swear filter"
} 
