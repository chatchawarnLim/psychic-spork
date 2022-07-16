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



// create
app.post("/api/users", (req, res) => {
  //res.sendFile(__dirname + '/views/index.html')
  let body = req.body;
  if ("username" in body) {
    // do the save
    let newUser = new exerciseTracker({ username: body.username });
    newUser.save(function (err, data) {
      console.log(data)
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


app.get("/api/users", (req, res) => {
  exerciseTracker.find({}).then(function (data) {
    console.log(data)
    res.json(data);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

 