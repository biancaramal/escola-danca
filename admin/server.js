const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist/adminv1'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/dist/adminv1/index.html');
});

app.listen(PORT, () => {
  console.log('Servidor iniciado na porta ' + PORT)
});
