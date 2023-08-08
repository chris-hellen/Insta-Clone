const cors = require("cors");
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");
const PORT = 3306;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// config multers.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const filename = file.mimetype.includes('image') ? `${file.fieldname}-${Date.now()}.jpg` : `${file.fieldname}-${Date.now()}.mp4`
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

//establish database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'chellen',
  password: 'Bamarocks23###',
  database: "instagram",
  port: 3306
});

connection.connect((error) => {
    if (error){
        console.log("Database connection failed");
    }
    else{
        console.log('Connected to the database');
        require("./routes")({ app, connection, upload});
        app.listen(PORT, () => {
            console.log("Server is listening on port " + PORT);
        })
    }
  });