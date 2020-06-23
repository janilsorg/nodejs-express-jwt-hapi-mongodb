const express = require('express');
app = express();

const dotenv = require('dotenv');
const mongoogle = require('mongoose');
const logger = require('./middlewares/logger');
// Importando rotas
authRoute = require('./api/auth');
postRoute = require('./api/posts');

// Recebendo dados do .env
dotenv.config()

// Caso PORT seja definido no .env considerar, senão, usar 5000
const PORT = process.env.PORT || 5000;

//Conectando com o banco de dados
mongoogle.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, }, () => console.log('Conexão com o BD realizada com sucesso'));


// Middlewares
app.use(express.json());
// app.use(logger);

// Rotas middlewares
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));