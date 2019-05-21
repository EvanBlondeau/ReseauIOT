const express = require("express"); 
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const so = require("socket.io");

const { exec } = require('child_process');


const app = express();
const httpServer = http.createServer(app);

const io = so.listen(httpServer);

var myMaquette = [];
var myMaquette_non_connecter = [];

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

           /* case "script_maq":
              var maq = script_maquette_detection();
              console.log(maq);
              let rs={};
              rs.ip=maq;
              break;*/

              case "act_chen":
              let responf ={};
              responf.command = "active_chen";
              console.log(responf);
              io.sockets.emit("data_send",responf);
              break;
              
              case "activer_chen":
              let respons={};
              respons.ip=data.ip;
              respons.command="activer_chen";
              respons.value=data.value;
              io.sockets.emit("Lampe", respons);
              break;

              case "script_maq":
              var maq = myMaquette_non_connecter;
              console.log(maq);
              let rs={};
              rs.ip=maq;
              rs.command="select_maq";
              io.sockets.emit("Lampe",rs);
              break;

            case "send_ip":
              myMaquette.push(data.ip);
              function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
              myMaquette = myMaquette.filter(onlyUnique);
              console.log("Connexion maquette uppp !");
              console.log(myMaquette);
              let resp = {};
              resp.ip_maquette=myMaquette;
              resp.command = "ip_maquette";
              io.sockets.emit("Lampe", resp);
              break;

            case "update_lampe":
              response.command = "update_lampe";
              console.log(data.tab_lampe);
              response.lampe=data.ip;
              response.data = data.tab_lampe;
              socket.emit("Lampe",response);
              console.log("de");
              break;

            case "lampe":
              console.log("je suis arrivé ici");
              response.command = "up_lampe";
              response.ip_maquette = data.ip;
              response.value = data.value;
              response.lampe = data.lampe;
              io.sockets.emit("Lampe",response);
              console.log("de");
              break;

            case "ip_maquette_req":
              let rep={};
              rep.command = "ip_maquette";
              rep.ip_maquette = myMaquette;
              console.log(myMaquette);
              io.sockets.emit("Lampe",rep);
              break;

            case "time_maq":
              let redp={};
              redp.ip_maquette = data.ip;
              redp.command = data.command;
              redp.value=data.value;
              console.log(myMaquette);
              io.sockets.emit("Lampe",redp);
              break;
          
            default:
              console.log("Command not supported..");
          }
        } catch (err) {
          console.log(err);
          console.log("Error parse JSON..");
        }
      }); 



      socket.on("disconnect", function(data) {
        console.log("hello bande de putes");
       /* let ip_camera_disco = socket.request.connection._peername.address.split(
          ":"
        )[3];
        console.log(
          "IP de la maquette déconnectée : " + ip_camera_disco
        );*/
        var cam_up = new Promise(function(resolve, reject) {
          myMaquette=[];
          let response = {};
          response.command = "sync";
          try{
          io.sockets.emit("reconnection", response);
          }catch(e){}
          resolve("sucess");
        });
        cam_up.then(function() {
          console.log(myMaquette.length);
          if(myMaquette.length===0){
            let resp = {};
            resp.ip_maquette=myMaquette;
            resp.command = "ip_maquette";
            io.sockets.emit("Lampe", resp);
          }
        });
          

        /* let resp = {};
          resp.ip_maquette=myMaquette;
          resp.command = "ip_maquette";
          io.sockets.emit("Lampe", resp);

          */
       
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


app.post("/new_chennillar", function(req, res, next) {
    console.log("Test du boutton");
    console.log(req.body);
    console.log(req.body.ip_client);
    console.log(req.body.commande);
    console.log(req.body.valeur_chen);
    console.log(req.body.valeur_inv);
    let response = {};
    response.ip = req.body.ip_client;
    response.command = req.body.commande;
    response.valeur = req.body.valeur_chen;
    response.valeurinv = req.body.valeur_inv;
    io.sockets.emit("data_send", response);
    res.send({});
});
  


app.post("/change_time", function(req, res, next) {
  console.log("Test du boutton");
  console.log(req.body);
  console.log(req.body.ip_client);
  console.log(req.body.commande);
  console.log(req.body.value);
  let response = {};
  response.ip = req.body.ip_client;
  response.command = req.body.commande;
  response.value = req.body.value;
  io.sockets.emit("data_send", response);
  res.send({});
});

app.post("/etat_lampe",function(req,res, next){
         let response ={};
         response.command = req.body.commande;
         console.log(response);
         io.sockets.emit("data_send", response);
         res.send({});     
});

app.post("/deconnection",function(req,res, next){
  let response ={};
  response.ip = req.body.ip_client;
  response.command = req.body.commande;
  console.log(response);
  io.sockets.emit("data_send", response);
  res.send({});
});


app.post("/lampe",function(req,res, next){
  let response ={};
  response.ip=req.body.ip_client;
  response.command = req.body.commande;
  response.lampe = req.body.lampe_nb;
  response.value = req.body.value;
  console.log(response);
  io.sockets.emit("data_send", response);
  res.send({});
});

app.post("/multi_chenillar",function(req,res, next){
    res.send({});
    console.log(req.body.ip_1);
    console.log(req.body.ip_2);
    console.log(req.body.valeur);
    console.log(req.body.time);

  if(req.body.commande==="multi_chen"){
    console.log("ttt");
    chen_multi_maquette(req.body.ip_1,req.body.ip_2,req.body.valeur,req.body.time);
  }
});

async function chen_multi_maquette(ip1,ip2,tab_chen,tim)
{
  let response={};
    for(var p=0;p<tab_chen.length;p++){
      if(tab_chen[p]<5)
      {
        console.log("ggggg");
        response={};
        response.ip=ip1;
        response.command = "lampe_onoff";
        response.lampe = tab_chen[p];
        response.value = 1;
        console.log(response);
        io.sockets.emit("data_send", response);
        await sleep(tim);
        response ={};
        response.ip=ip1;
        response.command = "lampe_onoff";
        response.lampe = tab_chen[p];
        response.value = 0;
        console.log(response);
        io.sockets.emit("data_send", response);
      }else{
        console.log("ddd");
        response ={};
        response.ip=ip2;
        response.command = "lampe_onoff";
        response.lampe = (tab_chen[p]-4);
        response.value = 1;
        console.log(response);
        io.sockets.emit("data_send", response);
        await sleep(tim);
        response ={};
        response.ip=ip2;
        response.command = "lampe_onoff";
        response.lampe = (tab_chen[p]-4);
        response.value = 0;
        console.log(response);
        io.sockets.emit("data_send", response);
      }
    }
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

var o = 0
app.post("/connection",function(req,res,next){
  console.log("hello");
  let port =o+8000;
  o++;
  console.log(port);
  let ip_m = req.body.ip_client;
  exec('nodejs knx.js '+ip_m+' '+port, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      // node couldn't execute the command
      return;
    }
    // the *entire* stdout and stderr (buffered)
  });
  res.send({});
})

app.post("/search",function(req,res, next){
  res.send({});

if(req.body.commande==="search_maq"){
  console.log("masqq");
  
  script_maquette_detection();
}
});

function script_maquette_detection(){

  var d  = new Promise(function (resolve, reject) {
    exec("sudo nmap --script knx-gateway-discover -e wlan0", (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({stdout});
      }
    });
  });
  d.then(function(res){
    let tryd = JSON.parse(JSON.stringify(res));
    let dd = tryd.stdout;
    console.log(dd);
    let ff = dd.split("knx-gateway-discover:");
    console.log(ff[1]);
    let tab_ma=[];
    let ip_n = ff[1].split('|');
    for(g=1;g<ip_n.length;g=g+14){
      console.log(g);
      try{
        let ty = ip_n[g].trim();
        let pus = ty.split(':');
        console.log(pus[0].length);
        if((pus[0].length)<(16))
        {
          tab_ma.push(pus[0]);
        }
        
      }catch(e){
        break;
      }
    }
    console.log(tab_ma);

    myMaquette_non_connecter = tab_ma;

    let rs={};
    rs.ip=myMaquette_non_connecter;
    rs.command="select_maq";
    io.sockets.emit("Lampe",rs);
    
  });

  
  
}

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

     // console.log(req.body);
      
      response.ip = req.body.ip_client;
      response.command = req.body.commande;
      response.valeur=req.body.valeur;

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
  res.status(404).sendFile(path.join(__dirname + "/views/404.html"));
});

app.use(function(req, res, next) { 
    res.header('Access-Control-Allow-Origin', "*"); 
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    next(); 
    })



    var BluetoothHciSocket = require('bluetooth-hci-socket');
    var player = require('play-sound')(opts = {});
    
    var bluetoothHciSocket = new BluetoothHciSocket();
    
    
    var audio;
    var i = 0;
    bluetoothHciSocket.on('data', function(data) {
      // console.log('data: ' + data.toString('hex') + ', ' + data.length + ' bytes');
    
      buf=data.toString('hex');
    
      dPad = buf[5] & 15;
      leftAnalogX= buf[1];
      leftAnalogY= buf[2];
      rightAnalogX= buf[3];
      rightAnalogY= buf[4];
      l2Analog= buf[8];
      r2Analog= buf[9];
    
      dPadUp=    dPad === 0 || dPad === 1 || dPad === 7;
      dPadRight= dPad === 1 || dPad === 2 || dPad === 3;
      dPadDown=  dPad === 3 || dPad === 4 || dPad === 5;
      dPadLeft=  dPad === 5 || dPad === 6 || dPad === 7;
    
      cross= (buf[5] & 32) !== 0;
      circle= (buf[5] & 64) !== 0;
      square= (buf[5] & 16) !== 0;
      triangle= (buf[5] & 128) !== 0;
      l1= (buf[6] & 0x01) !== 0;
      l2= (buf[6] & 0x04) !== 0;
      r1= (buf[6] & 0x02) !== 0;
      r2= (buf[6] & 0x08) !== 0;
      l3= (buf[6] & 0x40) !== 0;
      r3= (buf[6] & 0x80) !== 0;
    
      share= (buf[6] & 0x10) !== 0;
      options= (buf[6] & 0x20) !== 0;
      trackPadButton= (buf[7] & 2) !== 0;
      psButton= (buf[7] & 1) !== 0;
    
      // ACCEL/GYRO
    
    
      // TRACKPAD
      var trackPadTouch0Id= buf[35] & 0x7f; //croix num
      trackPadTouch0Active= (buf[35] >> 7) === 0;
      trackPadTouch0X= ((buf[37] & 0x0f) << 8) | buf[36]; //r1 r2 l1 l2
      trackPadTouch0Y= buf[38] << 4 | ((buf[37] & 0xf0) >> 4);
    
      trackPadTouch1Id= buf[39] & 0x7f;
      trackPadTouch1Active= (buf[39] >> 7) === 0;
      trackPadTouch1X= ((buf[41] & 0x0f) << 8) | buf[40];
      trackPadTouch1Y= buf[42] << 4 | ((buf[41] & 0xf0) >> 4);
    
      timestamp= buf[7] >> 2;
      battery= buf[12];
      //batteryShort1: buf[12] & 0x0f,
      //batteryShort2: buf[12] & 0xf0,
      //batteryLevel= buf[12]});
      
      if((trackPadTouch0Id === 2 )&&(i==0)){
        i++;
        //objet = JSON.stringify({ip_client:ip_maquette, commande:"on_off_chen",val:true});
        
        response={};
        response.ip = myMaquette[0];
        response.command = "on_off_chen";
        response.value = true;
        console.log(response);

        io.sockets.emit("data_send", response);

        
      }else if(trackPadTouch0Id === 4){
        i=0;
        response={};
        response.ip = myMaquette[0];
        response.command = "on_off_chen";
        response.value = false;
        console.log(response);

        io.sockets.emit("data_send", response);
       
      }
    /*console.log({
      trackPadTouch0Id,
      trackPadTouch0X
    });*/
    /*leftAnalogX: buf[1],
      leftAnalogY: buf[2],
      rightAnalogX: buf[3],
      rightAnalogY: buf[4],
      l2Analog: buf[8],
      r2Analog: buf[9],
    
      dPadUp:    dPad === 0 || dPad === 1 || dPad === 7,
      dPadRight: dPad === 1 || dPad === 2 || dPad === 3,
      dPadDown:  dPad === 3 || dPad === 4 || dPad === 5,
      dPadLeft:  dPad === 5 || dPad === 6 || dPad === 7,
    
      cross: (buf[5] & 32) !== 0,
      circle: (buf[5] & 64) !== 0,
      square: (buf[5] & 16) !== 0,
      triangle: (buf[5] & 128) !== 0,
    
      l1: (buf[6] & 0x01) !== 0,
      l2: (buf[6] & 0x04) !== 0,
      r1: (buf[6] & 0x02) !== 0,
      r2: (buf[6] & 0x08) !== 0,
      l3: (buf[6] & 0x40) !== 0,
      r3: (buf[6] & 0x80) !== 0,
    
      share: (buf[6] & 0x10) !== 0,
      options: (buf[6] & 0x20) !== 0,
      trackPadButton: (buf[7] & 2) !== 0,
      psButton: (buf[7] & 1) !== 0,
    
      // ACCEL/GYRO
    
    
      // TRACKPAD
      trackPadTouch0Id: buf[35] & 0x7f,
      trackPadTouch0Active: (buf[35] >> 7) === 0,
      trackPadTouch0X: ((buf[37] & 0x0f) << 8) | buf[36],
      trackPadTouch0Y: buf[38] << 4 | ((buf[37] & 0xf0) >> 4),
    
      trackPadTouch1Id: buf[39] & 0x7f,
      trackPadTouch1Active: (buf[39] >> 7) === 0,
      trackPadTouch1X: ((buf[41] & 0x0f) << 8) | buf[40],
      trackPadTouch1Y: buf[42] << 4 | ((buf[41] & 0xf0) >> 4),
    
      timestamp: buf[7] >> 2});
      //battery: buf[12],
      //batteryShort1: buf[12] & 0x0f,
      //batteryShort2: buf[12] & 0xf0,
    //batteryLevel: buf[12]});
      
      //console.log({r1: (buf[6] & 0x02) !== 0,
       // r2: (buf[6] & 0x08) !== 0,});
      /*
      console.log({
        leftAnalogX: buf[1],
        leftAnalogY: buf[2],
        rightAnalogX: buf[3],
        rightAnalogY: buf[4],
        l2Analog: buf[8],
        r2Analog: buf[9],
    
        dPadUp: buf[5] === 0 || buf[5] === 1 || buf [5] === 7,
        dPadRight: buf[5] === 1 || buf[5] === 2 || buf [5] === 3,
        dPadDown: buf[5] === 3 || buf[5] === 4 || buf [5] === 5,
        dPadLeft: buf[5] === 5 || buf[5] === 6 || buf [5] === 7,
    
        x: (buf[5] & 32) !== 0,
        cricle: (buf[5] & 64) !== 0,
        square: (buf[5] & 16) !== 0,
        triangle: (buf[5] & 128) !== 0,
    
        l1: (buf[6] & 0x01) !== 0,
        l2: (buf[6] & 0x04) !== 0,
        r1: (buf[6] & 0x02) !== 0,
        r2: (buf[6] & 0x08) !== 0,
        l3: (buf[6] & 0x40) !== 0,
        r3: (buf[6] & 0x80) !== 0,
    
        share: (buf[6] & 0x10) !== 0,
        options: (buf[6] & 0x20) !== 0,
        trackPadButton: (buf[7] & 2) !== 0,
        psButton: (buf[7] & 1) !== 0,
    
        //// usb only, doesn't work via bluetooth
        //// GYRO
        // TODO
        //// TRACKPAD
        trackPadTouch0Id: buf[35] & 0x7f,
        trackPadTouch0Active: (buf[35] >> 7) === 0,
        trackPadTouch0X: ((buf[37] & 0x0f) << 8) | buf[36],
        trackPadTouch0Y: buf[38] << 4 | ((buf[37] & 0xf0) >> 4),
    
        trackPadTouch1Id: buf[39] & 0x7f,
        trackPadTouch1Active: (buf[39] >> 7) === 0,
        trackPadTouch1X: ((buf[41] & 0x0f) << 8) | buf[40],
        trackPadTouch1Y: buf[42] << 4 | ((buf[41] & 0xf0) >> 4),
    
        timestamp: buf[7] >> 2,
        battery: buf[12],
        batteryShort1: buf[12] & 0x0f,
        batteryShort2: buf[12] & 0xf0,
      });*/
    
      if (data.readUInt8(0) === HCI_EVENT_PKT) {
        if (data.readUInt8(1) === EVT_DISCONN_COMPLETE) {
          var status = data.readUInt8(3);
          var handle = data.readUInt16LE(4);
          var reason = data.readUInt8(6);
    
          console.log('Disconn Complete');
          console.log('\t' + status);
          console.log('\t' + handle);
          console.log('\t' + reason);
    
          process.exit(0);
        } else if (data.readUInt8(1) === EVT_LE_META_EVENT) {
          if (data.readUInt8(3) === EVT_LE_CONN_COMPLETE) { // subevent
            var status = data.readUInt8(4);
            var handle = data.readUInt16LE(5);
            var role = data.readUInt8(7);
            var peerBdAddrType = data.readUInt8(8);
            var peerBdAddr = data.slice(9, 15);
            var interval = data.readUInt16LE(15);
            var latency = data.readUInt16LE(17);
            var supervisionTimeout = data.readUInt16LE(19);
            var masterClockAccuracy = data.readUInt8(21);
    
            console.log('LE Connection Complete');
            console.log('\t' + status);
            console.log('\t' + handle);
            console.log('\t' + role);
            console.log('\t' + ['PUBLIC', 'RANDOM'][peerBdAddrType]);
            console.log('\t' + peerBdAddr.toString('hex').match(/.{1,2}/g).reverse().join(':'));
            console.log('\t' + interval * 1.25);
            console.log('\t' + latency);
            console.log('\t' + supervisionTimeout * 10);
            console.log('\t' + masterClockAccuracy);
          } else if (data.readUInt8(3) === EVT_LE_CONN_UPDATE_COMPLETE) {
            var status = data.readUInt8(4);
            var handle = data.readUInt16LE(5);
            var interval = data.readUInt16LE(7);
            var latency = data.readUInt16LE(9);
            var supervisionTimeout = data.readUInt16LE(11);
    
            console.log('LE Connection Update Complete');
            console.log('\t' + status);
            console.log('\t' + handle);
    
            console.log('\t' + interval * 1.25);
            console.log('\t' + latency);
            console.log('\t' + supervisionTimeout * 10);
    
            writeHandle(handle, new Buffer('020001', 'hex'));
          }
        }
      } else if (data.readUInt8(0) === HCI_ACLDATA_PKT) {
        if ( ((data.readUInt16LE(1) >> 12) === ACL_START) &&
              (data.readUInt16LE(7) === ATT_CID) ) {
    
          var handle = data.readUInt16LE(1) & 0x0fff;
          var data = data.slice(9);
    
          console.log('ACL data');
          console.log('\t' + handle);
          console.log('\t' + data.toString('hex'));
    
        // disconnectConnection(handle, HCI_OE_USER_ENDED_CONNECTION);
        }
      }
    });
    
    bluetoothHciSocket.on('error', function(error) {
      // TODO: non-BLE adaptor
    
      if (error.message === 'Network is down') {
        console.log('bluetooth = powered off');
      } else {
        console.error(error);
      }
    });
    
    var HCI_COMMAND_PKT = 0x01;
    var HCI_ACLDATA_PKT = 0x02;
    var HCI_EVENT_PKT = 0x04;
    
    var ACL_START = 0x02;
    
    var ATT_CID = 0x0004;
    
    var EVT_DISCONN_COMPLETE = 0x05;
    var EVT_CMD_COMPLETE = 0x0e;
    var EVT_CMD_STATUS = 0x0f;
    var EVT_LE_META_EVENT = 0x3e;
    
    var EVT_LE_CONN_COMPLETE = 0x01;
    var EVT_LE_CONN_UPDATE_COMPLETE = 0x03;
    
    var OGF_LE_CTL = 0x08;
    var OCF_LE_CREATE_CONN = 0x000d;
    
    var OGF_LINK_CTL = 0x01;
    var OCF_DISCONNECT = 0x0006;
    
    var LE_CREATE_CONN_CMD = OCF_LE_CREATE_CONN | OGF_LE_CTL << 10;
    var DISCONNECT_CMD = OCF_DISCONNECT | OGF_LINK_CTL << 10;
    
    var HCI_SUCCESS = 0;
    var HCI_OE_USER_ENDED_CONNECTION = 0x13;
    
    function setFilter() {
      var filter = new Buffer(14);
      var typeMask = (1 << HCI_EVENT_PKT) | (1 << HCI_ACLDATA_PKT);
      var eventMask1 = (1 << EVT_DISCONN_COMPLETE) | (1 << EVT_CMD_COMPLETE) | (1 << EVT_CMD_STATUS);
      var eventMask2 = (1 << (EVT_LE_META_EVENT - 32));
      var opcode = 0;
    
      filter.writeUInt32LE(typeMask, 0);
      filter.writeUInt32LE(eventMask1, 4);
      filter.writeUInt32LE(eventMask2, 8);
      filter.writeUInt16LE(typeMask, 12);
    
      bluetoothHciSocket.setFilter(filter);
    }
    
    bluetoothHciSocket.bindRaw();
    setFilter();
    bluetoothHciSocket.start();
    
    function createConnection(address, addressType) {
      var cmd = new Buffer(29);
    
      // header
      cmd.writeUInt8(HCI_COMMAND_PKT, 0);
      cmd.writeUInt16LE(LE_CREATE_CONN_CMD, 1);
    
      // length
      cmd.writeUInt8(0x19, 3);
    
      // data
      cmd.writeUInt16LE(0x0060, 4); // interval
      cmd.writeUInt16LE(0x0030, 6); // window
      cmd.writeUInt8(0x00, 8); // initiator filter
    
      cmd.writeUInt8(addressType === 'random' ? 0x01 : 0x00, 9); // peer address type
      (new Buffer(address.split(':').reverse().join(''), 'hex')).copy(cmd, 10); // peer address
    
      cmd.writeUInt8(0x00, 16); // own address type
    
      cmd.writeUInt16LE(0x0028, 17); // min interval
      cmd.writeUInt16LE(0x0038, 19); // max interval
      cmd.writeUInt16LE(0x0000, 21); // latency
      cmd.writeUInt16LE(0x002a, 23); // supervision timeout
      cmd.writeUInt16LE(0x0000, 25); // min ce length
      cmd.writeUInt16LE(0x0000, 27); // max ce length
    
      bluetoothHciSocket.write(cmd);
    }
    
    function writeHandle(handle, data) {
      var cmd = new Buffer(9 + data.length);
    
      // header
      cmd.writeUInt8(HCI_ACLDATA_PKT, 0);
      cmd.writeUInt16LE(handle, 1);
      cmd.writeUInt16LE(data.length + 4, 3); // data length 1
      cmd.writeUInt16LE(data.length, 5); // data length 2
      cmd.writeUInt16LE(ATT_CID, 7);
    
      data.copy(cmd, 9);
    
      bluetoothHciSocket.write(cmd);
    }
    
    /*function disconnectConnection(handle, reason) {
      var cmd = new Buffer(7);
    
      // header
      cmd.writeUInt8(HCI_COMMAND_PKT, 0);
      cmd.writeUInt16LE(DISCONNECT_CMD, 1);
    
      // length
      cmd.writeUInt8(0x03, 3);
    
      // data
      cmd.writeUInt16LE(handle, 4); // handle
      cmd.writeUInt8(reason, 6); // reason
    
      bluetoothHciSocket.write(cmd);
    }*/
    
    createConnection('dc:0b:86:95:e8:a5', 'random');


httpServer.listen(3000);
