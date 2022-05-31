const {requireService} = require('nodecg-io-core');

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

		nodecg.sendMessageToBundle('SendChatMessage', 'twitch-listener', outMsg);
	}
}

function setupBugData(nodecg, sqlClient) {
	const bugDataReady = nodecg.Replicant('databaseReady');

	bugDataReady.value = false;

	nodecg.log.info('Setting up Bug Data service.');

	nodecg.listenFor('ChatReceived', 'twitch-listener', ({user, message}) => {
		if (!user || !message || !message.startsWith('!bug ')) {
			return;
		}

		const bugName = message.split(' ').slice(1).join(' ').toLowerCase();
		const gameVersion = nodecg.Replicant('acGameVersion');
		nodecg.log.info('looking up bug data for', gameVersion.value);
		switch (gameVersion.value) {
			case 'animal-crossing':
			default:
				sqlClient('ac_bug_data')
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
						} else {
							nodecg.log.info('no bug found,', bugName);
						}
					});
				break;
		}
	});

	nodecg.log.info('Done setting up Bug Data service.');
	bugDataReady.value = true;
}

function teardownBugData(nodecg) {
	nodecg.log.info('Tearing down Animal Crossing Bug Data service.');
	const bugDataReady = nodecg.Replicant('databaseReady');
	bugDataReady.value = false;
	nodecg.log.info('Done tearing down Animal Crossing Bug Data service.');
}

module.exports = function (nodecg) {
	nodecg.log.info('Animal Crossing Bug Data bundle started.');
	nodecg.Replicant('databaseReady', {
		defaultValue: false
	});
	nodecg.Replicant('acGameVersion', {
		defaultValue: 'none'
	});

	const bugDb = requireService(nodecg, 'sql');

	bugDb.onAvailable(async sqlClient => {
		setupBugData(nodecg, sqlClient);
	});

	bugDb.onUnavailable(async () => teardownBugData(nodecg));
};
