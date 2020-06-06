const keys = require('./keys');
// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.error('Lost PG connection'));
pgClient
  .query('SELECT COUNT(*) FROM movies LIMIT 1;')
  .then((values) => {
    if (values) {
      console.log('Connection tested OK');
    }
  })
  .catch(err => console.log(err));

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi');
});

// Nginx will chop of /api/
app.get('/random', async (req, res) => {
  if (process.env.pgHost === 'localhost') {
    res.send([
      {
        "tconst": "tt7838260", //
        "cluster": 4
      },
      {
        "tconst": "tt0049954",//
        "cluster": 10
      },
      {
        "tconst": "tt1020943",
        "cluster": 19
      },
      {
        "tconst": "tt7834022",//
        "cluster": 15
      },
      {
        "tconst": "tt0093491",///
        "cluster": 23
      },
      {
        "tconst": "tt8451428",
        "cluster": 4
      },
      {
        "tconst": "tt8234892",//
        "cluster": 23
      },
      {
        "tconst": "tt0056742",//
        "cluster": 19
      },
      {
        "tconst": "tt0094000",//
        "cluster": 12
      },
      {
        "tconst": "tt7288906",
        "cluster": 17
      },
      {
        "tconst": "tt1000017",
        "cluster": 23
      },
      {
        "tconst": "tt8452308",//
        "cluster": 19
      },
      {
        "tconst": "tt0058986",//
        "cluster": 12
      },
      {
        "tconst": "tt10738462",
        "cluster": 15
      },
      {
        "tconst": "tt9595506",//
        "cluster": 10
      },
      {
        "tconst": "tt9298612",//
        "cluster": 4
      },
      {
        "tconst": "tt7129926",//
        "cluster": 12
      },
      {
        "tconst": "tt9408518",
        "cluster": 12
      },
      {
        "tconst": "tt0093688",//
        "cluster": 19
      },
      {
        "tconst": "tt7612938",//
        "cluster": 19
      }
    ]);
  }
  let randoms = 0;
  await pgClient.query('SELECT MAX(id) FROM movies;')
    .then((values) => {
      if (values) {
        randoms = values.rows[0]['max'];
      }
    })
    .catch((err) => {
      console.error(err);
    });

  var arr = [];
  if (randoms >= 20) {
    while (arr.length < 20) {
      var r = Math.floor(Math.random() * randoms) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
  }

  var results = [];
  await Promise.all(arr.map(async (id) => {
    await pgClient.query('SELECT tconst, cluster FROM movies WHERE id = $1 LIMIT 1;', [id])
      .then((values) => {
        results.push(values.rows[0]);
      })
      .catch((err) => {
        console.error(err);
      });
    return true;
  }));
  res.send(results);
});

app.get('/recommend/:cluster/:limit', async (req, res) => {

  if (process.env.pgHost === 'localhost') {
    res.send([
      {
        "tconst": "tt0016223"
      },
      {
        "tconst": "tt0018530"
      },
      {
        "tconst": "tt0015794"
      },
      {
        "tconst": "tt0048954"
      }
    ]);
  }

  const cluster = req.params.cluster;
  const limit = req.params.limit;
  console.log(cluster, limit);

  await pgClient.query('SELECT tconst FROM movies WHERE cluster = $1 ORDER BY averageRating DESC LIMIT $2;', [cluster, limit])
    .then((values) => {
      res.send(values.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send({ error: err });
    });
});

app.listen(5000, err => {
  console.log('Listening');
});
