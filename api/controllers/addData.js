const { Client } = require('pg')

module.exports = async (req, res, next) => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
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
  if(data[0] == 229 && data.length > 3 && data[3] > 0) {
    value = `${data[3]}`;
  } 
  // Pressure
  else if(data[0] == 199 && data.length > 4 && data[3] > 0 && data[4] > 0) {
    value = `${data[3]}:${data[4]}`;
  } 
  //Temperature
  else if(data[0] == 36 && data.length > 10 && (data[9] > 0 || data[10] > 0)) {
    let temp1 = data[9].toString(16);
    let temp2 = data[10].toString(16);
    let tempFinalHex = temp1+temp2;
    let tempFinal = parseInt(tempFinalHex, 16).toString();
    value = `${tempFinal.slice(-2,0)}`;
  }
  else {
    return;
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