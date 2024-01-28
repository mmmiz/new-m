
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const authRoute = require("./routes/auth");
const colorRoute = require("./routes/colors");
const userRoute = require("./routes/users");


// ---------- 
mongoose.connect(process.env.MONGO_DB_URL
  // {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // }
)
.then(() => {
  console.log("DB Connected");
});

app.use(cors({
  // origin: 'http://localhost:3001',
  origin: 'https://new-mycolors.onrender.com',
  // "proxy": "https://new-mycolors-api.onrender.com/api",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json({ limit: '1mb' }));


app.use("/api/auth", authRoute);
app.use("/api/colors", colorRoute);
app.use("/api/users", userRoute);


let serverMessage = 'Hello from the server!';
app.get('/api/message', (req, res) => {
  res.json({ message: serverMessage });
});

app.post('/api/message', (req, res) => {
  const { message } = req.body;
  serverMessage = message;
  res.json({ message: serverMessage });
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the 'index.html' file
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/public/index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


