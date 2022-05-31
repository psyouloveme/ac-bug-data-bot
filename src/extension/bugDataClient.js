exports.queryBug = function (db, bugName, bugCallback) {
  if (!bugName) {
    return null;
  }

  db.get(`SELECT * FROM bugData WHERE name = '${bugName}'`, (err, row) => {
    console.log("found row", row);
    if (err) {
      console.error(err);
      throw err;
    } else {
      bugCallback(row);
    }
  });

  db.close();
};
