const { Client } = require('pg')

module.exports = async (req, res, next) => {
  let returnState = null;
  try {
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }
    });
  
    let data = req.body.data;
    client.connect();
    await insertData(client, data);
    returnState = res.status(200).json("ok");
  } catch(err) {
    console.log(err)
    returnState = res.status(500).json("Internal error");
  } finally {
    return returnState;
  }
}

async function insertData(client, data){
  let value = "ok";

  let query = {
    text: '',
    values: [],
  }

  console.log(data);

  // Heart Beat
  if(data.length === 8 && data[0] == 171 && data[1] == 0 && data[2] == 5 && data[3] == 255 && data[4] == 49 && data[5] == 9 && data[6] > 0) {
    value = `${data[6]}`;
    query = {
      text: 'INSERT INTO heartbeat(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  } 
  // Pressure
  else if(data.length === 8 && data[0] == 171 && data[1] == 0 && data[2] == 5 && data[3] == 255 && data[4] == 49 && data[5] == 33 && data[6] > 0) {
    value = `${data[6]}:${data[7]}`;
    query = {
      text: 'INSERT INTO pressure(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  }
  // Saturation
  else if(data.length === 8 && data[0] == 171 && data[1] == 0 && data[2] == 5 && data[3] == 255 && data[4] == 49 && data[5] == 17 && data[6] > 0) {
    value = `${data[6]}`;
    query = {
      text: 'INSERT INTO saturation(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  } 
  // Temperature
  else if(data.length === 8 && data[0] == 171 && data[1] == 0 && data[2] == 5 && data[3] == 255 && data[4] == 134 && data[5] == 128 && data[6] > 0) {
    value = `${data[6]}.${data[7]}`;
    query = {
      text: 'INSERT INTO temperature(username, value) VALUES($1, $2)',
      values: ['teste', value],
    }
  }
  else {
    client.end();
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
