const sqlite3 = require('sqlite3').verbose();
const {bugData, bugDataDnMEPlus} = require('./bugData');
const db = new sqlite3.Database('./database/bugData.db');

// The tables are identical for all versions
// so predefine the schema
const tableSchema = `(
	id INTEGER PRIMARY KEY AUTOINCREMENT
	, name TEXT
	, available TEXT
	, peak TEXT
	, time TEXT
	, location TEXT
	, spawn TEXT
	, rain INTEGER
	)`;

// Predefine the insert statement since
// the schemas are the same
const insertStmt = `(
      name, 
      available, 
      peak, 
      time, 
      location, 
      spawn, 
      rain
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

// Map the table names to the data so we can do this in a loop
const tableDataMapping = {
	// eslint-disable-next-line quote-props
	'ac_bug_data': bugData,
	// eslint-disable-next-line quote-props
	'dnmeplus_bug_data': bugDataDnMEPlus
};

// Start the db transaction
db.serialize(() => {
	console.log('Creating bug database.');

	for (const [tableName, tableData] of Object.entries(tableDataMapping)) {
		console.log(`Creating ${tableName} bug table.`);
		// Create the bug data table
		db.run(`CREATE TABLE ${tableName} ` + tableSchema);
		// Create the insert statement
		const stmt = db.prepare(`INSERT INTO ${tableName} ` + insertStmt);
		// Insert all the bugs
		for (const bd of tableData) {
			console.log('Loading Bug: ', bd.name);
			// Do the insert
			stmt.run(
				[bd.name, bd.available, bd.peak, bd.time, bd.location, bd.spawn, bd.rain],
				err => {
					if (err) {
						// Throw if theres any error
						throw err;
					}
				}
			);
		}

		// Finalize the create table/inserts
		stmt.finalize();
		console.log(`Finished creating ${tableName} bug table.`);
	}
});

// Done
db.close();
