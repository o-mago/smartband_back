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

  let query = {
    text: '',
    values: [],
  }

  // HeartBeat
  if(data[0] == 229 && data.length > 3 && data[3] > 0) {
    value = `${data[3]}`;
    query = {
      text: 'INSERT INTO heartbeat(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  } 
  // Pressure
  else if(data[0] == 199 && data.length > 4 && data[3] > 0 && data[4] > 0) {
    value = `${data[3]}:${data[4]}`;
    query = {
      text: 'INSERT INTO pressure(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  } 
  //Temperature
  else if(data[0] == 36 && data.length > 10 && data[9] > 0) {
    let temp1 = data[9].toString(16);
    let temp2 = data[10].toString(16);
    let tempFinalHex = temp1+temp2;
    let tempFinal = parseInt(tempFinalHex, 16).toString();
    value = `${tempFinal.substr(0,0,tempFinal.length-2)+tempFinal.substr(-2,2)}`
    query = {
      text: 'INSERT INTO temperature(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  }
  else {
    return;
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