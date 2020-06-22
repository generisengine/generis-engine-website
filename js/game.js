

GameClass = Class.extend({
 	
 	activeWindows: {},
 	gameName:"",
 	gameSource:"",
 	gameCode:null,
 	published: false,
	activeWindow: null,
	currPath: "Generis Account/Games",
	//EngineVersions: e70f0ac, df5033f, 420ade1, 51362dc
    
    init : function(gameName) { 
	
		this.gameName = gameName;
		
		this.saveWindows = function(){
			$("html, body").scrollTop(0);
		    try {
		        var wdsData = {};
                var g = gAccount.getFileD(gAccount.getFileId(game.gameName, ["Generis Account", "Games"]));
                
                var aWindows = {};
                
                for(var i in game.activeWindows){
                    
                    var wds = document.getElementById(i).getElementsByClassName("pane")[0];
                    var b = wds.getBoundingClientRect();
                    wdsData[i] = [b.left, b.top, b.width - 40, b.height - 40];  
                    aWindows[i] = {};
                    var tabs = game.activeWindows[i].tabs;          
                    for(var j in tabs){
                        aWindows[i][j] = [ tabs[j].title, tabs[j].path, tabs[j].parent/*tabId*/, tabs[j].type, tabs[j].num, tabs[j].wndId];
                    }
                }
                g["gameData"] = [ game.gameName,  game.gameSource, aWindows, game.activeWindow, game.currPath, wdsData, game.published, replaceAll($("#Images [name=main]").html(), "&#9;", "")] ;
                
            } catch(e) { console.log(e); }
	     }; 
		 
    },
    
    newGame: function(host) {
		 
    	if (host == "myComp") this.myCompSetup(this.gameName);
		if (host == "gDrive") this.gDriveSetup(this.gameName);
		if (host == "oneDrive") this.oneDriveSetup(this.gameName);
		if (host == "dropBoxDrive") this.dropBoxSetup(this.gameName);

    },

    myCompSetup: function(name) {
		 
    	console.log(name);

    },

    gDriveSetup: function(gameName) {
    	var x = this;
    	
		var saveFilesInfo = function(){
		 	gAccount.saveFilesInfo( x.createWindows ); 
		}

		createGamefolder131 = function(){ 

			document.getElementById("createdFile").innerHTML = " creating Screenshots folder "; 
			gAccount.createFolder("Screenshots", [ {"id": gAccount.getFileId("Images" , [ "Generis Account", "Games", gameName, "Media" ])}], saveFilesInfo );
		}

		createGamefolder13 = function(){ 

			document.getElementById("createdFile").innerHTML = " creating Images folder "; 
			gAccount.createFolder("Images", [ {"id": gAccount.getFileId("Media" , [ "Generis Account", "Games", gameName ])}], createGamefolder131 );
		}

		createGamefolder121 = function(){  
			document.getElementById("createdFile").innerHTML = " creating Trailers folder "; 
			gAccount.createFolder("Trailers", [ {"id": gAccount.getFileId("Videos" , [ "Generis Account", "Games", gameName, "Media" ])}], createGamefolder13 );
		}

		createGamefolder12 = function(){  
			document.getElementById("createdFile").innerHTML = " creating Videos folder "; 
			gAccount.createFolder("Videos", [ {"id": gAccount.getFileId("Media" , [ "Generis Account", "Games", gameName ])}], createGamefolder121 );
		}

		createGamefolder11 = function(){ 
			document.getElementById("createdFile").innerHTML = " creating Audio folder ";  
			gAccount.createFolder("Audio", [ {"id": gAccount.getFileId("Media" , [ "Generis Account", "Games", gameName ])}], createGamefolder12 );
		}

		createGamefolder1 = function(){ 
			document.getElementById("createdFile").innerHTML = " creating  Media folder "; 
			gAccount.createFolder("Media", [{"id": gAccount.getFileId(gameName, [ "Generis Account", "Games" ])}], createGamefolder11 );
		} 

		createGamefolder02 = function(){ 
			document.getElementById("createdFile").innerHTML = " creating  css folder "; 
			gAccount.createFolder("css", [{"id": gAccount.getFileId("Libraries" , [ "Generis Account", "Games", gameName ])}], createGamefolder1 );
		} 

		createGamefolder01 = function(){ 
			document.getElementById("createdFile").innerHTML = " creating  js folder "; 
			gAccount.createFolder("js", [{"id": gAccount.getFileId("Libraries" , [ "Generis Account", "Games", gameName ]) }], createGamefolder02 );
		} 

		createGamefolder0 = function(){
		 	document.getElementById("createdFile").innerHTML = " creating Libraries folder "; 
			var gn = gAccount.getFileId(gameName, [ "Generis Account", "Games" ]);
			//console.log(gn +"__"+ gAccount.getFileId("ffff", [ "Generis Account", "Games" ]));
			gAccount.createFolder("Libraries", [{"id": gn}], createGamefolder01 );
		}

		createGamefolder = function(){
		 	document.getElementById("createdFile").innerHTML = " creating " + gameName + " page "; 
		 	
		 	var content =  ' \n\
<!DOCTYPE html> \n\
<html> \n\
	<head>  \n\
		<title>'+gameName+'</title> \n\
		<meta name="description" content="'+gameName+' Online Html Game"> \n\
		<meta name="keywords" content="'+gameName+',Generis,Game,html"> \n\
		<meta name="author" content="'+gAccount.displayName+'"> \n\
		<script src="https://cdn.rawgit.com/Nangue-Tasse/generis2d/79fc21c/generis2d.min.js"><\/script>   \n\
	</head> \n\
	<body style="background-color:#000"> \n\
		<div id="game"> </div > \n\
		<script name="init"> \n\
(function(){ \n\n\
G.WtoH = 5/5;  \n\
var canvas = G.new("canvas", { "id": "canvas", "container": "game", "width": 1000, "height": 1000}); \n\n\
})(); \n\
		<\/script>  \n\
		<div name="scenes"> \n\
		  <div name="scene1"> \n\
		    <script name="scene1">  \n\
(function(){ \n\n\
/* scene1 creation */ \n\
var scene1 = G.new("scene", { "id": "scene1", "canvas": "canvas", "width": 1000, "height": 1000, "WtoH":1, "gravity":{"x":0,"y":200} } ); \n\
/* end */ \n\n\
})(); \n\
		    <\/script>  \n\
		    <div name="cameras"> \n\
		      <div name="camera1"> \n\
		        <script name="camera1"> \n\
G.scenes["scene1"].add("eventListener", {id:"onStart", pre: function() { \n\
var scene1 = G.scenes["scene1"]; \n\n\
/* camera1 creation */ \n\
var camera1 = scene1.new("camera", {"id": "camera1", "width": 1000, "height": 1000}); \n\
/* end */ \n\n\
}}); \n\
		        <\/script>  \n\
		      </div> \n\
		    </div> \n\
		    <div name="entities">   \n\
		        <div name="player"> \n\
		            <script name="player"> \n\
G.scenes["scene1"].add("eventListener", {id:"onStart", pre: function() { \n\
var scene1 = G.scenes["scene1"]; \n\n\
/* player creation */ \n\
var player = scene1.new("entity",  \n\
                { "id":"player",  \n\
                  "idleBody": "idle", \n\
                  "bodies":{ "idle": { "x":100, "y":100, "z":0, "width": 150, "height": 200, "type":"static", "alpha": 1, "groupIndex": 1, "flip":"none", "eDebugDraw":false, "eDraw": true, "useImageSize": false, "showImage":true, "frames": ["/data/images/square.png"]} } \n\
                } \n\
            );   \n\
/* end */ \n\n\
}}); \n\
		            <\/script>  \n\
		      </div> \n\
		    </div> \n\
		  </div> \n\
		</div> \n\
		<script name="start">  \n\
(function(){ \n\n\
G.start("scene",{"id":"scene1"});   \n\n\
})(); \n\
		<\/script>  \n\
	</body> \n\
</html> \n\
      ';

		 	gAccount.createFile( Base64.encode(content), gameName + ".html", "text/html", [{"id": gAccount.getFileId(gameName, [ "Generis Account", "Games" ]) }], createGamefolder0 ); 
		} 


		 if (accLoaded){
		 	document.getElementById("createdFile").innerHTML = " creating " + gameName + " folder "  ;
		 	var This = this;  
		 	this.gameName = gameName; 
 
		 	var publish = function(resp){
		 		gAccount.publish(resp.id, createGamefolder); 
		 		This.gameSource = "https://drive.google.com/uc?id=" + resp.id; //"https://googledrive.com/host/" + resp.id; 
		 		//console.log(This.gameSource);
		 	};

			gAccount.createFolder(gameName, [{"id": gAccount.getFileId("Games", [ "Generis Account" ])}], publish );

			
			//this.createWindows();
		 } 
    },

    dropBoxSetup: function(name) {

    },

    oneDriveSetup: function(name) {

    },



    createWindows : function(){ 
          generisBusy = false;
	      setCursorByID("body", "default");
	    
    	  document.getElementById("createdFile").innerHTML = " Creating initial Windows "; 

    	  var text = ' \n\
<!DOCTYPE html> \n\
<html> \n\
	<head>  \n\
		<title>'+gameName+'</title> \n\
		<meta name="description" content="'+gameName+' Online Html Game"> \n\
		<meta name="keywords" content="'+gameName+',Generis,Game,html"> \n\
		<meta name="author" content="'+gAccount.displayName+'"> \n\
		<script src="https://cdn.rawgit.com/Nangue-Tasse/generis2d/79fc21c/generis2d.min.js"><\/script>   \n\
	</head> \n\
	<body style="background-color:#000"> \n\
		<div id="game"> </div > \n\
		<script name="init"> \n\
(function(){ \n\n\
G.WtoH = 5/5;  \n\
var canvas = G.new("canvas", { "id": "canvas", "container": "game", "width": 1000, "height": 1000}); \n\n\
})(); \n\
		<\/script>  \n\
		<div name="scenes"> \n\
		  <div name="scene1"> \n\
		    <script name="scene1">  \n\
(function(){ \n\n\
/* scene1 creation */ \n\
var scene1 = G.new("scene", { "id": "scene1", "canvas": "canvas", "width": 1000, "height": 1000, "WtoH":1, "gravity":{"x":0,"y":200} } ); \n\
/* end */ \n\n\
})(); \n\
		    <\/script>  \n\
		    <div name="cameras"> \n\
		      <div name="camera1"> \n\
		        <script name="camera1"> \n\
G.scenes["scene1"].add("eventListener", {id:"onStart", pre: function() { \n\
var scene1 = G.scenes["scene1"]; \n\n\
/* camera1 creation */ \n\
var camera1 = scene1.new("camera", {"id": "camera1", "width": 1000, "height": 1000}); \n\
/* end */ \n\n\
}}); \n\
		        <\/script>  \n\
		      </div> \n\
		    </div> \n\
		    <div name="entities">   \n\
		        <div name="player"> \n\
		            <script name="player"> \n\
G.scenes["scene1"].add("eventListener", {id:"onStart", pre: function() { \n\
var scene1 = G.scenes["scene1"]; \n\n\
/* player creation */ \n\
var player = scene1.new("entity",  \n\
                { "id":"player",  \n\
                  "idleBody": "idle", \n\
                  "bodies":{ "idle": { "x":100, "y":100, "z":0, "width": 150, "height": 200, "type":"static", "alpha": 1, "groupIndex": 1, "flip":"none", "eDebugDraw":false, "eDraw": true, "useImageSize": false, "showImage":true, "frames": ["/data/images/square.png"]} } \n\
                } \n\
            );   \n\
/* end */ \n\n\
}}); \n\
		            <\/script>  \n\
		      </div> \n\
		    </div> \n\
		  </div> \n\
		</div> \n\
		<script name="start">  \n\
(function(){ \n\n\
G.start("scene",{"id":"scene1"});   \n\n\
})(); \n\
		<\/script>  \n\
	</body> \n\
</html> \n\
      ';
    	  game.gameCode = document.createElement( 'html' ); 
	  	  game.gameCode.innerHTML = correctPaths(text);
		  game.refreshScenes();

    	  var a = 6;
    	  var w = $('#workSpace').width();
    	  var h = $('#workSpace').height();

		  var window1 = new WindowClass( "sceneEditor", (3.75/100)*w, (5/100)*h, (45/100)*w , (90/100)*h , "scene1"); 
		  game.activeWindows[window1.id] = window1; 
		  var window2 = new WindowClass( "sceneViewer", (51.25/100)*w, (5/100)*h, (45/100)*w , (90/100)*h , "scene1");
		  // window2.tabs["sceneViewer_scene1"].refresh();
		  game.activeWindows[window2.id] = window2;  

		  gAccount.saveFilesInfo(function(){
	          generisBusy = false;
		      setCursorByID("body", "default");
		      newGStatusPopup.close();
		  });  

    }, 

    deleteEntity: function(scene, param) {
		for(var i in game.activeWindows){  
			var elements = document.getElementById( game.activeWindows[i].id ); 
			var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
			var tab = game.activeWindows[i].tabs[tabCur2.id];  
			if(tab.type=="script" && tab.title == param.id) game.activeWindows[i].closeTab();	 
        }

    	$("#Entity [name=id] select").val(""); 
    	$("#Entity [name=scene] input").val(""); 
    	$("#Entity [name=idleBody] input").val(""); 
    	$("#Entity [name=x] input").val("");  
    	$("#Entity [name=y] input").val("");  
    	$("#Entity [name=z] input").val("");  
    	$("#Entity [name=angle] input").val("");  
    	$("#Entity [name=width] input").val("");  
    	$("#Entity [name=height] input").val("");  
    	$("#Entity [name=radius] input").val("");    
    	$("#Entity [name=width] input").val("");  
    	$("#Entity [name=height] input").val("");
    	$("#sidr-id-bImages").val(""); 

    	delete game.scenes[scene].entities[param.id];
    	game.refreshList();
    	game.refreshGameCode();
    },

    setParams: function(type, params) {
    	switch(type) {
    		case "scene":
    			if(game.scenes[params.param.id]) {
					var s = game.scenes[params.param.id].script;
					var idx = s.indexOf('"id":');  
					s = s.replace(s.substring(idx, s.indexOf('/* end */')), JSON.stringify(params.param).substring(1)+');\n');
					s = js_beautify(s);
					game.scenes[params.param.id].script = s;
					game.scenes[params.param.id].params = params.param;
					$(this.gameCode).find('[name=scenes] [name='+params.param.id+'] [name='+params.param.id+']') .text(s);
					
    			} else { 
					var scene = document.createElement( 'div' );
				  	scene.setAttribute("name",params.param.id); 
				  	scene.innerHTML += ' \n <script name="'+params.param.id+'"> \n (function(){ \n\n /* '+params.param.id+' creation */ \n  var '+params.param.id+' = G.new("scene", '+JSON.stringify(params.param)+' ); \n\ /* end */\n\n })(); \n <\/script> \n';
				  	scene.innerHTML += "<div name='cameras'></div>";
				  	scene.innerHTML += "<div name='entities'></div>";
    				$(game.gameCode).find("[name=scenes]").append(scene);

    				game.scenes[params.param.id] = {
    					script: '(function(){ \n\n /* '+params.param.id+' creation */ \n  var '+params.param.id+' = G.new("scene", '+JSON.stringify(params.param)+' ); \n /* end */\n\n })(); \n',
						params: params.param, 
						entities: {},
						cameras: {}, 
    				};
					this.refreshList();
    			}
    			break;
    		case "entity":
    			if(game.scenes[params.scene].entities[params.param.id]) {
					var s = game.scenes[params.scene].entities[params.param.id].script;
					var idx = s.indexOf('"id":');  
					s = s.replace(s.substring(idx, s.indexOf('/* end */')), JSON.stringify(params.param).substring(1)+');\n');
					s = js_beautify(s);
					game.scenes[params.scene].entities[params.param.id].script = s;
					game.scenes[params.scene].entities[params.param.id].params = params.param;
					$(this.gameCode).find('[name=scenes] [name='+params.scene+'] [name='+params.param.id+'] [name='+params.param.id+']') .text(s);
    			} else { 
					var entity = document.createElement( 'div' );
				  	entity.setAttribute("name",params.param.id); 
				  	entity.innerHTML += ' \n <script name="'+params.param.id+'"> \n G.scenes["'+params.scene+'"].add("eventListener", {id:"onStart", pre: function() { \n var '+params.scene+' = G.scenes["'+params.scene+'"]; \n\n /* '+params.param.id+' creation */ \n var '+params.param.id+' = '+params.scene+'.new("entity", '+JSON.stringify(params.param)+' ); \n /* end */\n\n }}); \n <\/script> \n '; 
    				$(game.gameCode).find("[name=scenes] [name="+params.scene+"] [name=entities]").append(entity);

    				game.scenes[params.scene].entities[params.param.id] = {
    					script: 'G.scenes["'+params.scene+'"].add("eventListener", {id:"onStart", pre: function() { \n var '+params.scene+' = G.scenes["'+params.scene+'"]; \n\n /* '+params.param.id+' creation */ \n  var '+params.param.id+' = '+params.scene+'.new("entity", '+JSON.stringify(params.param)+' ); \n /* end */\n\n }}); \n',
						params: params.param,  
    				}; 
					this.refreshList();
    			}
    			break;
    		case "camera":
    			if(game.scenes[params.scene].cameras[params.param.id]) {
					var s = game.scenes[params.scene].cameras[params.param.id].script;
					var idx = s.indexOf('"id":');  
					s = s.replace(s.substring(idx, s.indexOf('/* end */')), JSON.stringify(params.param).substring(1)+');\n');
					s = js_beautify(s);
					game.scenes[params.scene].cameras[params.param.id].script = s;
					game.scenes[params.scene].cameras[params.param.id].params = params.param;
					$(this.gameCode).find('[name=scenes] [name='+params.scene+'] [name='+params.param.id+'] [name='+params.param.id+']') .text(s);
    			} else { 
					var camera = document.createElement( 'div' );
				  	camera.setAttribute("name",params.param.id); 
				  	camera.innerHTML += ' \n <script name="'+params.param.id+'"> \n G.scenes["'+params.scene+'"].add("eventListener", {id:"onStart", pre: function() { \n var '+params.scene+' = G.scenes["'+params.scene+'"]; \n\n /* '+params.param.id+' creation */ \n var '+params.param.id+' = '+params.scene+'.new("camera", '+JSON.stringify(params.param)+' ); \n /* end */ \n\n }});\n <\/script> \n '; 
    				$(game.gameCode).find("[name=scenes] [name="+params.scene+"] [name=cameras]").append(camera);

    				game.scenes[params.scene].cameras[params.param.id] = {
    					script: 'G.scenes["'+params.scene+'"].add("eventListener", {id:"onStart", pre: function() { \n var '+params.scene+' = G.scenes["'+params.scene+'"]; \n\n /* '+params.param.id+' creation */ \n  var '+params.param.id+' = G.new("camera", '+JSON.stringify(params.param)+' ); \n /* end */\n\n }}); \n',
						params: params.param,  
    				};
					this.refreshList();
    			}
    			break;
    	}
    },

    refreshScenes: function(){
    	var scenes={};
		var scene = ""
		$(game.gameCode).find("[name=scenes] div").each(function(){
			var name=$(this).attr('name');
			var parent=$(this).parent().attr('name');
			if(parent=="scenes") { 
				scene = name;
				var script = $(this).find("[name="+name+"]").text();
				var s = script.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'');
				s = s.substring(s.indexOf('{"id":'), s.indexOf(');/*end*/'));
				var params = JSON.parse(s);

				scenes[scene] = {
					script: script,
					params:params, 
					entities: {},
					cameras: {}, 
				};
			} else if(parent=="entities") {  
				var script = $(this).find("[name="+name+"]").text();
				var s = script.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'');
				s = s.substring(s.indexOf('{"id":'), s.indexOf(');/*end*/'));
				var params = JSON.parse(s);
				params.x = params.x || 0;
				params.y = params.y || 0;
				params.z = params.z || 0;

				scenes[scene].entities[name] = {
					script: script, 
					params:params, 
				}
			} else if(parent=="cameras") { 
				var script = $(this).find("[name="+name+"]").text();
				var s = script.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'');
				s = s.substring(s.indexOf('{"id":'), s.indexOf(');/*end*/'));
				var params = JSON.parse(s);
				params.x = params.x || 0;
				params.y = params.y || 0;
				params.z = params.z || 0;

				scenes[scene].cameras[name] = {
					script: script, 
					params:params, 					
				}
			}
		})
		game.scenes = scenes; 
		game.refreshList();
    },

    refreshList: function(){
    	var scenes = game.scenes;
    	var scripts = document.getElementById("scripts");
    	scripts.innerHTML = "";
		var scenes1 = document.getElementById("scenes1");
    	scenes1.innerHTML = "";
		var scenes2 = document.getElementById("scenes2");
    	scenes2.innerHTML = "";
    	$("#Scene [name=id] select").html("");
    	$("#Entity [name=id] select").html("");
    	$("#Camera [name=id] select").html("");
		for(var scene in scenes){
			$("#Scene [name=id] select").append("<option value='"+scene+"'>"+scene+"</option>");
			$(scenes1).append( '<li><a href="#" onclick="SCENEEditor(\''+scene+'\')" tabindex="-1">'+scene+'</a></li>' );
			$(scenes2).append( '<li><a href="#" onclick="SCENEViewer(\''+scene+'\')" tabindex="-1">'+scene+'</a></li>' );
			var text1 = '<li class="dropdown-submenu"><a href="#" onclick="JSEditor(\''+scene+'\')" tabindex="-1">'+scene+'</a> \
						 <ul id="scenes1" class="dropdown-menu" style="overflow: auto;max-height: 400px;"> ';
			var text3 = '</ul> </li>';
			var text2 = "";
			for(var object in scenes[scene].entities){
				$("#Entity [name=id] select").append("<option value='"+object+"'>"+object+"</option>");
				text2 += '<li><a href="#" onclick="JSEditor(\''+object+'\',\''+scene+'\',\'entities\')" tabindex="-1">Entity: '+object+'</a></li>';
			}
			for(var object in scenes[scene].cameras){
				$("#Camera [name=id] select").append("<option value='"+object+"'>"+object+"</option>");
				text2 += '<li><a href="#" onclick="JSEditor(\''+object+'\',\''+scene+'\',\'cameras\')" tabindex="-1">Camera: '+object+'</a></li>';
			}
			$(scripts).append( text1 + text2 + text3 );
		}
    },

    reloadGameCode: function(cBack){ 
		//game.gameCode = document.createElement( 'html' ); 
		gAccount.getFilesContent("id", gAccount.getFileId(game.gameName+".html" , [ "Generis Account", "Games", game.gameName ]), callback);   
		function callback (text) { 
			game.gameCode = document.createElement( 'html' ); 
			game.gameCode.innerHTML = correctPaths(text);
			game.refreshScenes();
			if(cBack) cBack();
		}    
    },

    refreshGameCode: function(){ 
    	var code = document.createElement( 'div' ); 
		for(var s in game.scenes){
			var scene = document.createElement( 'div' );
		  	scene.setAttribute("name",s); 
		  	scene.innerHTML += "<script name='"+s+"'>"+game.scenes[s].script+"<\/script>";
		  	scene.innerHTML += "<div name='cameras'></div>";
		  	scene.innerHTML += "<div name='entities'></div>";
 
		  	for(var e in game.scenes[s].entities){
				var entity = document.createElement( 'div' );
			  	entity.setAttribute("name",e);
			  	entity.innerHTML += "<script name='"+e+"'>"+ game.scenes[s].entities[e].script+"<\/script>";
			  	$(scene).find("[name=entities]").append(entity);
		  	}
		  	for(var c in game.scenes[s].cameras){
				var camera = document.createElement( 'div' );
			  	camera.setAttribute("name",c);
			  	camera.innerHTML += "<script name='"+c+"'>"+ game.scenes[s].cameras[c].script+"<\/script>";
			  	$(scene).find("[name=cameras]").append(camera);
		  	}
		  	code.appendChild(scene);
	    }
	    $(game.gameCode).find("[name=scenes]").html($(code).html());

    },

    getEntities: function(scene){

    },

    close : function(){  
        generisBusy = true;
	    setCursorByID("body", "wait");
	     
	 	for (var key in game.activeWindows) {
		    game.activeWindows[key].close(); 
	    }
	    
	    game=null;
	     
	    generisBusy = false;
	    setCursorByID("body", "default");
	    
	 
    },

    // can all be overloaded by child classes
    update : function() { },

});





