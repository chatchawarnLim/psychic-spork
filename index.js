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
      date: Number,
    }
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
  let body = req.body;
  if ("username" in body) {
    // do the save
    let newUser = new exerciseTracker({ username: body.username });
    newUser.save(function (err, data) {

      if (err) return res.sent(err.message);
      res.json({ _id: data._id, username: data.username });
    });
  }
});


// create
app.post("/api/users/:id/exercises", (req, res) => {
    let queryParams = req.params;
    let body = req.body;

    exerciseTracker.findById(queryParams.id, (err, exercise) =>{
          if(err) return console.log(err); 
          if(!body.description  || !body.duration) return res.send("No params")
          body.date = (body.date)? new Date(body.date).getTime(): new Date().getTime()
          exercise.logs.push(body)

          exercise.save((err, updatedExcersice) => {
            if(err) return console.log(err);
    
            let returnObj = {
              _id: updatedExcersice.id,
              username: updatedExcersice.username,
              description: body.description,
              duration: body.duration,
              date: new Date(body.date).toDateString()
            };
            res.json(returnObj);
          })
    
      } )

  });
  
// get logs
app.get("/api/users/:id/logs", (req, res) => {
  let paramUrl = req.params;
  let queryParam = req.query;


  if (!"id" in paramUrl) res.status(404).send("Do ");


      exerciseTracker.find({}, (err, exerciseTrackerData) => {
        if (err) res.sent(err);

        res.json(exerciseTrackerData);
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

 