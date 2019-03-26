const express = require("express"); 
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const so = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

const io = so.listen(httpServer);

let myCameras = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", function(socket) {
      let response = {};
      response.command = "sync";
      socket.emit("reconnection", response);

      socket.on("ip", function(data) {
        console.log(data);
         try {
          switch (data.command) {
            case "send_ip":
              myCameras.push(data.ip);
              function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
              myCameras = myCameras.filter(onlyUnique);
              console.log("Connexion maquette !");
              console.log(myCameras);
              socket.emit("configPage", myCameras);
              break;
            default:
              console.log("Command not supported..");
          }
        } catch (err) {
          console.log(err);
          console.log("Error parse JSON..");
        }
      }); 
});

app.use("/",express.static(__dirname + "/"));


app
  //page d'acceuil
  .get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  })

app.post("/change_time", function(req, res, next) {
  console.log("Test du boutton");

  console.log(req.body);

  console.log(req.body.ip_client);
  console.log(req.body.commande);

  var ip_client = req.body.ip_client;

  let response = {};
  response.ip = ip_client;
  response.command = req.body.commande;
  
  io.sockets.emit("data_send", response);
  res.send({});
});

app.post("/chenillar", function(req, res, next) {
  
    let response = {};
  switch(req.body.commande)
  {
    case "on_off_chen" :
    console.log("bouton chen");
    console.log(req.body);

    console.log(req.body.ip_client);
    console.log(req.body.commande);
    console.log(req.body.val);
    var ip_client = req.body.ip_client;
    
    response.ip = ip_client;
    response.command = req.body.commande;
    response.value = req.body.val;
    console.log(response);

    io.sockets.emit("data_send", response);
    res.send({});
    break;

    case "inverser_chenillar":
    console.log("inv chen");

    console.log(req.body);

    console.log(req.body.ip_client);
    console.log(req.body.commande);
    
    var ip_client = req.body.ip_client;
    
    response.ip = ip_client;
    response.command = req.body.commande;
    console.log(response);

    io.sockets.emit("data_send", response);
    res.send({});
    break;
    
  }
   
});


app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(__dirname + "/404.html"));
});

app.use(function(req, res, next) { 
    res.header('Access-Control-Allow-Origin', "*"); 
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    next(); 
    })
httpServer.listen(3000);
