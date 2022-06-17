const {requireService} = require('nodecg-io-core');
const {setupBugData} = require('./bugDataSetup');

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
