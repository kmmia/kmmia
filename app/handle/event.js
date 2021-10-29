module.exports = function ({ api, config, __GLOBAL, User, Thread }) {
	function getText(...args) {
		const langText = __GLOBAL.language.event;
		const getKey = args[0];
		if (!langText.hasOwnProperty(getKey)) throw `${__filename} - Not found key language: ${getKey}`;
		let text = langText[getKey];
		for (let i = args.length; i > 0; i--) {
			let regEx = RegExp(`%${i}`, 'g');
			text = text.replace(regEx, args[i]);
		}
		return text;
	}

	return async function ({ event }) {
		let threadInfo = await api.getThreadInfo(event.threadID);
		let threadName = threadInfo.threadName;
		switch (event.logMessageType) {
			case "log:subscribe":
				var mentions = [], nameArray = [], memLength = [];
				for (var i = 0; i < event.logMessageData.addedParticipants.length; i++) {
					let id = event.logMessageData.addedParticipants[i].userFbId;
					if (id == api.getCurrentUserID()) {
						await Thread.createThread(event.threadID);
						api.changeNickname(config.botName, event.threadID, api.getCurrentUserID());
						api.sendMessage(getText('connectSuccess', config.prefix), event.threadID);
					}
					else {
						let userName = event.logMessageData.addedParticipants[i].fullName;
						await User.createUser(id);
						nameArray.push(userName);
						mentions.push({ tag: userName, id });
						memLength.push(threadInfo.participantIDs.length - i);
					}
				}
				if (memLength.length != 0 || nameArray.length != 0) {
					memLength.sort((a, b) => a - b);
					var body = getText('welcome', nameArray.join(', '), threadName, memLength.join(', '));
					api.sendMessage({ body, mentions }, event.threadID);
				}
				break;
			case "log:unsubscribe":
				if (event.author == event.logMessageData.leftParticipantFbId) api.sendMessage(getText('left', event.logMessageBody.split(' đã rời khỏi nhóm.' || ' left the group.')[0]), event.threadID);
				else api.sendMessage(getText('kicked', (/đã xóa (.*?) khỏi nhóm/ || /removed (.*?) from the group./).exec(event.logMessageBody)[1]), event.threadID);
				break;
			case "log:thread-icon":
				break;
			case "log:user-nickname":
				break;
			case "log:thread-color":
				break;
			case "log:thread-name":
				await Thread.updateName(event.threadID, threadName);
				break;
		}
	}
}