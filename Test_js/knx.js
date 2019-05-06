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

var maquette= process.argv[2];
var listen =process.argv[3];


console.log(process.argv[2]);
console.log(process.argv[3]);


process.stdin.on('data',(data) =>{
  
  dat = data.toString().trim();
  //console.log(dat);
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

var socket = io.connect(
  "http://localhost:3000"
);

function start_lampe(nb)
{
    let resp={};
    connection.write("0/1/"+nb, 1);
    /*resp.ip=maquette;
    resp.command="lampe";
    resp.lampe=nb;
    resp.value="1";
    socket.emit("ip",resp);*/
}

function down_lampe(nb)
{
    let resp={};
    connection.write("0/1/"+nb, 0);
    /*resp.ip=maquette;
    resp.command="lampe";
    resp.lampe=nb;
    resp.value="0";
    socket.emit("ip",resp);*/
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
    while(bool_chen){
        start_lampe(chen[i]);
        await sleep(temps);
        down_lampe(chen[i]);
        if(i>=3){i=0;}else{i++;}
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
    // ip address and port of the KNX router or interface '192.168.0.10'
    ipAddr: maquette, ipPort: 3671,
    
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
        //u0000
        if(dest == "0/3/1")
        {
          console.log("down bouton");
          if(temps == 500)
          {
            temps = 1000;
            send_speed(temps);
          }else{
            temps = temps -100;
            send_speed(temps);
          }
          console.log("time: "+temps);
        }
        if(dest == "0/3/2")
        {
          console.log("up bouton");
          if(temps == 1500)
          {
            temps = 1000;
            send_speed(temps);
          }else{
            temps = temps + 100;
            send_speed(temps);
          }
          console.log("time: "+temps);
        }
        if(dest == "0/3/3"){
          console.log("yello");
          if(chen === set_chenillar)
          {
            chen = set_chenillar_inverse;
            let m = chen_inv(i,set_chenillar_inverse).then();
            i = m;
          }else if(chen === set_chenillar_inverse)
          {
            chen = set_chenillar;
            let m = chen_inv(i,set_chenillar).then();
            i = m;
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
            start_lampe(0);
            start_lampe(1);
            start_lampe(2);
            start_lampe(3);
          }else if(valu === 0){
            console.log("down lampe all");
            down_lampe(0);
            down_lampe(1);
            down_lampe(2);
            down_lampe(3);
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
  }
});

server.listen(listen);