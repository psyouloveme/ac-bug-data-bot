const sqlite3 = require('sqlite3').verbose();
const {bugData} = require('./bugData');
const db = new sqlite3.Database('bugData.db');

db.serialize(() => {
	console.log('Creating Animal Crossing bug database.');

	db.run(
		'CREATE TABLE ac_bug_data (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', name TEXT' +
      ', available TEXT' +
      ', peak TEXT' +
      ', time TEXT' +
      ', location TEXT' +
      ', spawn TEXT' +
      ', rain INTEGER' +
      ')'
	);

	const acInsert = db.prepare(
		`INSERT INTO ac_bug_data (
      name, 
      available, 
      peak, 
      time, 
      location, 
      spawn, 
      rain
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
	);
	for (const bd of bugData) {
		console.log('trying to load data', bd.name);
		acInsert.run(
			[bd.name, bd.available, bd.peak, bd.time, bd.location, bd.spawn, bd.rain],
			err => {
				if (err) {
					throw err;
				}
			}
		);
	}

	acInsert.finalize();

	console.log('Finished creating Animal Crossing bug table database.');

	db.run(
		'CREATE TABLE dnmeplus_bug_data (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', name TEXT' +
      ', available TEXT' +
      ', peak TEXT' +
      ', time TEXT' +
      ', location TEXT' +
      ', spawn TEXT' +
      ', rain INTEGER' +
      ')'
	);

	const dnmeplusInsert = db.prepare(
		`INSERT INTO dnmeplus_bug_data (
      name, 
      available, 
      peak, 
      time, 
      location, 
      spawn, 
      rain
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
	);
	for (const bd of bugData) {
		console.log('trying to load data', bd.name);
		dnmeplusInsert.run(
			[bd.name, bd.available, bd.peak, bd.time, bd.location, bd.spawn, bd.rain],
			err => {
				if (err) {
					throw err;
				}
			}
		);
	}

	dnmeplusInsert.finalize();

	console.log('Finished creating Doubutsu no Mori e+ bug table database.');
});

db.close();
