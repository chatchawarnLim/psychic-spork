const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
var bodyParser = require("body-parser");

let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exerciseTrackSchema = mongoose.Schema({
  username: String,
  count: Number,
  logs: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

let exerciseTracker = mongoose.model("exercise", exerciseTrackSchema);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});



app.post("/api/users/:_id/exercises", (req, res) => {
  let queryParam = req.params
  let body = req.body
  console.log(req.body)
  res.json(body)
  if(!'_id' in queryParam) res.status(404).send("Do ")
  if(!'date' in req.body){
    body.date = new Date()
  }
  exerciseTracker.find({"_id":queryParam._id }, (err,exerciseTrackerData) => {
    if(err) res.sent(err)
    exerciseTrackerData.push(body)
    body['_id'] = queryParam._id;
    body['username'] = exerciseTrackerData.username
    exerciseTrackerData.save((err, updateExercise)=>{
      if(err) return console.log(err)
      res.json(body)
    })
    
  })

});


app.get("/api/users", (req, res) => {
  exerciseTracker.find({}).then(function(data){
    res.json(data)
  })
})

app.post("/api/users", (req, res) => {
  //res.sendFile(__dirname + '/views/index.html')
  let body = req.body;
  if ("username" in body) {
    // do the save
    let newUser = new exerciseTracker({ username: body.username });
    newUser.save(function (err, data) {
      if (err) return res.sent(err.message);
      res.json({"_id":data._id, "username": data.username});
    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
