export function writeReply(message, userResultList) {
        message += 'Results:\n';

        for (let i of userResultList) {
                for (let key in i) {
                        message += `${key.toUpperCase()} :`.padEnd(40) + `${i[key]}\n`;
                }
                message += '\n';
        }
        return message;
}
