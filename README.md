# ac-bug-data-bot
ac-bug-data-bot is a [NodeCG](http://github.com/nodecg/nodecg) bundle. 
It works with NodeCG versions which satisfy this [semver](https://docs.npmjs.com/getting-started/semantic-versioning) range: `^1.1.1`
You will need to have an appropriate version of NodeCG installed to use it.

## nodecg-io service config
```
{
    "client": "sqlite3",
    "connection": {
        "filename": "./bundles/ac-bug-data-bot/database/bugData.db"
    }
}
```