const express = require("express"); 
const http = require("http");

const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
var knx = require('knx');

const ip = require("ip");
const so = require("socket.io");

const myIP = ip.address();

var temps = 1000;
var set_chenillar=[1,2,3,4];
var set_chenillar_inverse=[4,3,2,1];
var chen = set_chenillar;
var bool_chen=1;
var i=1;

var test=0;


const app = express();
const httpServer = http.createServer(app);

const io = so.listen(httpServer);

var myMaquette = [['192.168.0.5',1000,true,set_chenillar],['192.168.0.6',1000,true,set_chenillar],['192.168.0.10',1000,true,set_chenillar]];
//ip, temps, bool_chen, chen = set_chenillar, 

process.stdin.on('data',(data) =>{
  dat = data.toString().trim();
  console.log(dat);
  switch(dat){
    case "disconect":
    connection.Disconnect();
    process.exit();
    console.log("bye bye");
    break;

    case "on":
    start_lampe(1);
    start_lampe(2);
    start_lampe(3);
    start_lampe(4);
    break;

    case "off":
    down_lampe(1);
    down_lampe(2);
    down_lampe(3);
    down_lampe(4);
    break;

    case "chen":
      bool_chen=1;
      chenilar();
      console.log("hello chen");
    break;

    case "stop_chen":
      bool_chen=0;
      console.log("hello stop");
    break;

    case "lampe":
      console.log("status lampe");
      test=1;
      readall();
      
    break;

    case "lampe":
      console.log("status lampe");
      test = 2;
      readall();
      
    break;

    default:
      console.log("impossible request");
    break;
  }

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);


io.on("connection", function(socket) {
      let response = {};
      response.command = "sync";
      socket.emit("reconnection", response);

      socket.on("ip", function(data) {
        console.log(data);
        console.log(data.command);
         try {
          switch (data.command) {

            case "etat_lampe":
              let respon ={};
              respon.command = "bonjour";
              console.log(respon);
              socket.to('myMaquette').emit("reconncetion",respon);
              console.log("de");
              break;

            case "send_ip":
              myMaquette.push(data.ip);
              function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
              myMaquette = myMaquette.filter(onlyUnique);
              console.log("Connexion maquette !");
              console.log(myMaquette);
              socket.emit("configPage", myMaquette);
              break;

            case "update_lampe":
              response.command = "update_lampe";
              console.log(data.tab_lampe);
              response.data = data.tab_lampe;
              socket.emit("Lampe",response);
              console.log("de");
              break;

            case "lampe":
              response.command = "up_lampe";
              response.value = data.value;
              response.lampe = data.lampe;
              function sockt() {
                io.sockets.emit("Lampe",response);
              }
              sockt();
              console.log("de");
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



app.use(express.static(__dirname + "/views/"));
app.use(express.static(__dirname + "/node_modules/"));

  app
  //page d'acceuil
  .get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/views/index.html"));
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

app.post("/etat_lampe",function(req,res, next){
  
         let response ={};
         response.command = req.body.commande;
         console.log(response);
         io.sockets.emit("data_send", response);
         
});

app.post("/lampe",function(req,res, next){
  
  let response ={};
  response.command = req.body.commande;
  response.lampe = req.body.lampe_nb;
  response.value = req.body.value;
  console.log(response);
  io.sockets.emit("data_send", response);
  
  
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

app.use(
  "/socketio",express.static(__dirname + "/node_modules/socket.io-client/dist")
);

app.use(
  "/ip",express.static(__dirname + "/node_modules/")
);

app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(__dirname + "/404.html"));
});

app.use(function(req, res, next) { 
    res.header('Access-Control-Allow-Origin', "*"); 
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    next(); 
    });


    function start_lampe(nb)
    {
        let resp={};
        connection.write("0/1/"+nb, 1);
        resp.command="lampe";
        resp.lampe=nb;
        resp.value="1";
        socket.emit("ip",resp);
    }
    
    function down_lampe(nb)
    {
        let resp={};
        connection.write("0/1/"+nb, 0);
        resp.command="lampe";
        resp.lampe=nb;
        resp.value="0";
        socket.emit("ip",resp);
    }
    
    function sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function chenilar()
    {
        while(1){
            start_lampe(chen[0]);
            await sleep(temps);
            down_lampe(chen[0]);
            start_lampe(chen[1]);
            await sleep(temps);
            down_lampe(chen[1]);
            start_lampe(chen[2]);
            await sleep(temps);
            down_lampe(chen[2]);
            start_lampe(chen[3]);
            await sleep(temps);
            down_lampe(chen[3]);
        }
    
    }
    async function chenilar_2()
    {
        while(1 || bool_chen){
            start_lampe(chen[i]);
            await sleep(temps);
            down_lampe(chen[i]);
            if(i>=4){i=1;}else{i++;}
        }
           
    }
    
    function read(type,num)
    {
      connection.read("1/"+type+"/"+num, function (response) 
      {
        console.log("KNX response: %j", response);
        return response;
      });
    }
    
    function readall()
    { var tableau = [];
     // socket.emit("ip","helloe");
      for(a=1;a<=4;a++)
      {
        connection.read("1/1/"+a, function (response)
        {
          console.log("KNX response: %j", response);
          tableau.push(response); 
        });
      }
      if(tableau.length == 0)
      {
        if(test==1){
          console.log("test");
          tableau = [1,0,1,0]; 
        }else{
          console.log("test2");
        tableau = [1,0,1,1]; 
        }
        let response = {};
        response.command = "update_lampe";
        response.tab_lampe = tableau;
        socket.emit("ip",response);
      }
      else{
        let response = {};
        response.command = "update_lampe";
        response.tab_lampe = tableau;
        socket.emit("ip",response);
      }
    }
    
    

    var connection = new knx.Connection( {
        // ip address and port of the KNX router or interface
        ipAddr: '192.168.0.10', ipPort: 3671,
        
        handlers: {
          // wait for connection establishment before sending anything!
          connected: function() {
            console.log('Hurray, I can talk KNX!');
            // WRITE an arbitrary boolean request to a DPT1 group address
            readall();
            //chenilar();
            
          },
          // get notified for all KNX events:
          event: function(evt, src, dest, value) { console.log(
              "event: %s, src: %j, dest: %j, value: %j",
              evt, src, dest, value
            );
            if(dest == "0/3/1")
            {
              console.log("down bouton");
              if(temps == 500)
              {
                temps = 1000;
              }else{
                temps = temps -100;
              }
              console.log("time: "+temps);
            }
            if(dest == "0/3/2")
            {
              console.log("up bouton");
              if(temps == 1500)
              {
                temps = 1000;
              }else{
                temps = temps + 100;
              }
              console.log("time: "+temps);
            }
    
            if(dest == "0/3/3"){
              console.log("yello");
              if(chen === set_chenillar)
              {
                chen = set_chenillar_inverse;
              }else if(chen === set_chenillar_inverse)
              {
                chen = set_chenillar;
              }
            }
    
            if(dest == "0/3/4"){
              console.log("arret on");
              if(bool_chen == 0){
                chenilar();
                bool_chen = !bool_chen;
              }else{bool_chen = !bool_chen;}
              console.log("chenilar: "+bool_chen);
            }
          },
          // get notified on connection errors
          error: function(connstatus) {
            console.log("**** ERROR: %j", connstatus);
          }
        }
    });
    
/*socket.on("data_send", function(data) {
  console.log(data);
  let response = {};
  response.command = "send_ip";
  response.ip = myIP;
  switch (data.command) {

    case "lampe_onoff":
       c = data.lampe;
       valu = data.value;
       console.log(c + "    "+valu);
       break;

    case "diminuer":
        console.log("down web");
          if(temps == 500)
          {
            temps = 1000;
            console.log(temps);
        }else{
            temps = temps -100;
            console.log(temps);
          }
        console.log("time: "+temps);
        break;

    case "augmenter":
        console.log("up web ");
        if(temps == 1500)
          {
            temps = 1000;
            console.log(temps);
        }else{
            temps = temps + 100;
            console.log(temps);
          }
        console.log("time: "+temps);
        break;

    case "inverser_chenillar":
        console.log("invers web ");
        if(chen === set_chenillar)
        {
          chen = set_chenillar_inverse;
        }else if(chen === set_chenillar_inverse)
        {
          chen = set_chenillar;
        }
        console.log("chenillar: "+chen);
        break;

    case "on_off_chen":
        console.log("on_stop web ");
        if(bool_chen == 0){
          chenilar();
          bool_chen = !bool_chen;
        }else{bool_chen = !bool_chen;}
        
        console.log("chenilar: "+bool_chen);
        break;

    case "bonjour":
        console.log("helmkojfdn");
        readall();
        break;

    default:
      console.log("Command not supported..");
      break;*/












httpServer.listen(3000);
