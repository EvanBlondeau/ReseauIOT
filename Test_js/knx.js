var knx = require('knx');

const http = require("http");
const ip = require("ip");
const io = require("socket.io-client");

const server = http.createServer();
const myIP = ip.address();
var player = require('play-sound')(opts = {});

var temps = 1000;
var set_chenillar=[1,2,3,4];
var set_chenillar_inverse=[4,3,2,1];
var chen = set_chenillar;
var bool_chen=true;
var i=0;

var test=0;
var tout_lampe=true;

var maquette= process.argv[2];
var listen =process.argv[3];

console.log(process.argv[2]);
console.log(process.argv[3]);

var socket;

//lancer manip en ligne de commande
process.stdin.on('data',(data) =>{
  
  dat = data.toString().trim();
  switch(dat){
    case "disconect":
    connection.Disconnect();
    process.exit();
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
      bool_chen=true;
      chenilar_jurasik();
    break;

    case "stop_chen":
      bool_chen=false;
    break;

    default:
      console.log("impossible request");
    break;
  }

});

function start_lampe(nb)
{
    let resp={};
    connection.write("0/1/"+nb, 1);
}

function down_lampe(nb)
{
    let resp={};
    connection.write("0/1/"+nb, 0);
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function chenilar_2()
{
    while(bool_chen){
        start_lampe(chen[i]);
        await sleep(temps);
        down_lampe(chen[i]);
        if(i>=3){i=0;}else{i++;}
    }
}

var audio;
tab_jurasik=[1,2,3,4,5,6,7,8,9];
async function chenilar_jurasik()
{   let id=0;
    bool_chen=true;
    while(bool_chen){
      switch(id){
        case 9:
        break;
        case 8:
        break;
        case 7:
        start_lampe(1);
        start_lampe(3);
        break;
        case 6:
        start_lampe(2);
        start_lampe(4);
        break;
        case 5:
        start_lampe(1);
        start_lampe(3);
        break;
        default:
        start_lampe(tab_jurasik[id]);
        break;
      }
      audio = player.play('hbo_'+tab_jurasik[id]+'.mp3', function(err){
        if (err && !err.killed) console.log(err);
      });  
      await sleep(1750);
      switch(id){
        case 7:
        down_lampe(1);
        down_lampe(2);
        down_lampe(3);
        down_lampe(4);
        break;
        case 6:
        break;
        case 5:
        down_lampe(1);
        down_lampe(3);
        break;
        case 8:
        start_lampe(1);
        start_lampe(2);
        start_lampe(3);
        start_lampe(4);
        break;
        default:
        down_lampe(tab_jurasik[id]);
        break;
      }
      down_lampe(tab_jurasik[id]);
      id++;
      try{
        audio.kill();
       }catch(e){
         console.log("hello"+e);
       }
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
    let response = {};
    response.command = "update_lampe";
    response.tab_lampe = tableau;
    socket.emit("ip",response);
}



var connection = new knx.Connection( {
    // ip address and port of the KNX router or interface '192.168.0.10'
    ipAddr: maquette, ipPort: 3671,

    handlers: {
      // wait for connection establishment before sending anything!
      connected: function() {

          socket = io.connect(
            "http://localhost:3000"
          );
          let response = {};
          response.command = "send_ip";
          response.ip = maquette;

          // Emission 
          socket.emit("ip", response);

          // Pour la reconnexion (échange des adresses IP avec le serveur)
    socket.on("reconnection", function(data) {
          console.log(data);
          let response = {};
          response.command = "send_ip";
          response.ip = maquette;
          switch (data.command) {
          case "sync":
          socket.emit("ip", response);
          break;
          default:  
          console.log("Command not supported..");
          }
          });

    socket.on("data_send", function(data) {
          console.log(data);
          if(data.ip===maquette){

          switch (data.command) {

          case "lampe_onoff":
          lam = data.lampe;
          valu = data.value;
          if(lam === 'all'){
            if(valu === 1)
            {
              start_lampe(1);
              start_lampe(2);
              start_lampe(3);
              start_lampe(4);
            }else if(valu === 0){
              down_lampe(1);
              down_lampe(2);
              down_lampe(3);
              down_lampe(4);
            }
          }else {
              if(valu === 1)
              {
                start_lampe(lam);
              }else if(valu === 0){
                down_lampe(lam);
              }
          }
          break;

          case "time":
            temps=data.value;
            let resp = {};
            resp.ip=maquette;
            resp.command="time_maq";
            resp.value=temps;
            socket.emit("ip",resp);
            console.log(resp);
            break;

          case "inverser_chenillar":
            if(chen === set_chenillar)
            {
              chen = set_chenillar_inverse;
            }else if(chen === set_chenillar_inverse)
            {
              chen = set_chenillar;
            }
            break;

          case "on_off_chen":
            if(data.value === true){
              bool_chen = true;
              chenilar_2();
            }else{bool_chen = false;}
            break;

          case "disc":
            connection.Disconnect();
            process.exit();
            break;

          case "bonjour":
            readall();
            break;

          case "new_chennillar":
              chen = data.valeur;
              set_chenillar = data.valeur ;
              set_chenillar_inverse = data.valeurinv;
              console.log("chénillar: "+chen);
          break;

           case "chenillar_hbo":
           if(data.value==1){
           bool_chen=true;
           chenilar_jurasik();
           console.log("chénillar: "+chen)
           } 
            break;

          default:
          console.log("Command not supported..");
          break;
          }
          }else{
          switch(data.command)
          {
          case "active_chen":
            let respon={};
            respon.ip=maquette;
            respon.command="activer_chen";
            respon.value=bool_chen;
            console.log(respon);
            socket.emit("ip", respon);
            break;
          }
          }
          });

        console.log('Hurray, I can talk KNX!');
      },
      // get notified for all KNX events:
      event: function(evt, src, dest, value) { console.log(
          "event: %s, src: %j, dest: %j, value: %j",
          evt, src, dest, value
        );
        if(dest == "0/2/1"){
          //{ type: 'Buffer', data: [ 1 ] }
          let obj = JSON.parse(JSON.stringify(value));
          let resp={};
          resp.ip=maquette;
          resp.command="lampe";
          resp.lampe=1;
          resp.value=obj.data[0];
          socket.emit("ip",resp);
        }
        if(dest == "0/2/2"){
          obj = JSON.parse(JSON.stringify(value));
          let resp={};
          resp.ip=maquette;
          resp.command="lampe";
          resp.lampe=2;
          resp.value=obj.data[0];
          socket.emit("ip",resp);
        }
        if(dest == "0/2/3"){
          obj = JSON.parse(JSON.stringify(value));
          let resp={};
          resp.ip=maquette;
          resp.command="lampe";
          resp.lampe=3;
          resp.value=obj.data[0];
          socket.emit("ip",resp);
        }
        if(dest == "0/2/4"){
          obj = JSON.parse(JSON.stringify(value));
          let resp={};
          resp.ip=maquette;
          resp.command="lampe";
          resp.lampe=4;
          resp.value=obj.data[0];
          socket.emit("ip",resp);
        }

        //button 
        if(dest == "0/3/1")
        {
          if(temps <= 499)
          {
            temps = 1000;
            send_speed(temps);
          }else{
            temps = temps -100;
            send_speed(temps);
          }
          console.log("time: "+temps);
          let resp = {};
          resp.ip=maquette;
          resp.command="time_maq";
          resp.value=temps;
          socket.emit("ip",resp);

        }
        if(dest == "0/3/2")
        {
          if(temps >= 1501)
          {
            temps = 1000;
            send_speed(temps);
          }else{
            temps = temps + 100;
            send_speed(temps);
          }
          console.log("time: "+temps);
          let resp = {};
          resp.ip=maquette;
          resp.command="time_maq";
          resp.value=temps;
          socket.emit("ip",resp);

        }
        if(dest == "0/3/3"){
          if(tout_lampe)
          {
            start_lampe(1);
            start_lampe(2);
            start_lampe(3);
            start_lampe(4);
            tout_lampe=false;
          }else{
            down_lampe(1);
            down_lampe(2);
            down_lampe(3);
            down_lampe(4);
            tout_lampe=true;
          }
          
        }
        if(dest == "0/3/4"){
          if(bool_chen == false){
            bool_chen = true;
            chenilar_2();
          }else{bool_chen = false;}
          console.log("chenilar: "+bool_chen);

          let respon={};
          respon.ip=maquette;
          respon.command="activer_chen";
          respon.value=bool_chen;
          console.log(respon);
          socket.emit("ip", respon);
        }
      },
      // get notified on connection errors
      error: function(connstatus) {
        console.log("**** ERROR: %j", connstatus);
      }
    }
});

//je l'avais implémenté dans mes functions mais...
function chen_inv(ite,inv_chen){
  let val_chen = chen[ite];
  for(k=0;k<=inv_chen.length;k++){
    if(inv_chen[k]=val_chen)
    {
      return k;
    }
  }
}

function send_speed(time)
{
    let resp={};
    resp.ip=maquette;
    resp.command="speed";
    resp.speed=time;
    socket.emit("ip",resp);
}

// Pour pouvoir tester les sockets sans que la maquette ne soit vraiment connecter 
/*
socket = io.connect(
  "http://localhost:3000"
);
let response = {};
response.command = "send_ip";
response.ip = maquette;

// Emission 
socket.emit("ip", response);


// Pour la reconnexion (échange des adresses IP avec le serveur)
socket.on("reconnection", function(data) {
console.log(data);
let response = {};
response.command = "send_ip";
response.ip = maquette;
switch (data.command) {
case "sync":
socket.emit("ip", response);
break;
default:  
console.log("Command not supported..");
}
});

socket.on("data_send", function(data) {
console.log(data);
if(data.ip===maquette){

switch (data.command) {

case "lampe_onoff":
console.log("lampe");
lam = data.lampe;
valu = data.value;
if(lam === 'all'){
  if(valu === 1)
  {
    console.log("hello lampe all");
    start_lampe(1);
    start_lampe(2);
    start_lampe(3);
    start_lampe(4);
  }else if(valu === 0){
    console.log("down lampe all");
    down_lampe(1);
    down_lampe(2);
    down_lampe(3);
    down_lampe(4);
  }
}else {
    if(valu === 1)
    {
      start_lampe(lam);
    }else if(valu === 0){
      down_lampe(lam);
    }
}
break;

case "time":
  console.log("down web");
  temps=data.value;
  console.log("time: "+data.value);
  let resp = {};
  resp.ip=maquette;
  resp.command="time_maq";
  resp.value=temps;
  socket.emit("ip",resp);
  console.log(resp);
  
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
  if(data.value === true){
    bool_chen = true;
    chenilar_2();
    console.log("true chenillar");
  }else{bool_chen = false;
    console.log("false chenillar");}
  
  console.log("chenilar: "+bool_chen);
  break;

case "disc":
  console.log("disconnection ");
  connection.Disconnect();
  process.exit();
  break;

case "bonjour":
  console.log("helmkojfdn");
  readall();
  break;

case "new_chennillar":
    console.log('bojou kkk usicdnoqi,');
    chen = data.valeur;
    set_chenillar = data.valeur ;
    set_chenillar_inverse = data.valeurinv;
    console.log("chénillar: "+chen)
break;

case "chenillar_hbo":
    console.log('bojou kkk usicdnoqi,');
    bool_chen=true;
    chenilar_jurasik();
    console.log("chénillar: "+chen)
break;

default:
console.log("Command not supported..");
break;
}
}else{
switch(data.command)
{
case "active_chen":
console.log('hello');
  let respon={};
  respon.ip=maquette;
  respon.command="activer_chen";
  respon.value=bool_chen;
  console.log(respon);
  socket.emit("ip", respon);
  break;
}
}
});*/


server.listen(listen);