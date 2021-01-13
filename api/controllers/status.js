module.exports = async (req, res, next) => {
  return res.status(200).json("OK");
  // const MongoClient = require('mongodb').MongoClient;

  // const uri = process.env.DB_URI;

  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // let result = null;
  // try {
  //   await client.connect();
  //   result = await getStatus(client);
  // } catch(err) {
  //   return res.status(500).json("Internal error");
  // } finally {
  //   await client.close();
  //   return res.status(200).json(result);
  // }
}

async function getStatus(client) {
  // let nQueries = await client.db('cpfCnpjDb').collection('stats').findOne({ queries : { $exists : true } });
  // return {
  //   queries: nQueries.queries, 
  //   upTime: process.uptime()+"s"
  // }
};