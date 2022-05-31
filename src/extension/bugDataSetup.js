function bugCallback(nodecg, bug) {
	if (!bug) {
		return;
	}

	if (bug) {
		let outMsg = `${bug.name}: available ${bug.location} ${bug.available}, ${bug.time}.`;
		if (bug.available !== bug.peak) {
			outMsg += ` peaks in ${bug.peak}.`;
		}

		outMsg += ` ${bug.spawn} spawn rate (in this route)`;
		if (bug.rain) {
			outMsg += '.';
		} else {
			outMsg += ' but not in rain.';
		}

		nodecg.sendMessage('SendChatMessage', outMsg);
	}
}

exports.setupBugData = function (nodecg, sqlClient) {
	const bugDataReady = nodecg.Replicant('bugDataReady');

	bugDataReady.value = false;

	nodecg.log.info('Setting up Bug Data service.');

	nodecg.listenFor('ChatReceived', ({user, message}) => {
		if (!user || !message || !message.startsWith('!bug ')) {
			return;
		}

		const bugName = message.split(' ').slice(1).join(' ').toLowerCase();
		const gameVersion = nodecg.Replicant('acGameVersion');
		let tablename = null;

		switch (gameVersion.value) {
			case 'doubutsu-no-mori-e+':
				tablename = 'dnmeplus_bug_data';
				break;
			case 'animal-crossing':
			default:
				tablename = 'ac_bug_data';
				break;
		}

		if (!tablename) {
			return;
		}

		sqlClient(tablename)
			.first(
				'name',
				'available',
				'peak',
				'time',
				'location',
				'spawn',
				'rain'
			)
			.where('name', bugName)
			.then(row => {
				if (row) {
					bugCallback(nodecg, row);
				}
			})
			.catch(err => {
				nodecg.log.error(err);
			});
	});

	nodecg.log.info('Done setting up Bug Data service.');
	bugDataReady.value = true;
};
