const express = require('express');
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/form.html'));
});

app.post('/item', (req, res) => {
  console.log([req.body.id, req.body.thing]);

  const text = `
    <ol>
      <li>${req.body.id}</li>
      <li>${req.body.thing}</li>
    </ol>
  `;
  
  res.status(200).send(text);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
server.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
