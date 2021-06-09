const { Client } = require('pg')

module.exports = async (req, res, next) => {
  console.log("teste")
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
    await login(client, data);
    returnState = res.status(200).json("ok");
  } catch(err) {
    console.log(err)
    returnState = res.status(500).json("Internal error");
  } finally {
    return returnState;
  }
}

async function login(client, data) {
  let query = {
    text: '',
    values: [],
  }

  if(data) {
    query = {
      text: 'INSERT INTO users(cpf) VALUES($1) ON CONFLICT DO NOTHING',
      values: [data],
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
