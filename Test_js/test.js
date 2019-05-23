
  function dim(ip_maquette)
    {
        console.log("hi dim");
        objet = JSON.stringify({ip_client:ip_maquette, commande:"diminuer"});
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "http://localhost:3000/change_time", true);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
        var tiime = document.getElementById("time").textContent;
        if(tiime==500){
            time = 1500;
        }else{
            time = tiime - 100;
        }
        document.getElementById("time").innerHTML =time;
    }

    function aug(ip_maquette)
    {
        console.log("hi aug");
        objet = JSON.stringify({ip_client:ip_maquette, commande:"augmenter"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST", "http://localhost:3000/change_time", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
        var tiime = document.getElementById("time").textContent;
        time = Number(tiime);
        if(time==500){
            time = 1500;
        }else{
            time = time + 100;
        }
        document.getElementById("time").innerHTML =time;
    }

    function chenillar(ip_maquette)
    {
            v = document.getElementById(ip_maquette+"_button_chenillar").value;
            if(v=="lancer"){
                objet = JSON.stringify({ip_client:ip_maquette, commande:"on_off_chen",val:true});
                var xhr = new XMLHttpRequest();
                xhr.open("POST", window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/chenillar", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
                var update = new Promise(function(resolve, reject) {
                    document.getElementById(ip_maquette+"_button_chenillar").value="stop";
                    document.getElementById(ip_maquette+"_button_chenillar").className="btn btn-warning col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                });
                update.then(function() {});
            }
            else{
                objet = JSON.stringify({ip_client:ip_maquette, commande:"on_off_chen",val:false});
                var xhr = new XMLHttpRequest();
                xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/chenillar", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
                var up = new Promise(function(resolve, reject) {
                     document.getElementById(ip_maquette+"_button_chenillar").value="lancer";
                     document.getElementById(ip_maquette+"_button_chenillar").className="btn btn-blue col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                    });
                    up.then(function() {});
            }
    }

   function search_maquette(){
            objet = JSON.stringify({ip_client:"hello", commande:"search_maq"});
            var xhr = new XMLHttpRequest();
            //probleme car on ne trouvait pas le serveur depuis l'appli :/
            xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/search", true);
            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(objet.toString());

            myFunction_green("Le serveur recherche les maquettes disponible");
   }

    function etat_lampe()
    {
        objet = JSON.stringify({ip_client:"hello", commande:"bonjour"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/etat_lampe", true);
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
    }
    
    var socket = io.connect(
        window.location.protocol +"//" +window.location.hostname +":" + window.location.port
        );

    let response = {};
    response.command = "etat_lampe";
    socket.emit("ip", response);

    let resp = {};
    resp.command = "ip_maquette_req";
    socket.emit("ip", resp);

    let re={}
    re.command = "script_maq";
    socket.emit("ip", re);

    let rep={}
    rep.command = "act_chen";
    socket.emit("ip", rep);

    socket.on("Lampe", function(data) {
        switch (data.command) {

             case "activer_chen":
             console.log(data);
             if(data.value)
             {
                document.getElementById(data.ip+"_button_chenillar").value="stop";
                document.getElementById(data.ip+"_button_chenillar").className="btn btn-warning col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
             }else{
                document.getElementById(data.ip+"_button_chenillar").value="lancer";
                document.getElementById(data.ip+"_button_chenillar").className="btn btn-blue col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
             }
             break; 

             case "select_maq":
             document.getElementById("button_multiple").innerHTML="";
             if (data.ip.length == 0) {
             $("#button_multiple").append("<option>Pas de maquette connectée</option>");}
             else {
                for (var i in data.ip) {
                //let name = "butt_cam_" + i; 
                let ip = data.ip[i];
                $("#button_multiple").append('<option>'+ ip +'</option>');
                }
             }
             break;

             case "time_maq":
             console.log(data);
             document.getElementById(data.ip_maquette+"_slider").value=data.value;
             document.getElementById(data.ip_maquette+"_text").innerHTML=data.value;
             break;

             case "up_lampe":
              console.log(data);
              if(data.value===1){
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).value="eteindre";
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).className="btn btn-danger col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                document.getElementById(data.ip_maquette+"_lamp_on_"+data.lampe).src = "/lamp_on.png";
              }else if(data.value==0){
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).value="allumer";
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).className="btn btn-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                document.getElementById(data.ip_maquette+"_lamp_on_"+data.lampe).src = "/lamp_off.png";
              }

              break;

              case "ip_maquette":
              let data_add= [];
              let data_remove=[]
              let list = document.getElementsByTagName("divcard");
              if(document.getElementById("mes_maquettes").getElementsByTagName("divcard").length!=0){
                
                 let div_page = [];
                 let p =0;
                 while(p<list.length){
                    div_page.push(list[p].id.split("_")[0]);
                    p++;
                 }
                 let l=0;
                    dat = data.ip_maquette;
                    console.log(dat.length);
                    while(l<dat.length)
                    {
                        let essai = document.getElementById(dat[l]+"_card");
                        if(essai==null){
                            data_add.push(dat[l]);
                            l++;
                        }else{
                        b=0;
                        while(b<div_page.length){
                            
                            if(div_page[b]==dat[l]){
                                div_page.slice(b);
                                l++;
                                break;
                            }else if((b+1)==(div_page.length)){
                                data_remove.push[b];
                                b++;
                            }
                            b++;
                            }
                         }
                    }
                    console.log(data_remove.length);
                    if(data_remove.length!=0){}
              }else{
                data_add=data.ip_maquette;
              }
              console.log(data_add.length);
                let name = "auth_cam_";
                if (data.ip_maquette.length === 0) {
                    document.getElementById("mes_maquettes").innerHTML="";     
                } else {
                for (var i in data_add) {
                ip_auth = data_add[i];
                ip_sl = data_add[i]
                ip_sl = escapeRegExp(ip_sl);
                name = "maquette_"+ ip_sl ;         
                tout = "all";       
                $("#mes_maquettes").append(
                   '<divcard class="card shadow" id="'+ip_auth+'_card" style="box-shadow:0 0.0rem 0.5rem 0 rgba(58, 59, 69, 0.15) !important">'+
                   '<div class="card-header py-3 d-flex flex-row ">'+
                       ' <h6 class="m-0 mr-auto p-2 font-weight-bold text-dark">'+ip_auth+' </h6>'+

                       '<button class="btn btn-light" style="width:10px; height:32px; margin-right:5px;" id="'+ip_auth+'_button_deco" onclick="parametre_maquette(\'' + ip_auth + '\')">'+
                       '<i class="fas fa-fw fa-cog" id="'+ip_auth+'_parametre" style="  width:5px;  right: 7px; bottom: 2px;position: relative;"></i></button>'+

                       '<button class="btn btn-danger" style="width:10px; height:32px;" id="'+ip_auth+'_button_deco" onclick="deco_maq(\'' + ip_auth + '\')">'+
                       '<i class="fas fa-fw fa-times" id="'+ip_auth+'_croix" style="width:5px;  right: 6px; bottom: 2px;position: relative;"></i></button>'+
                          
                    '</div>'+
                '<div class="col-xl-12 form-group card-body" style="text-align: center">'+
                  
                    '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_1" width="200"  src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_2" width="200" src="/lamp_off.png">'+
                   '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_3" width="200" src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_4" width="200" src="/lamp_off.png"> '+
                    '<br>'+
                    '<br>'+

                    '<ul class="list-group" style="box-shadow: 0 0.0rem 0.2rem 0 rgba(58, 59, 69, 0.15) !important;" id="list_lampe">'+
                        '<li class="list-group-item " >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+ 
                            '<div class="mr-auto p-2">Gestion des lampes</div>'+
                            ' <button class="btn" onclick="angle_up(\'' + ip_auth + '\',1)" id="'+ip_auth+'_collaps_1" data-toggle="collapse" data-target="#Gestion_'+name+'" aria-expanded="false" aria-controls="collapseExample">'+
                            '<i class="fas fa-fw fa-angle-down" id="'+ip_auth+'_angle_1" ></i>'+
                            '</button>'+       
                            '</div>'+
                        '</li>'+
                        '<div class="collapse" id="Gestion_'+name+'">'+
                        '<li class="list-group-item " >'+
                           '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre toutes les lampes</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_all" type="button" value="allumer" onclick="lampe_onoff(\'' + tout + '\',\'' + ip_auth + '\')"/>'+
                          '</div>'+
                       '</li>'+
                        '<li class="list-group-item " >'+
                           '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre la lampe n°1</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_1" type="button" value="allumer" onclick="lampe_onoff(1,\'' + ip_auth + '\')"/>'+
                          '</div>'+
                       '</li>'+
                       '<li class="list-group-item" >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre la lampe n°2</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_2" type="button" value="allumer" onclick="lampe_onoff(2,\'' + ip_auth + '\')"/>'+
                           '</div>'+
                         '</li>'+
                         '<li class="list-group-item" >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                               '<div class="mr-auto p-2">allumer ou eteindre la lampe n°3</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_3" type="button" value="allumer" onclick="lampe_onoff(3,\'' + ip_auth + '\')"/>'+
                            '</div>'+
                        '</li>'+
                         '<li class="list-group-item" >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre la lampe n°4</div>'+
                               '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_4" type="button" value="allumer" onclick="lampe_onoff(4,\'' + ip_auth + '\')"/>'+
                          '</div>'+
                         '</li>'+
                         '</div>'+
                      '</ul>'+

                      '<ul class="list-group" style="box-shadow: 0 0.0rem 0.2rem 0 rgba(58, 59, 69, 0.15) !important;" id="list_lampe">'+
                      '<li class="list-group-item " >'+
                          '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                          '<div class="mr-auto p-2">Gestion de la maquette</div>'+
                          ' <button class="btn" data-toggle="collapse" id="'+ip_auth+'_collaps_2"  aria-pressed="false" onclick="angle_up(\'' + ip_auth + '\',2)" data-target="#Chen_'+name+'" aria-expanded="false" aria-controls="collapseExample">'+
                          '<i class="fas fa-fw fa-angle-down" id="'+ip_auth+'_angle_2" ></i>'+
                          '</button>'+       
                          '</div>'+
                      '</li>'+
                      '<div class="collapse" id="Chen_'+name+'">'+
                      '<li class="list-group-item " >'+
                         '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">allumer ou eteindre le chenillar</div>'+
                            '<input class="btn btn-blue  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_chenillar" type="button" value="lancer" onclick="chenillar(\'' + ip_auth + '\')"/>'+
                        '</div>'+
                     '</li>'+
                      '<li class="list-group-item " >'+
                         '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">Inverser le chenillar</div>'+
                           '  <label class="switch">'+
                            '<input id="'+ip_auth+'_toggle" type="checkbox" onclick="inv_chen(\'' + ip_auth + '\')">'+
                           '<span class="sli round"></span>'+
                         '</label>'+
                        '</div>'+
                     '</li>'+
                     '<li class="list-group-item" >'+
                          '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2" style="vertical-align: bottom;" >allumer ou eteindre la lampe n°2</div>'+
                           
                            '<span class="slidecontainer col-2" >'+
                            '<input type="range" min="500" max="1500" value="1000" class="slider" id="'+ip_auth+'_slider"  onchange="changetime(\'' + ip_auth + '\')" style="vertical-align: bottom;">'+
                            '<span id="'+ip_auth+'_text"></span>'+
                           '<script>'+
                           
                            'var slider_'+i+' = document.getElementById("'+ip_auth+'_slider");'+
                            'var output_'+i+' = document.getElementById("'+ip_auth+'_text");'+
                            'output_'+i+'.innerHTML = slider_'+i+'.value;'+
                            'slider_'+i+'.oninput = function() {'+
                                'output_'+i+'.innerHTML = this.value;'+   
                            '}'+
                            '</script>'+
                            '</span>'+
                         '</div>'+
                       '</li>'+
                       '</div>'+
                    '</ul>'+
                      '</div>'+
                '</divcard><br>'
                );
                }
            } 
            document.getElementById("multi_maquette_1").innerHTML="";
            document.getElementById("multi_maquette_2").innerHTML="";

            if (data.ip_maquette.length == 0) {
                $("#multi_maquette_1").append("<option>Pas de maquette connectée</option>");
                $("#multi_maquette_2").append("<option>Pas de maquette connectée</option>");}
                else {
                   for (var i in data.ip_maquette) {
                   let ip = data.ip_maquette[i];
                   $("#multi_maquette_1").append('<option>'+ ip +'</option>');
                   $("#multi_maquette_2").append('<option>'+ ip +'</option>');
                   }
            }
              break;

              default:
              console.log("Command not supported by the web client");
          

        }
    })
       
    function parametre_maquette(ip){
        let ipconcat=escapeRegExp(ip);
        name_modal="modal_param_maquette"+ipconcat;
        name_param=ip+"_param_maquette";

        $("#mes_maquettes").append(
            '<div class="modal fade  bd-example-modal-lg" id="'+name_modal+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"> '+
            '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">'+
             ' <div class="modal-content">'+
               ' <div class="modal-header">'+
                 ' <h5 class="modal-title" id="exampleModalCenterTitle">'+"Paramètre de la maquette "+ip+'</h5>'+
                 '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                 '  <span aria-hidden="true">&times;</span>'+
                 '</button>'+
                 '</div>'+
                 '<div class="modal-body">'+
                 '<div class="col-12 row">'+
                ' <div class="input-group col-6 ">'+
                 '<input type="text" id="'+name_param+'" class="form-control" placeholder="nouveau model du chenillar" aria-label="Username" aria-describedby="basic-addon1">'+
               '</div>'+
               ' <div class="col-5 ">'+
               '<span class="form-control" style="border:0px">ex:1,4,4,3,2,3,1</span>'+
                 '</div>'+
                 '</div>'+
                 '</div>'+
                 '<div class="modal-footer">'+
                 ' <button type="button" class="btn btn-secondary" data-dismiss="modal" >page précédente</button>'+
                 ' <button type="button" class="btn btn-success" data-dismiss="modal" onclick="send_new_param(\'' + ip + '\')">valider</button>'+
                 '</div>'+
                 ' </div>'+
                 ' </div>'+
                 ' </div>'+
                 '<script>$("#'+name_modal+'").modal("show")</script>'
                 );
        
    }


    function send_new_param(ip){
        new_chen = document.getElementById(ip+"_param_maquette").value;
        
        let tab_para=[];
        let tab_para2=[];
        for(let o =0;o<new_chen.length;o++){
            if(new_chen[o]===","){}
            else{
            if((Number(new_chen[o]))<(Number(5)))
            {
                tab_para.push(Number(new_chen[o]));
                tab_para2.push(Number(new_chen[o]));
            }
            else{console.log("nop" + new_chen[0]);}
            }
        }
        new_chen_reverse = tab_para2.reverse(); 
        objet = JSON.stringify({ip_client:ip, commande:"new_chennillar", valeur_chen:tab_para,valeur_inv:new_chen_reverse});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/new_chennillar", true);
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());

    }

    function multi_chen(){
        chen_1 = document.getElementById("multi_maquette_1").value;
        chen_2 = document.getElementById("multi_maquette_2").value;
        if(chen_1!=chen_2){
            param_multi(chen_1,chen_2);
        }else{
        myFunction("Attention ! il faut choisir deux maquettes différentes !");   
    }
}

function enable_multi_maquette(){
            v = document.getElementById("bouton_multi").className;
            if(v=="fas fa-check fa-sm"){
                objet = JSON.stringify({commande:"bouton_mul", value:1});
                var xhr = new XMLHttpRequest();
                //probleme car on ne trouvait pas le serveur depuis l'appli :/
                xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/but_multi", true);
                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
                var update = new Promise(function(resolve, reject) { 
                    document.getElementById("bouton_multi").className="fas fa-times fa-sm";
                    });
                  update.then(function() {});
            }
            else{
                objet = JSON.stringify({commande:"bouton_mul", value:0});
                var xhr = new XMLHttpRequest();
                //probleme car on ne trouvait pas le serveur depuis l'appli :/
                xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/but_multi", true);
                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
                var up = new Promise(function(resolve, reject) {
                    document.getElementById("bouton_multi").className="fas fa-check fa-sm";
                    });
                    up.then(function() {});
            }
}

    function param_multi(ip_1,ip_2){
        let ipconcat=escapeRegExp(ip_1);
        let ipconcat2=escapeRegExp(ip_2);
        mop = ipconcat+"_param_"+ipconcat2;
        name_modal="modal_param_";
        
        name_param=ip_1+"_param_"+ip_2;
        $("#mes_maquettes").append(
            '<div class="modal fade  bd-example-modal-lg" id="'+name_modal+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"> '+
            '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">'+
             ' <div class="modal-content">'+
               ' <div class="modal-header">'+
                 ' <h5 class="modal-title" id="exampleModalCenterTitle">'+"Paramètre de la caméra "+'</h5>'+
                 '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                 '  <span aria-hidden="true">&times;</span>'+
                 '</button>'+
                 '</div>'+
                 '<div class="modal-body">'+
                 '<div class="col-xl-12 col-12" style="text-align:center;">'+
                 '<span class="col-xl-1 col-1">'+
                 
                 '<img class="col-xl-1 col-2"  width="200" style=" min-width: 8%;" src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-2  width="200"  style=" min-width: 8%;" src="/lamp_off.png">'+
                   '<img class="col-xl-1 col-2 width="200" style=" min-width: 8%;" src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-2 width="200"style=" min-width: 8%;" src="/lamp_off.png"> '+
                    '<span class="col-xl-2 col-4">'+
                    '<img class="col-xl-1 col-2"  width="200" style=" min-width: 8%;"  src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-2"  width="200" style=" min-width: 8%;" src="/lamp_off.png">'+
                   '<img class=" col-xl-1 col-2"  width="200" style=" min-width: 8%;" src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-2"  width="200" style=" min-width: 8%;"  src="/lamp_off.png"> '+
                    '<span class="col-xl-1 col-1">'+
                 '</div>'+
                 '<br>'+
                 '<div class="row col-12">'+
                '<span class="slidecontainer col-5" >'+
                '<input type="range" min="500" max="1500" value="1000" class="slider form-groupe" width="500px" id="'+mop+'_slider" style="vertical-align: middle;">'+
                
                '</span>'+
                    '<span class ="col-2"  id="'+mop+'_text"></span>'+
                    '<script>'+
                
                    'var slider_'+mop+' = document.getElementById("'+mop+'_slider");'+
                    'var output_'+mop+' = document.getElementById("'+mop+'_text");'+
                    'output_'+mop+'.innerHTML = slider_'+mop+'.value;'+
                    'slider_'+mop+'.oninput = function() {'+
                        'output_'+mop+'.innerHTML = this.value;'+   
                    '}'+
                    '</script>'+

                '</div>'+
                '<br>'+
                 '<div class="col-12 row">'+
                ' <div class="input-group col-6 ">'+
                 '<input type="text" id="'+name_param+'" class="form-control" placeholder="model du chenillar" aria-label="Username" aria-describedby="basic-addon1">'+
               '</div>'+
               ' <div class="col-5 ">'+
               '<span class="form-control" style="border:0px">ex:1,2,8,6,4,2,3</span>'+
                 '</div>'+
                 '</div>'+
                 '</div>'+
                 '<div class="modal-footer">'+
                 ' <button type="button" class="btn btn-secondary" data-dismiss="modal" >page précédente</button>'+
                 ' <button type="button" class="btn btn-success" data-dismiss="modal" onclick="send_param_multi(\'' + ip_1 + '\',\'' + ip_2 + '\',\'' + name_param + '\',\'' + mop + '\')">valider</button>'+
                 '</div>'+
                 ' </div>'+
                 ' </div>'+
                 ' </div>'+
                 '<script>$("#'+name_modal+'").modal("show")</script>'
                 );
      }
      
    function send_param_multi(ip1,ip2,inp,slider)
    {   
        let slid = document.getElementById(slider+'_slider').value;
        let str = document.getElementById(inp).value;
        let tab_para=[];
        for(let o =0;o<str.length;o++){
            if(str[o]===","){}
            else{
            if((Number(str[o]))<(Number(9)))
            {
                tab_para.push(Number(str[o]));
            }
            else{console.log("nop" + str[0]);}
            }
        }
        console.log(ip1+ ip2+ tab_para);        

        objet = JSON.stringify({ip_1:ip1,ip_2:ip2, commande:"multi_chen", valeur:tab_para,time:slid});
        var xhr = new XMLHttpRequest();
        xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/multi_chenillar", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
    }
       
    function myFunction(str) {
        var x = document.getElementById("snackbar");
        x.style="background: firebrick;"
        x.innerHTML=str;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    function myFunction_green(str) {
        var x = document.getElementById("snackbar");
        x.style="background: rgb(41, 168, 10);"
        x.innerHTML=str;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    function inv_chen(ip_maquette)
    {
        val = document.getElementById(ip_maquette+"_toggle").checked;
        objet = JSON.stringify({ip_client:ip_maquette, commande:"inverser_chenillar", valeur:val});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/chenillar", true);
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
    }


    function changetime(ip) {
        v= document.getElementById(ip+"_slider").value;
        objet = JSON.stringify({ip_client:ip,value:v,commande:"time"});
        var xhr = new XMLHttpRequest();
        xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/change_time", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
    }

    
    function angle_up(ip,numb){
        angle = document.getElementById(ip+"_angle_"+numb);
        val = document.getElementById(ip+"_collaps_"+numb).getAttribute("aria-expanded");
        if(val==="false"){
            document.getElementById(ip+"_angle_"+numb).className="fas fa-fw fa-angle-up";
        }else if(val==='true'){
            document.getElementById(ip+"_angle_"+numb).className="fas fa-fw fa-angle-down";
        }
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, ""); // $& means the whole matched string
      }

    function deco_maq(ip) {
               objet = JSON.stringify({ip_client:ip, commande:"disc"});
                var xhr = new XMLHttpRequest();
                //probleme car on ne trouvait pas le serveur depuis l'appli :/
                xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/deconnection", true);
                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
     }

    function lampe_onoff(lampe,ip_maquette)
    {   
            v = document.getElementById(ip_maquette+"_button_"+lampe).value;
            if(v=="allumer"){
                objet = JSON.stringify({ip_client:ip_maquette, commande:"lampe_onoff",lampe_nb:lampe, value:1});
                var xhr = new XMLHttpRequest();
                //probleme car on ne trouvait pas le serveur depuis l'appli :/
                xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/lampe", true);
                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
                var update = new Promise(function(resolve, reject) {
                    document.getElementById(ip_maquette+"_button_"+lampe).value="eteindre";
                    document.getElementById(ip_maquette+"_button_"+lampe).className="btn btn-danger col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                    if(lampe!="all"){
                    document.getElementById(ip_maquette+"_lamp_on_"+lampe).src = "/lamp_on.png";
                    }
                    });
                  update.then(function() {});       
            }
            else{
                objet = JSON.stringify({ip_client:ip_maquette, commande:"lampe_onoff",lampe_nb:lampe, value:0});
                var xhr = new XMLHttpRequest();
                //probleme car on ne trouvait pas le serveur depuis l'appli :/
                xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/lampe", true);
                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(objet.toString());
                var up = new Promise(function(resolve, reject) {
                     document.getElementById(ip_maquette+"_button_"+lampe).value="allumer";
                     document.getElementById(ip_maquette+"_button_"+lampe).className="btn btn-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                     if(lampe!="all"){
                     document.getElementById(ip_maquette+"_lamp_on_"+lampe).src = "/lamp_off.png";
                    }
                    });
                    up.then(function() {});
            }
    }

    function connection()
    {
        select = document.getElementById("button_multiple").value;
        objet = JSON.stringify({ip_client:select, commande:"connecton_maquette"});
            var xhr = new XMLHttpRequest();
            //probleme car on ne trouvait pas le serveur depuis l'appli :/
            xhr.open("POST",  window.location.protocol +"//" +window.location.hostname +":" + window.location.port+"/connection", true);
            console.log(objet);
            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(objet.toString());
    }


    


