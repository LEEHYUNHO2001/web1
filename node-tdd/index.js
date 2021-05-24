import express from 'express';

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app.listen(3000, () => {
  console.log('Awesome TDD + ES6 app listening on port 3000!');
});