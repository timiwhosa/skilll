var express = require("express");
var path = require("path");
var app = express();
var Port = process.env.PORT || 3001;
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
// var multer = require("multer");
// var moment = require("moment");
// var fetch = require("node-fetch");
// var fs = require("fs");
var bcrypt = require("bcrypt");
require("dotenv/config");
// var session = require("express-session");

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected");
  }
);

String.prototype.escape = function () {
  var tagtoreplace = {
    "&": "&amp;",
    "<": "&lt",
    ">": "&gt",
    "=": "",
    script: " ",
    Script: " ",
    '"': " ",
    "`": " ",
  };
  return this.replace(/[&<>`=]/g, function (tag) {
    return tagtoreplace[tag] || tag;
  });
};

var public = path.join(__dirname, "./public");
app.use(express.static(public));
var Jsonparser = bodyParser.json();
var Urlparser = bodyParser.urlencoded({ extended: false });
var salt = parseInt(process.env.Salt);
// app.use(
//   session({
//     secret: "randomise it all",
//     resave: true,
//     saveUninitialized: false,
//   })
// );
// const user = require("./models/user");

// function auth(req, res, next) {
//   user.find({}).then(async (data) => {
//     if (data) {
//       if (req.session.userId === data[0]._id.toString()) {
//         next();
//       } else {
//         res.redirect("/");
//       }
//     }
//   });
// }

// get Request
app.get("/", (req, res) => {
  res.sendFile(public + "/index.html");
});

var Schema = mongoose.Schema;
var SkiilllSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    required: true,
  },
  twitter: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

var Skilll = new mongoose.model("skilll", SkiilllSchema);

app.get("/search", Jsonparser, (req, res) => {
  Skilll.find({
    $and: [
      { school : req.query.school.toLowerCase() },
      { skill: { $regex: req.query.keyword.toLocaleLowerCase() } },
    ],
  }).then((data) => {
    if (data && data.length > 0) {
      var newData = [];
      data.filter((dat) => {
        var newdat = {
          _id: dat._id,
          name: dat.name,
          school: dat.school,
          skill: dat.skill,
          portfolio: dat.portfolio,
          twitter: dat.twitter,
        };
        newData.push(newdat);
      });
      if (newData.length > 0) {
        res.json({ data: newData, status: 200 });
      }
    } else {
      res.json({ message: "No record Found", status: 208 });
    }
  });
});

app.post("/joinSkilll", Jsonparser, (req, res) => {
  if (
    req.body.name &&
    req.body.school &&
    req.body.skilll &&
    req.body.portfolio &&
    req.body.twitter &&
    req.body.password
  ) {
    var sec = {
      name: req.body.name.escape(),
      number: parseInt(req.body.number),
    };
    var user = {
      name: req.body.name.escape(),
      school: req.body.school.toLowerCase().escape(),
      skill: req.body.skilll.toLowerCase().escape(),
      portfolio: req.body.portfolio.escape(),
      twitter: req.body.twitter.escape(),
      password: req.body.password,
    };
    //check if user exists, save details to database and give response
    Skilll.findOne({
      $or: [
        { portfolio: { $regex: user.portfolio } },
        { twitter: { $regex: user.twitter } },
      ],
    }).then(async (data) => {
      if (data) {
        res.json({ message: "user exist", status: 208 });
      } else {
        var password = await bcrypt.hash(user.password, salt);
        user.password = password;
        var AddSkilll = new Skilll(user);
        AddSkilll.save().then((data) => {
          // console.log(data);
          res.json({
            message:
              "Added, Welcome to Skilll.. To update your details, Search for your name and Click 'Edit'",
            status: 200,
          });
        });
      }
    });
  }
});
app.post("/UpdateSkilll", Jsonparser, (req, res) => {
  
  //check if user exists, Update details to database and give response
  var id = mongodb.ObjectID(req.body.myId);
  Skilll.findOne({ _id: id }).then(async (data) => {
    if (data) {
      console.log(data.password)
      var password = await bcrypt.compare(req.body.password, data.password);
      console.log(password)
      if (password === true && req.body.name.length<20 && req.body.school.length<10 && req.body.skill.length<60 && req.body.portfolio.length<70 && req.body.twitter.length<70) {
        Skilll
          .updateOne(
            { _id: id },
            {
              $set: {
                name: req.body.name.escape(),
                school: req.body.school.toLowerCase().escape(),
                skill: req.body.skill.toLowerCase().escape(),
                portfolio: req.body.portfolio.escape(),
                twitter: req.body.twitter.escape(),
              },
            }
          )
          .then((data) => {
            console.log(data);
            res.json({ message: "Update succesful", status: 200 });
          });
      } else {
        res.json({ message: "error occured", status: 208 });
      }
    }
  });
});

// app.post("/logout", Urlparser, (req, res) => {
//   if (req.session) {
//     req.session.destroy(function (err) {
//       if (err) {
//         return console.log(err);
//       } else {
//         res.json({ redirect: "/login", status: 200 });
//       }
//     });
//   }
// });

// app.post("/passwordchange", Jsonparser, auth, (req, res) => {
//   // console.log(req.body);

//   user.find({ name: req.body.username }).then(async (data) => {
//     if (data.length === 1) {
//       var pasw = await bcrypt.compare(req.body.password, data[0].password);
//       if (pasw === true) {
//         req.session.userId = data[0]._id;
//         var newpassword = await bcrypt.hash(req.body.newpassword, salt);
//         data[0].password = newpassword;
//         data[0].name = req.body.newusername;
//         data[0].save().then(() => {
//           res
//             .status(200)
//             .json({ message: "password/username updated", status: 200 });
//         });
//       } else {
//         res.json({ message: "error", status: 208 });
//       }
//     } else {
//       res.json({ message: "error", status: 208 });
//     }
//   });
// });

app.listen(Port, () => {
  console.log("app started");
});
