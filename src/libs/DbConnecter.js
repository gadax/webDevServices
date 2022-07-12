const mongo = require('mongodb').MongoClient;

class DbConnecter
{
	static db = undefined;
	static client = new mongo('mongodb://localhost:27017');

	static async connect() {
		if(this.db !== undefined) return this.db;

		try
		{
			await this.client.connect();

			this.db = await this.client.db('WebDevServices');

			return this.db;
		}
		catch(e)
		{
			console.log(e);
		}
	};
}

module.exports = DbConnecter;