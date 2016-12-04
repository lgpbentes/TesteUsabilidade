var debug = true;
var timer;
var currentScreen = "";
var idClass = "";
var ip = "localhost"; 
var idAluno = "8";

var multioption = {
    status: false,
    id: "Q1-hard",
    len: "1",
    question: ["Q1-hard","Q2-hard","Q3-hard"]
} 

onload =  function(e){

	var html = document.querySelectorAll("html");
    currentScreen = e.target.baseURI.split("/").slice(-1)[0];
	for (var i=0;  i < html.length; i++) {
		html[i].addEventListener("click", listenClick);
	}

    timer = setInterval(overflowTimer, 2000);
}

function overflowTimer(){
   // idTela = getCookie("screen");
    var timestamp = new Date().getTime();

    if (currentScreen == "questionario.html" && idClass == "") idClass = "Q:1:H:1-1";
    if (idClass == "troca-Q1 btn btn-info btn-lg"){
        idClass = "Q:1:E:1-1";
    } else if (idClass == "troca-Q2 btn btn-info btn-lg"){
        idClass = "Q:2:E:1-2";
    } else if (idClass == "troca-Q3 btn btn-info btn-lg"){
        idClass = "Q:3:E:1-3";
    }

    if(debug) {
       /* console.log("-------after two seconds----------");
        console.log("DataCollector timestamp: "+timestamp);
        console.log("Tela Atual: "+currentScreen);*/
    }

    $.post("http://"+ ip +":5000/storage/1",
        {
            idUser: idAluno,
            timeStamp: timestamp,
            tipo: null,
            tela: currentScreen,
            tag: null,
            x: null,
            y: null,
       //     id: idTela,
            classId: idClass
        },
        function(data, status){
            //console.log("PLAYER------Data: " + data + "\nStatus: " + status);
            response = data.recommendation[0].recommendation;
            questions = data.recommendation[1].questions;
            response = response.split(";");
            questions = questions.split(",")
            console.log("response: " + response);
            //console.log("response len: " + response.length);
            console.log("questions: " + questions);
            if (response.length > 1){
                multioption.status = true;
                multioption.length = response.length;
                multioption.id = response;
                multioption.question = questions;
               // console.log("multioption " + multioption.question[1]);
            } else {
                multioption.status = false;
                multioption.length = response.length;
                multioption.id = response;
                multioption.question = questions;
            }
        });
}

var escolha;
window.confirm = function(al, $){
    return function(msg) {
        al.call(window,msg);
        $(window).trigger("confirmacao");
    };
}(window.confirm, window.jQuery);


$(window).on("confirmacao", function(e) {
    console.log("escolhi: "+escolha);
});


function getCookie(cname) {
    var name = cname + "=";

    var ca = document.cookie.split(';');
    //console.log(ca);
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            //console.log(c);
            return c.substring(name.length,c.length);
        }
    }
  return "";
}

function listenClick(e){
    clearInterval(timer);
    timer = setInterval(overflowTimer, 2000);
    currentScreen = e.target.baseURI.split("/").slice(-1)[0];
    
    if (e.target.className == "modal fade"){
        idClass = "Q" + idClass.substring(1, idClass.length); 
    } else {
        idClass = e.target.className;
    }


    if (e.target.className == "Q:1:H:1-1 list-group-item" && multioption.question[0] == "Q1-easy" ) idClass = "Q:1:E:1-1 list-group-item";
    else if (e.target.className == "Q:2:H:1-2 list-group-item" && multioption.question[1] == "Q2-easy") idClass = "Q:2:E:1-2 list-group-item";
    else if (e.target.className == "Q:3:H:1-3 list-group-item" && multioption.question[2] == "Q3-easy") idClass = "Q:3:E:1-3 list-group-item";
    
    //console.log("IDCLASS: " + idClass);

    //idTela = getCookie("screen");
    var timestamp = new Date().getTime();
    /*var tag = e.target.localName;
    if (e.target.localName == "input") {
       // console.log("INPUT");
        tag = e.target.localName + "-" + e.target.defaultValue;
        //console.log("INPUT: " + tag);
    }*/

  /*  if(debug) {
       console.log("-----------------");
        console.log(e);
        console.log("tela:" + currentScreen);
        console.log("x: " + e.screenX + " y: " + e.screenY);
        console.log(e.type);
        console.log("target id: " + e.target.id);
        console.log("target class: " + e.target.className);
        console.log("selected option:", e.target.defaultValue);
        console.log(e.target.localName);
      //  console.log(tag);
        console.log(e.timeStamp);
        console.log(e.which);
        console.log("DataCollector timestamp: "+timestamp); 
    }*/

    $.post("http://"+ ip +":5000/storage/1",
    {
      idUser: idAluno,
      timeStamp: timestamp,
      tipo: e.type,
      tela: currentScreen,
      tag: e.target.localName,
      x:e.screenX,
      y:e.screenY,
     // alternativaSelecionada: e.target.defaultValue,
//      id: idTela,
      classId: idClass
    },
    function(data, status){
            response = data.recommendation[0].recommendation;
            questions = data.recommendation[1].questions;
            response = response.split(";");
            questions = questions.split(",")
            console.log("response: " + response);
            //console.log("response len: " + response.length);
            console.log("questions: " + questions);
            if (response.length > 1){
                multioption.status = true;
                multioption.length = response.length;
                multioption.id = response;
                multioption.question = questions;
                //console.log("multioption " + multioption.question);
            } else {
                multioption.status = false;
                multioption.length = response.length;
                multioption.id = response;
                multioption.question = questions;
            }
        });
}

function listemMouseOver(e){
	console.log(e.target);
}

function listemMouseOut(e){
	console.log(e.target);
}
