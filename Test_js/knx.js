var knx = require('knx');

const http = require("http");
const ip = require("ip");
const io = require("socket.io-client");

const server = http.createServer();
const myIP = ip.address();

var temps = 1000;
var set_chenillar=[1,2,3,4];
var set_chenillar_inverse=[4,3,2,1];
var chen = set_chenillar;
var bool_chen=1;
var i=1;

var test=0;

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
    break;

    case "on":
    down_lampe(1);
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

var socket = io.connect(
  "http://localhost:3000"
);

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



let response = {};
response.command = "send_ip";
response.ip = myIP;

// Emission 
socket.emit("ip", response);

// Pour la reconnexion (échange des adresses IP avec le serveur)
socket.on("reconnection", function(data) {
  console.log(data);
  let response = {};
  response.command = "send_ip";
  response.ip = myIP;
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
      break;
  }
});

server.listen(8000);