const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require("body-parser");


let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exerciseTrackSchema = mongoose.Schema({
 
});

let exerciseTracker = mongoose.model("exercise", exerciseTrackSchema);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.get('/api/users', (req, res) => {
  //res.sendFile(__dirname + '/views/index.html')
  let body = req.body;
  if('username' in body){
    // do the save
  }
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
