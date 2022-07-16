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

app.post("/api/users", (req, res) => {
  //res.sendFile(__dirname + '/views/index.html')
  let body = req.body;
  if ("username" in body) {
    // do the save
    let newUser = new exerciseTracker({ username: body.username });
    newUser.save(function (err, data) {
      console.log(err);
      if (err) return res.sent(err.message);
      res.json({ _id: data._id, username: data.username });
    });
  }
});

app.get("/api/users/:id/logs", (req, res) => {
  let queryParam = req.params;

  if (!"id" in queryParam) res.status(404).send("Do ");

  exerciseTracker.findById(queryParam.id, (err, exerciseTrackerData) => {
    if (err) res.sent(err);
    console.log(exerciseTrackerData);
    exerciseTrackerData.count = exerciseTrackerData.logs.length;
    res.json(exerciseTrackerData);
  });
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let queryParam = req.params;
  let body = req.body;

  if (!"_id" in queryParam) res.status(404).send("Do ");
  if (!"date" in req.body) {
    body.date = new Date();
  }

  exerciseTracker.findById(queryParam._id, (err, exerciseTrackerData) => {
    if (err) res.sent(err);
    console.log("body", body)
    console.log("post ext", exerciseTrackerData);
    exerciseTrackerData.logs.push(body);
    console.log("post update ext", exerciseTrackerData);
    /*
    exerciseTracker
      .findOneAndUpdate({ id: queryParam._id }, {logs : exerciseTrackerData.logs}, {
        new: true,
      })
      .then((data) => {
        if (err) return console.log(err);
        console.log("post ext", data);
        res.json(data);
      });*/
  });
});

app.get("/api/users", (req, res) => {
  exerciseTracker.find({}).then(function (data) {
    res.json(data);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
