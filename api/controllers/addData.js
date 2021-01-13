const { Client } = require('pg')

module.exports = async (req, res, next) => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: true
  });

  let data = req.body.data;

  try {
    client.connect();
    await insertData(client, data);
  } catch(err) {
    return res.status(500).json("Internal error");
  } finally {
    return res.status(200).json("ok");
  }
}

async function insertData(client, data){
  let value = "ok";

  // HeartBeat
  if(data[0] == 229) {
    value = `${data[3]}`;
  }
  const query = {
    text: 'INSERT INTO heartbeat(username, value) VALUES($1, $2)',
    values: ['teste', value],
  }
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
    client.end();
  })
}