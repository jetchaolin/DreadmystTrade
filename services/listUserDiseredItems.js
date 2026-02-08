function listUserDiseredItems(userRequestFilterFile) {
        let reply = '';
        reply += 'User List:\n';
        for (let i of userRequestFilterFile) {
                reply += `${i}\n`;
        }
        reply += '\n';
	console.log(reply)
        return reply;
}

export default listUserDiseredItems;
