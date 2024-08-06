const ReactionRole = require('discordjs-reaction-role').default;
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reactionRoles',
    initialize: (client) => {
        const reactionRolesPath = path.join(__dirname, '..', 'data', 'reactionRoles.json');
        let reactionRolesData;

        try {
            reactionRolesData = JSON.parse(fs.readFileSync(reactionRolesPath, 'utf8'));
            if (!reactionRolesData.reactionRoles) {
                throw new Error('reactionRoles property is missing');
            }
        } catch (error) {
            console.error('Error reading or parsing reaction roles file:', error);
            reactionRolesData = { reactionRoles: [] };
        }

        const reactionRolesConfig = reactionRolesData.reactionRoles.map(reactionRole => ({
            messageId: reactionRole.messageId,
            reaction: reactionRole.emoji,
            roleId: reactionRole.roleId
        }));

        new ReactionRole(client, reactionRolesConfig);

        console.log('Reaction roles initialized.');
    }
};
