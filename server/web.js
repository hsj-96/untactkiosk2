import express from 'express';
const app = express();

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', function(request, response){
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

import menuRouter from './routes/menu.js';
app.use('/', menuRouter);
