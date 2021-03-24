const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {graphqlHTTP} = require('express-graphql');
const {execute, subscribe} = require('graphql');
const { useServer } = require('graphql-ws/lib/use/ws');
const ws = require('ws');
require('dotenv').config();


const authRouter = require('./routes/auth.js');

const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver');

const app = express();
const http = require('http').Server(app);
const parserJson = express.json();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, function(err) {
  if (err)
    console.log(err);
  else
    console.log('connected');
});

const filter = function(request, file, cb) {
  if (file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
	file.mimetype === "image/jpeg" ||
	file.mimetype === "image/bmp") {
	  cb(null, true);
	} else {
	  cb(null, false);
	}
}

app.use(cors());
app.options('*', cors());
app.use(express.static(__dirname + "/public"));
app.use(multer({dest:"public/uploads", fileFilter: filter}).single("filedata"));
app.use(parserJson);
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use((request, response, next) => {
  request.cookies.userId = undefined;
  if (request.cookies.token) {
    let clientToken = request.cookies.token;
    jwt.verify(clientToken, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        console.log(err);
        next();
      }

      request.cookies.userId = payload.userId;
      next();
    })
  } else {
    next();
  }
})


app.use('/graphql', 
  graphqlHTTP({
      schema: schema,
      rootValue: resolver,
      graphiql: true,
    }
  )
);

const wsServer = new ws.Server({
  server: http,
  path: '/graphql',
});

useServer(
  {
    schema, 
    roots: resolver, 
    execute,
    subscribe,
  },
  wsServer,
);

app.use('/', authRouter);
app.use('/upload', (request, response) => {
  response.json({filename: request.file.filename});
});
app.use('/', function(request, response){
  response.status(404).send('Not found');
});

http.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`);
});
