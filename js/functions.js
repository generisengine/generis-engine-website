	
	
	function setCursorByID(id,cursorStyle) {
	 var elem;
	 if (document.getElementById &&
		(elem=document.getElementById(id)) ) {
	  if (elem.style) elem.style.cursor=cursorStyle;
	 }
	}

	function correctPaths(str) {
		try{ 
		    var idx = -1;
		    while(true){
              idx = str.indexOf("Libraries/", idx);
              if(idx>=0) {
                var idx1 = str.indexOf("\"", idx);
                if(idx1<0) idx1 = str.indexOf("'", idx);
                var s = str.substring(idx,idx1);
		        var path = s.split('/');
		        var id = gAccount.getFileId(path.pop(), ["Generis Account", "Games", game.gameName].concat(path));
		        var re = new RegExp(s, 'g'); 
		        str = str.replace(re, "https://drive.google.com/uc?id="+id);
		        idx=idx1;
		      } else break;
		    }

		    var idx = -1;
		    while(true){
              idx = str.indexOf("Media/", idx);
              if(idx>=0) {
                var idx1 = str.indexOf("\"", idx);
                if(idx1<0) idx1 = str.indexOf("'", idx);
                var s = str.substring(idx,idx1);
		        var path = s.split('/');
		        var id = gAccount.getFileId(path.pop(), ["Generis Account", "Games", game.gameName].concat(path));
		        var re = new RegExp(s, 'g'); 
		        str = str.replace(re, "https://drive.google.com/uc?id="+id);
		        idx=idx1;
		      } else break;
		    }
		} catch(e){console.log(e);}
		return str;
    }

    function getLocation(href) {
	    var l = document.createElement("a");
	    l.href = href;
	    return l;
	};



	function chgThemes(themeName){
	    if(generisBusy ) return;
		if(themeName == 'More' || themeName == 'doomNight') $('#NotAvaillable').bPopup(fontsize);
		else { 
			var body = document.getElementById("body"); 
			gAccount.filesInfo[0].theme = themeName;
			body.className=gAccount.filesInfo[0].theme + " bg";   

			if(gAccount.filesInfo[0].Background ) 
				$('#workSpace').css('background-image', 'url(' + gAccount.filesInfo[0].Background + ')'); 
			if(themeName == 'twilight') {
				$('#workSpace').css('background-image', 'url(/data/images/generisWall1.jpg)');  
			} else if(themeName == 'moonB') {
				$('#workSpace').css('background-image', 'url(/data/images/generisWall2.jpg)'); 
			}

			if(themeTT) try { themeTT.close(); } catch(e) {} 
		}
	}


	function AstStore(){
	    if(generisBusy || !game) return;
		$('#NotAvaillable').bPopup(fontsize);
	}

	function PubGames(){
	    if(generisBusy || !game) return;
		$('#NotAvaillable').bPopup(fontsize);
	}

	function Home(){
	    if(generisBusy || !game) return;
		$('#NotAvaillable').bPopup(fontsize);
	}

	 function File(){
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) { 
		}
	}
	 
	 function NewGame(){
	    if(generisBusy) return;
	    
	    generisBusy = false;
	    setCursorByID("body", "default");      

		if(log.innerHTML == "LOGOUT" ) {

			setCursorByID("body", "default"); 
			accLoaded = true;

			newGPopup = $('#newGPopUp').bPopup(fontsize);    
		}
	}

	function NewGame1( ){ 
	    if(generisBusy) return;
	    
	    generisBusy = true;     
        setCursorByID("body", "wait");
		var newG = function(){
			gameName = document.getElementById("gameNText").value;
		 	if ( gameName == "" ) { 
		 		generisBusy = false;
		        setCursorByID("body", "default"); 
				$('#warning #warningPopup').html("Please enter the game name");
		    	$('#warning').bPopup(fontsize);
		 		return;
		 	} 
		 	if( game ) game.close();  
		    try { newGPopup.close(); } catch(e) {}

			if(gAccount.getFileId(gameName , [ "Generis Account", "Games"])){
		 		generisBusy = false;
		        setCursorByID("body", "default"); 
				$('#warning #warningPopup').html("Game already exist");
		    	$('#warning').bPopup(fontsize);
		 		return;				
			}

		    newGStatusPopup = $('#newGStatusPopup').bPopup(fontsize); 

		    game = new GameClass(gameName);  
		    game.newGame(gAccount.Host);	

		    
		}
		
		gAccount.saveFilesInfo( newG );  

	} 
	
	function openGame() {
	    if(generisBusy ) return;
		
		var gameN = document.getElementById("gameN").value; 
	 	if ( gameN == "" ) { 
	 		generisBusy = false;
	        setCursorByID("body", "default"); 
			$('#warning #warningPopup').html("Please enter the game name");
	    	$('#warning').bPopup(fontsize);
	 		return;
	 	} 

		generisBusy = true;
	    setCursorByID("body", "wait"); 
	    openGP =  $('#openGP').bPopup(fontsize);
		
		var openG = function(){

		 	if( game ) game.close(); 
		    
		    try { 
		    	try { openGameTT.close(); } catch(e) {}

			    var g = gAccount.getFileD(gAccount.getFileId(gameN, ["Generis Account", "Games"])); 
				
				if(!g.gameData){
					$('#warning #warningPopup').html("Game not found.");
					$('#warning').bPopup(fontsize);
				} else {
					$("#Images [name=main]").html(replaceAll(g.gameData[7], "&#9;", "")); 
					try{ game.published = g.gameData[6]; } catch(e){}
	
					game = new GameClass(g.gameData[0]);
					game.gameSource = g.gameData[1];
					game.activeWindow = g.gameData[3];
					game.currPath = g.gameData[4];
					game.reloadGameCode(cBack); 
					
					function cBack() { 
						var wndsData = g.gameData[2];
						
						for(var i in wndsData){
							var wdsD =  g.gameData[5];
							var h = $('#menubar').height();
							var actWindow = new WindowClass("empty", wdsD[i][0], wdsD[i][1]-h, wdsD[i][2], wdsD[i][3]);
							game.activeWindow = actWindow.id;
							game.activeWindows[actWindow.id] = actWindow;

							var tabs = wndsData[i];          
							for(var j in tabs){
								if(tabs[j][1]) { 
									var f = function(text) {
										actWindow.createTab(tabs[j][3], tabs[j][0], text).path = tabs[j][1] ;
									}; 
									gAccount.getFilesContent("id", gAccount.getFileId(tabs[j][0] , tabs[j][1]), f);  
								} else {
									if(tabs[j][3]=="script") JSEditor(tabs[j][0], tabs[j][2].parent1, tabs[j][2].parent2);
									else actWindow.createTab(tabs[j][3], tabs[j][0], tabs[j][1]) ; 
								}
							}
						}
						
						console.log(" Game Opened");
					}
				} 
            } catch(e) {
            	console.log(e);
            	$('#logError').bPopup(fontsize);
            }
            if(openGP) try { openGP.close(); } catch(e) {}
	        generisBusy = false;
	        setCursorByID("body", "default"); 
		    
		}
		
		gAccount.saveFilesInfo( openG );  
	}
	
	function fileOpenT(){
	    if(generisBusy || !game) return;
		
		var fileDiv = document.getElementById("filePath");
		var file = "Generis Account/Games/"+game.gameName+"/"+fileDiv.value;  
		if(file == "") {
        	$('#logError').bPopup(fontsize);
        	return;
        }
		try { 
			var fileArr = file.split('/'); 
			var fileName = fileArr.pop();
			var filePath = fileArr;
			
			var fileExt = fileName.split('.')[1]; 
			
			if ( fileExt == "js"){ 
				var f = function(text) {
					game.activeWindows[game.activeWindow].createTab("script", fileName, text).path = filePath ;  
				}; 
				gAccount.getFilesContent("id", gAccount.getFileId(fileName , filePath), f);    
			} else if ( fileExt == "css"){
				var f = function(text) {
					game.activeWindows[game.activeWindow].createTab("style", fileName, text).path = filePath ;  
				}; 
				gAccount.getFilesContent("id", gAccount.getFileId(fileName , filePath), f);      
			} else if ( fileExt == "html"){   
				var f = function(text) {
					game.activeWindows[game.activeWindow].createTab("markup", fileName, text).path = filePath ; 
				}; 
				gAccount.getFilesContent("id", gAccount.getFileId(fileName , filePath), f);   
			} else {
				$('#warning #warningPopup').html("Please add a valid file type.");
		    	$('#warning').bPopup(fontsize); 
			}
		} catch(e) {
        	$('#logError').bPopup(fontsize);
        }
		
		try { fileOpenTabT.close(); } catch(e) {}
		
	}
	
	function closeTabT(){
	    if(generisBusy || !game) return;
		
		game.activeWindows[game.activeWindow].closeTab() ;
		try { windowProps.close(); } catch(e) {}
		
	}
	
	function fileSaveT( file ){
	    if(generisBusy || !game) return; 
		 
		if(!file) file = "Generis Account/Games/"+game.gameName+"/"+document.getElementById("fileName").value;  
		if(file=="") {
			$('#warning #warningPopup').html("Please enter the file path and name");
	    	$('#warning').bPopup(fontsize);
			return;
		}
		try{ 
			var fileArr = file.split('/'); 
			var fileName = fileArr.pop(); 
			var filePName = fileArr.pop();
			var filePPath = fileArr;
			
			var fileExt = fileName.split('.')[1];
			
			console.log(fileName +"__"+ fileExt +"__"+ filePName +"__"+ filePPath);
			
			var elements = document.getElementById( game.activeWindow );
	        
			var tabCur2 = elements.getElementsByClassName("tab-link active")[0];
			  
			//console.log(tabCur2.id);
			
			var tab = game.activeWindows[game.activeWindow].tabs[tabCur2.id];
			var data = tab.tabObj.getValue();

			tab.title = fileName;
	        tab.path = JSON.parse(JSON.stringify(filePPath)) ;
	        tab.path.push(filePName); 
	        tab.tabId = "editor" + fileName;   
	        if(tab.save) {
	        	tab.save();
	        	return;
	        }
 			if ( fileExt == "js"){ 
       			this.type = "script" ;
				gAccount.saveFiles(fileName, "text/javascript", [{"id": gAccount.getFileId(filePName, filePPath)}], data );
			} else if ( fileExt == "html"){
       			this.type = "markup" ;
				gAccount.saveFiles(fileName, "text/html", [{"id": gAccount.getFileId(filePName, filePPath)}], data );
			} else if ( fileExt == "css"){
       			this.type = "style" ;
				gAccount.saveFiles(fileName, "text/CSS", [{"id": gAccount.getFileId(filePName, filePPath)}], data );  
			}  else {
				$('#warning #warningPopup').html("Please add a valid file type.");
		    	$('#warning').bPopup(fontsize); 
			} 
            $( '#' + game.activeWindow + " div.tabsBar .active .title" ).html(fileName);  
			tabCur2.id = fileName;
			game.reloadGameCode(); 
		} catch(e) {
			console.log(e);
        	$('#logError').bPopup(fontsize);
        }
	}
	
	function fileSaveA(){
	    if(generisBusy || !game) return;
	
	    var elements = document.getElementById( game.activeWindow );
 
		var tabCur2 = elements.getElementsByClassName("tab-link active")[0];

        var elements = document.getElementById( "fileName" );
        elements.value = game.currPath + "/" + tabCur2.id; 
 
		var fPath = game.currPath.split('/');
		
		if (gAccount.getFileId(tabCur2.id, fPath) ){
		    console.log("yes");
		    fileSaveT();
		} else {
	       saveFileT = $('#saveFileT').bPopup(fontsize);
		}
		
		try { windowProps.close(); } catch(e) {}
		
	}

	function saveFile(){
	    if(generisBusy || !game) return; 

	    var elements = document.getElementById( game.activeWindow ); 
		var tabCur2 = elements.getElementsByClassName("tab-link active")[0];
        var tab = game.activeWindows[game.activeWindow].tabs[tabCur2.id]; 
        var filePath = tab.path;
        //if(tab.tabType == "script"  || tab.tabType == "style" || tab.tabType == "markup") { 
			if (gAccount.getFileId(tabCur2.id, filePath) ){
			    console.log("yes");
			    fileSaveT(filePath.join("/") + "/" + tabCur2.id);
			} else {
		       saveFileT = $('#saveFileT').bPopup(fontsize);
			}
		//}
		 
	}

	function newFile(){
	    if(generisBusy || !game) return; 
		
		var fileDiv = document.getElementById("newFileName");
		var file = "Generis Account/Games/"+game.gameName+"/"+fileDiv.value;  
		if(file=="")  {
			$('#warning #warningPopup').html("Please enter the file path and name");
	    	$('#warning').bPopup(fontsize);
			return;
		}
		try{ 
			var fileArr = file.split('/'); 
			var fileName = fileArr.pop(); 
			var filePName = fileArr.pop();
			var filePPath = fileArr; 
			var fileExt = fileName.split('.')[1];
			var filePath = JSON.parse(JSON.stringify(filePPath));
			filePath.push(filePName)
			var callback; 

			if ( fileExt == "js"){ 
				callback = function() { filePPath.push(filePName); game.activeWindows[game.activeWindow].createTab("script", fileName, "/***New File***/").path = filePPath ; };
				gAccount.saveFiles(fileName, "text/javascript", [{"id": gAccount.getFileId(filePName, filePPath)}], "/***New File***/", callback );
			} else if ( fileExt == "html"){
				callback = function() { filePPath.push(filePName);  game.activeWindows[game.activeWindow].createTab("markup", fileName, "<!doctype html>").path = filePPath ; };
				gAccount.saveFiles(fileName, "text/html", [{"id": gAccount.getFileId(filePName, filePPath)}], "<!doctype html>", callback );
			} else if ( fileExt == "css"){
				callback = function() { filePPath.push(filePName);  game.activeWindows[game.activeWindow].createTab("style", fileName, "/***New File***/").path = filePPath ; };
				gAccount.saveFiles(fileName, "text/CSS", [{"id": gAccount.getFileId(filePName, filePPath)}], "/***New File***/", callback );  
			} else {
				$('#warning #warningPopup').html("Please add a valid file type.");
		    	$('#warning').bPopup(fontsize); 
			}
		} catch(e) {
        	$('#logError').bPopup(fontsize);
        }
	}

	function closeWindow(){
	    if(generisBusy || !game) return; 
	    var wins = Object.keys(game.activeWindows);
		if(wins.length!=0) {
			game.activeWindows[game.activeWindow].close(); 
			$( 'div.pane').removeClass('active');  
			if(wins.length>=2) {  
	        	game.activeWindow = wins[wins.length-2];
	        	$(game.activeWindow).addClass('active');  
			}  
	    }
	}

	function newWindow(){
	    if(generisBusy || !game) return; 
		var window1 = new WindowClass( "empty", 17, 5, 500 , 500 , undefined); 
	  	game.activeWindows[window1.id] = window1; 
	}

	function newScene(){
	    if(generisBusy || !game) return; 
	    newWindow();
		var id = Object.keys(game.scenes).length+1; 
	    var params = {param:{ "id": "scene"+id, "canvas": "canvas", "width": parseInt($("#sidr-id-dScene [name=width] input").val()), "height": parseInt($("#sidr-id-dScene [name=height] input").val()), "WtoH": parseInt($("#sidr-id-dScene [name=WtoH] input").val()), "gravity": {"x":parseInt($("#sidr-id-dScene [name=gravityX] input").val()), "y": parseInt($("#sidr-id-dScene [name=gravityY] input").val())} }};
		game.setParams("scene", params);
		SCENEEditor("scene"+id);
		SCENEViewer("scene"+id); 
	}

	function newCamera(){
	    if(generisBusy || !game) return; 
		var scene = $("#Scene [name=id] select").val(); 
		var id = Object.keys(game.scenes[scene].cameras).length+1; 
	    var params = {scene: scene, param:{"id": "camera"+id, "x":parseInt($("#sidr-id-dCamera [name=x] input").val()), "y":parseInt($("#sidr-id-dCamera [name=y] input").val()), "z":parseInt($("#sidr-id-dCamera [name=z] input").val()), "width": parseInt($("#sidr-id-dCamera [name=width] input").val()), "height": parseInt($("#sidr-id-dCamera [name=height] input").val())}};
		game.setParams("camera", params); 
		for(var i in game.activeWindows){ 
			var elements = document.getElementById( game.activeWindows[i].id ); 
			var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
			var tab1 = game.activeWindows[i].tabs[tabCur2.id];   
			if(tab1.type=="sceneEditor" && tab1.title == $("#Scene [name=id] select").val()) tab1.refresh();	
			if(tab1.type=="scriptEditor" && tab1.title == $("#Entity [name=id] select").val()) tab1.refresh();
			if(tab1.type=="sceneViewer" && tab1.title == $("#Entity [name=id] select").val()) tab1.refresh();		 
        }
	}

	function newAnim(){
		var anim = " \
<li data-sel='true'> \
<span> <img src='data/images/close.png' name='close'> Edit  <img src='data/images/delete.png' name='delete'> </span>   \
<div draggable='true'> <a> \
</a> </div>  \
</li>  \
		";
	    $("#Images ul[name=main]").prepend(anim);
	}
	
	function JSEditor(name, parent1, parent2){
	    if(generisBusy || !game) return;
		var tab;
		var text;
		if(parent1) text = game.scenes[parent1][parent2][name].script;
		else text = game.scenes[name].script;
		if(Object.keys(game.activeWindows).length>0)
			tab = game.activeWindows[game.activeWindow].createTab("script", name, text) ;   
		else {
			var window1 = new WindowClass( "script", 3.75, 5, 300 , 200 , name, text); 
			tab = window1.tabs["script_"+name];
		  	game.activeWindows[window1.id] = window1; 
		}
		tab.parent = {parent1:parent1,parent2:parent2};
		
		if(parent1) tab.save = function() {
						var script = tab.tabObj.getValue();
						game.scenes[parent1][parent2][name].script = script;
						var s = script.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'');
						s = s.substring(s.indexOf('{"id":'), s.indexOf(');/*end*/'));
						var params = JSON.parse(s);
						game.scenes[parent1][parent2][name].params = params;
						game.refreshGameCode(); 
						for(var i in game.activeWindows){ 
							var elements = document.getElementById( game.activeWindows[i].id ); 
							var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
							var tab1 = game.activeWindows[i].tabs[tabCur2.id];   
							if(tab1.type=="sceneEditor" && tab1.title == parent1) tab1.refresh();	
							if(tab1.type=="sceneViewer" && tab1.title == name) tab1.refresh();	 
				        }
					};
		else tab.save = function() {
						var script = tab.tabObj.getValue();
						game.scenes[name].script =  script;
						var s = script.replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'');
						s = s.substring(s.indexOf('{"id":'), s.indexOf(');/*end*/'));
						var params = JSON.parse(s);
						game.scenes[name].params = params;
						game.refreshGameCode(); 
						for(var i in game.activeWindows){ 
							var elements = document.getElementById( game.activeWindows[i].id ); 
							var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
							var tab1 = game.activeWindows[i].tabs[tabCur2.id];   
							if(tab1.type=="sceneEditor" && tab1.title == name) tab1.refresh();	
							if(tab1.type=="sceneViewer" && tab1.title == name) tab1.refresh();	  
				        }
	    	 		};
	    if(parent1) tab.refresh = function() {
						tab.tabObj.setValue(game.scenes[parent1][parent2][name].script);  
					};
		else tab.refresh = function() {
						tab.tabObj.setValue(game.scenes[name].script); 
	    	 		};
	}

	function CSSEditor(text){
	    if(generisBusy || !game) return;
		
		if(Object.keys(game.activeWindows).length>0)
			game.activeWindows[game.activeWindow].createTab("style", "", text) ;   
		else {
			var window1 = new WindowClass( "style", 3.75, 5, 300 , 200 , "", text); 
		  	game.activeWindows[window1.id] = window1; 
		}
		
		
	}

	function HTMLEditor(text){
	    if(generisBusy || !game) return;
		
		if(Object.keys(game.activeWindows).length>0)
			game.activeWindows[game.activeWindow].createTab("markup", "", text) ;   
		else {
			var window1 = new WindowClass( "markup", 3.75, 5, 300 , 200 , "", text); 
		  	game.activeWindows[window1.id] = window1; 
		}
		
		
	}

	function SCENEEditor(scene){
	    if(generisBusy || !game) return; 
		
		if(Object.keys(game.activeWindows).length>0)
			game.activeWindows[game.activeWindow].createTab("sceneEditor", scene) ;  
		else {
			var window1 = new WindowClass( "sceneEditor", 3.75, 5, 300 , 200 , scene); 
		  	game.activeWindows[window1.id] = window1; 
		}
		
	}

	function SCENEViewer(scene){
	    if(generisBusy || !game) return; 
		
		if(Object.keys(game.activeWindows).length>0)
			game.activeWindows[game.activeWindow].createTab("sceneViewer", scene) ;  
		else {
			var window1 = new WindowClass( "sceneViewer", 3.75, 5, 300 , 200 , scene); 
		  	game.activeWindows[window1.id] = window1; 
		}
		
	}

	function FileBrowser(){
	    if(generisBusy || !game) return;
		
		if(Object.keys(game.activeWindows).length>0)
			game.activeWindows[game.activeWindow].createTab("browser", "browser") ;   
		else {
			var window1 = new WindowClass( "browser", 3.75, 5, 300 , 200 , "browser"); 
		  	game.activeWindows[window1.id] = window1; 
		}
		
		
	}

	function Documentation(){
	    if(generisBusy || !game) return;
		
		if(Object.keys(game.activeWindows).length>0)
			game.activeWindows[game.activeWindow].createTab("Documentation", "Documentation") ;   
		else {
			var window1 = new WindowClass( "Documentation", 3.75, 5, 300 , 200 , "Documentation"); 
		  	game.activeWindows[window1.id] = window1; 
		}
		
		
	}

	function Tutorials(){
	    if(generisBusy || !game) return;
		$("#NotAvaillable").bPopup(fontsize);
		
		
	}

	function AssetsStore(){
	    if(generisBusy || !game) return;
		$("#NotAvaillable").bPopup(fontsize);
		
		
	}



	function Open(){ 
	    if(generisBusy || !game) return;
		
		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) { 
			 
		}

	}

	function saveGame(callback){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  

			var saveG = function() {  			
				generisBusy = true;
		    	setCursorByID("body", "wait");
		    	saveGP =  $('#saveGP').bPopup(fontsize);  
				
				var preData = 
				gAccount.saveFiles((game.gameName+".html"), "text/html", [{"id": gAccount.getFileId(game.gameName, ["Generis Account", "Games"])}], "<!DOCTYPE html> \n <html> \n "+game.gameCode.innerHTML+"\n</html>" );
				
				for(var i in game.activeWindows){ 
		            var tabs = game.activeWindows[i].tabs;          
		            for(var j in tabs){  
						try { 
							var fileExt = tabs[j].title.split('.')[1];
							var data = tabs[j].tabObj.getValue(); 
							var fileP = JSON.parse(JSON.stringify(tabs[j].path));
							var filePName = fileP.pop();
							if ( fileExt == "js"){ 
								gAccount.saveFiles(tabs[j].title, "text/javascript", [{"id": gAccount.getFileId(filePName, fileP)}], data );
							} else if ( fileExt == "html" && tabs[j].type != "game"){
								gAccount.saveFiles(tabs[j].title, "text/html", [{"id": gAccount.getFileId(filePName, fileP)}], data );
							} else if ( fileExt == "css"){
								gAccount.saveFiles(tabs[j].title, "text/CSS", [{"id": gAccount.getFileId(filePName, fileP)}], data );  
							} 
						} catch(e) {
							generisBusy = false;
					    	setCursorByID("body", "default");
						}
						 
		            }
		        }

		        if(saveGP) try { saveGP.close(); } catch(e) {}  
		        if(callback) callback();

	   		};
	   		if(game) gAccount.saveFilesInfo( saveG );  
	   		else newGPopup = $('#newGPopUp').bPopup(fontsize); 
		}
		
	}

	function publishG(){ 
		if(generisBusy || !game) return; 

		generisBusy = true; 
        setCursorByID("body", "wait"); 
 		
 		var postData = { "key_name": Base64.encode( gAccount.emailAddress+game.gameName ), check:"True" };
	    $.post( "/showcase", postData, function( published ) {
			if (published=="True") $('#GUnPublish').css('visibility', 'visible');
			else $('#GUnPublish').css('visibility', 'hidden');
        });   

        gameScreenshots="";
        trailerVideos="";
        
		var callback2 = function(files) {
			try { 
				$("#publishP #trailers").html("");
				for(var i=0;i<files.length;i++) {
					var url = "https://drive.google.com/uc?id="+files[i].id;
				 	if( trailerVideos=="") trailerVideos += url;
				 	else trailerVideos += ", "+url;
					$("#publishP #trailers").append( "<img src='data/images/video.png'/>" );
				}
			} catch(e){}

			publishPP = $('#publishP').bPopup(fontsize);

			generisBusy = false; 
            setCursorByID("body", "default"); 
		} 
		
		var callback1 = function(files) {
			try { 
				$("#publishP #screenshots").html(""); 
				for(var i=0;i<files.length;i++) {
					var url = "https://drive.google.com/uc?id="+files[i].id; 
				 	if( gameScreenshots=="") gameScreenshots += url;
				 	else gameScreenshots += ", "+url;
					$("#publishP #screenshots").append( "<img src='"+ url +"'/>" );
				}
			} catch(e){}
			gAccount.listFilesInFolder( gAccount.getFileId("Trailers", ["Generis Account", "Games", game.gameName, "Media", "Videos" ]) , callback2);
		}  

        gAccount.listFilesInFolder( gAccount.getFileId("Screenshots", ["Generis Account", "Games", game.gameName, "Media", "Images" ]) , callback1);
		 
	} 

	function UnPublish(){
		if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {

			generisBusy = true;
	    	setCursorByID("body", "wait");
	    	deleteGP = $('#deleteGP').bPopup(fontsize);  
 
			var postData = {
				"key_name": Base64.encode( gAccount.emailAddress+game.gameName )
			};
		    $.post( "/showcase", postData, 
		            function( data ) { 
						generisBusy = false;
			    		setCursorByID("body", "default");
			    		try { publishPP.close(); } catch(e) {} 
			    		try { deleteGP.close(); } catch(e) {} 
			    		try { warningPublished.close(); } catch(e) {}

			    		$('#message #messagePopup').html(game.gameName+" UnPublished");
			    		$('#message').bPopup(fontsize);  
                    });   
		} 
	}

	function UnPublishT(){
		if(generisBusy ) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {

			generisBusy = true;
	    	setCursorByID("body", "wait");
	    	deleteGP = $('#deleteGP').bPopup(fontsize); 

 			var titleT = ( document.getElementById("titleT").value );
			var postData = {
				"key_name": Base64.encode( gAccount.emailAddress+titleT )
			};
		    $.post( "/tutorials", postData, 
		            function( data ) { 
						generisBusy = false;
			    		setCursorByID("body", "default");
			    		try { tutorialsPP.close(); } catch(e) {} 
			    		try { deleteGP.close(); } catch(e) {} 
			    		try { warningPublished.close(); } catch(e) {}

			    		$('#message #messagePopup').html(titleT+" UnPublished");
			    		$('#message').bPopup(fontsize);  
                    });   
		} 
	}

	function UnPublishA(){
		if(generisBusy ) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {

			generisBusy = true;
	    	setCursorByID("body", "wait");
	    	deleteGP = $('#deleteGP').bPopup(fontsize);  

 			var nameA = ( document.getElementById("nameA").value );
			var postData = {
				"key_name": Base64.encode( gAccount.emailAddress+nameA )
			};
		    $.post( "/assets", postData, 
		            function( data ) { 
						generisBusy = false;
			    		setCursorByID("body", "default");
			    		try { assetsPP.close(); } catch(e) {} 
			    		try { deleteGP.close(); } catch(e) {} 
			    		try { warningPublished.close(); } catch(e) {}

			    		$('#message #messagePopup').html(nameA+" UnPublished");
			    		$('#message').bPopup(fontsize);  
                    });   
		} 
	}

	function Publish(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) { 
			//newGPopup = $('#Exporter').bPopup(fontsize);   
			if(!game) {newGPopup = $('#newGPopUp').bPopup(fontsize); return;}   

			var developer = correctPaths( document.getElementById("developer").value ); 
			var description = correctPaths( document.getElementById("description").value );

			var checkboxes = document.getElementsByName('genre');
			var genres = "";
			for (var i=0, n=checkboxes.length;i<n;i++) {
			  if (checkboxes[i].checked) 
			  {
			  	if(genres=="")
			  		genres += $("#"+checkboxes[i].id).next("label").html();
			  	else
			  		genres += ", "+ $("#"+checkboxes[i].id).next("label").html();
			  }
			}  
		  	if(genres=="") genres = "All Genres";  

			if( developer == "" || description == "" ) {
				$('#warning #warningPopup').html("Please fill all relevant fields.");
		    	$('#warning').bPopup(fontsize);
				return;
			}
			if( gameScreenshots == "" ) {
				$('#warning #warningPopup').html("You have no screenshots. Please add some in: Media/Images/Screenshots");
		    	$('#warning').bPopup(fontsize);
				return;
			}
			if( trailerVideos == "" ) {
				$('#warning #warningPopup').html("You have no trailers. Please add some in: Media/Videos/Trailers");
		    	$('#warning').bPopup(fontsize);
				return;
			}

			if(publishPP) try { publishPP.close(); } catch(e) {} 

			generisBusy = true; 
            setCursorByID("body", "wait");  

			var postData = {
					"gameId": Base64.encode( gAccount.emailAddress+game.gameName ),
					"userName": gAccount.displayName,
					"userEmail": gAccount.emailAddress,
					"accountHost": gAccount.Host,
					"gameName": game.gameName,
					"developer": developer,
					"genres": genres,
					"description": description,
					"screenshots": gameScreenshots,
					"trailers": trailerVideos,
					"gameCode": "<!DOCTYPE html> \n <html> \n "+correctPaths(game.gameCode.innerHTML)+"\n</html>",
					"gameRating": 5,
					"raters": gAccount.displayName,
					"gameViews": 1,
					"viewers": gAccount.displayName,
				}; 
		    $.post( "/showcase", postData, 
		            function( data ) {
			            publishedP = $('#publishedPP').bPopup(fontsize);
			            generisBusy = false; 
                        setCursorByID("body", "default");
                        console.log("success");
                        game.published = true;
                        game.saveWindows;
                    });  
		}
		
	}

	function PublishTutorial(){ 
	    if(generisBusy ) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {   

			var title = ( document.getElementById("titleT").value ); 
			var description = ( document.getElementById("descriptionT").value );

			var checkboxes = document.getElementsByName('tagT');
			var tags = "";
			for (var i=0, n=checkboxes.length;i<n;i++) {
			  if (checkboxes[i].checked) 
			  {
			  	if(tags=="")
			  		tags += $("#"+checkboxes[i].id).next("label").html();
			  	else
			  		tags += ", "+ $("#"+checkboxes[i].id).next("label").html();
			  }
			}  
		  	if(tags=="") tags = "Beginner";   

			if( title == "" || description == "" ) {
				$('#warning #warningPopup').html("Please fill all relevant fields.");
		    	$('#warning').bPopup(fontsize);
				return;
			}

            var postData = { "key_name": Base64.encode( gAccount.emailAddress+title ), check:"True" };
		    $.post( "/tutorials", postData, function( published ) {
				if (published=="True") $('#TUnPublish').css('visibility', 'visible');
				else $('#TUnPublish').css('visibility', 'hidden');
	        });

			if(tutorialsPP) try { tutorialsPP.close(); } catch(e) {} 
			generisBusy = true; 
            setCursorByID("body", "wait");

			
			tutorialScreenshots="";
	        tutorialVideos="";

	        
			var callback2 = function(files) {
				try { 
					$("#publishP #tutorials").html("");
					for(var i=0;i<files.length;i++) {
						var url = "https://drive.google.com/uc?id="+files[i].id ;
					 	if( tutorialVideos=="") tutorialVideos += url;
					 	else tutorialVideos += ", "+url;
						$("#publishP #tutorials").append( "<img src='data/images/video.png'/>" );
					}
				} catch(e){}

				if( tutorialScreenshots == "" ) {
					$('#warning #warningPopup').html("You have no tutorial screenshots. Please add some in: Generis Account/Profile/Tutorials/"+title+"/Screenshots");
			    	$('#warning').bPopup(fontsize);
			    	generisBusy = false; 
	            	setCursorByID("body", "default"); 
					return;
				}
				if( tutorialVideos == "" ) {
					$('#warning #warningPopup').html("You have no tutorial videos. Please add some in: Generis Account/Profile/Tutorials/"+title+"/Videos");
			    	$('#warning').bPopup(fontsize);
			    	generisBusy = false; 
	            	setCursorByID("body", "default"); 
					return;
				}

				var postData = {  
								"tutorialId": Base64.encode( gAccount.emailAddress+title ),
								"userName": gAccount.displayName,
								"userEmail": gAccount.emailAddress,
								"accountHost": gAccount.Host,
								"tutorialTitle": title, 
								"tags": tags,
								"description": description,
								"screenshots": tutorialScreenshots,
								"tutorials": tutorialVideos,
								"tutorialRating": 5,
								"raters": gAccount.displayName,
								"tutorialViews": 1,
								"viewers": gAccount.displayName,
				            };
			    $.post( "/tutorials", postData, 
				            function( data ) {
					            tutorialP = $('#tutorialsPP').bPopup(fontsize);
					            generisBusy = false; 
		                        setCursorByID("body", "default");
		                        console.log("success");
		                    });
 
				generisBusy = false; 
	            setCursorByID("body", "default"); 
			} 
			
			var callback1 = function(files) {
				try { 
					$("#publishP #screenshotsT").html("");
					for(var i=0;i<files.length;i++) {
						var url = "https://drive.google.com/uc?id="+files[i].id ;
					 	if( tutorialScreenshots=="") tutorialScreenshots += url;
					 	else tutorialScreenshots += ", "+url;
						$("#publishP #screenshotsT").append( "<img src='"+ url +"'/>" );
					}
				} catch(e){}
				gAccount.listFilesInFolder( gAccount.getFileId("Videos", ["Generis Account", "Profile", "Tutorials", title]) , callback2);
			}  

	        gAccount.listFilesInFolder( gAccount.getFileId("Screenshots", ["Generis Account", "Profile", "Tutorials", title]) , callback1);
			 
		}
		
	}

	function PublishAsset(){ 
	    if(generisBusy ) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {   

			var name =  ( document.getElementById("nameA").value ); 
			var description =  ( document.getElementById("descriptionA").value );

			var checkboxes = document.getElementsByName('tagA');
			var tags = "";
			for (var i=0, n=checkboxes.length;i<n;i++) {
			  if (checkboxes[i].checked) 
			  {
			  	if(tags=="")
			  		tags += $("#"+checkboxes[i].id).next("label").html();
			  	else
			  		tags += ", "+ $("#"+checkboxes[i].id).next("label").html();
			  }
			}  
		  	if(tags=="") tags = "Sprites";

			if( name == "" || description == "" ) {
				$('#warning #warningPopup').html("Please fill all relevant fields.");
		    	$('#warning').bPopup(fontsize);
				return;
			}

			if(assetsPP) try { assetsPP.close(); } catch(e) {} 
			generisBusy = true; 
            setCursorByID("body", "wait");

            var postData = { "key_name": Base64.encode( gAccount.emailAddress+name ), check:"True" };
		    $.post( "/assets", postData, function( published ) {
				if (published=="True") $('#AUnPublish').css('visibility', 'visible');
				else $('#AUnPublish').css('visibility', 'hidden');
	        });   
			
			assetScreenshots="";
	        assets="";

	        var callback2 = function(files) {
				try {  
					for(var i=0;i<files.length;i++) {
						var url = "https://drive.google.com/uc?id="+files[i].id ;
					 	if( assets=="") assets += url;
					 	else assets += ", "+url; 
					}
				} catch(e){}
				
				if( assetScreenshots == "" ) {
					$('#warning #warningPopup').html("You have no asset screenshots. Please add some in: Generis Account/Profile/Assets/"+name+"/Screenshots");
			    	$('#warning').bPopup(fontsize);
			    	generisBusy = false; 
	            	setCursorByID("body", "default"); 
					return;
				}
				if( assets == "" ) {
					$('#warning #warningPopup').html("You have no assets. Please add some in: Generis Account/Profile/Assets/"+name+"/Files");
			    	$('#warning').bPopup(fontsize);
			    	generisBusy = false; 
	            	setCursorByID("body", "default"); 
					return;
				}

				var postData = { 
								"assetId": Base64.encode( gAccount.emailAddress+name ),
								"userName": gAccount.displayName,
								"userEmail": gAccount.emailAddress,
								"accountHost": gAccount.Host,
								"assetName": name, 
								"tags": tags,
								"description": description,
								"screenshots": assetScreenshots,
								"assets": assets,
								"assetRating": 5,
								"raters": gAccount.displayName,
								"assetViews": 1,
								"viewers": gAccount.displayName,
				            };
			    $.post( "/assets", postData, 
				            function( data ) {
					            tutorialP = $('#assetsPP').bPopup(fontsize);
					            generisBusy = false; 
		                        setCursorByID("body", "default");
		                        console.log("success");
		                    }); 
				generisBusy = false; 
	            setCursorByID("body", "default");
			}

			var callback1 = function(files) {
				try { 
					$("#publishP #screenshotsA").html("");
					for(var i=0;i<files.length;i++) {
						var url = "https://drive.google.com/uc?id="+files[i].id;
					 	if( assetScreenshots=="") assetScreenshots += url;
					 	else assetScreenshots += ", "+url;
						$("#publishP #screenshotsA").append( "<img src='"+ url +"'/>" );
					}
				} catch(e){}
				gAccount.listFilesInFolder( gAccount.getFileId("Files", ["Generis Account", "Profile", "Assets", name]) , callback2);
			}  

	        gAccount.listFilesInFolder( gAccount.getFileId("Screenshots", ["Generis Account", "Profile", "Assets", name]) , callback1);
			 
		}
	}

	function playGame(){  
		var win = window.open(document.location.origin+"/showcase?gameId="+Base64.encode( gAccount.emailAddress+game.gameName ), '_blank');
		if(win){
		    //Browser has allowed it to be opened
		    win.focus();
		}else{
		    //Broswer has blocked it
		    alert('Please allow popups for this site');
		}
		//publishedP.close(); } catch(e) {}
	} 

	function openSource(){  
		var win = window.open("https://drive.google.com/uc?id="+gAccount.getFileId(game.gameName+".html", [ "Generis Account", "Games", game.gameName ]), '_blank');
		if(win){
		    //Browser has allowed it to be opened
		    win.focus();
		}else{
		    //Broswer has blocked it
		    alert('Please allow popups for this site');
		}
		//publishedP.close(); } catch(e) {}
	} 

	function publishImgUpd(){  
		var screenshot = correctPaths( document.getElementById("screenshot").value ); 
		var publishImg = document.getElementById("publishImg");
		if( screenshot != "") publishImg.style.backgroundImage ="url('" + screenshot +"')";
		else publishImg.style.backgroundImage="url('http://www.iconhot.com/icon/png/android-style-icons-r1/512/gallery-2.png')";  
	} 

	function tutorialsImgUpd(){  
		var screenshot = correctPaths( document.getElementById("screenshotT").value ); 
		var tutorialsImg = document.getElementById("tutorialsImg");
		if( screenshot != "") tutorialsImg.style.backgroundImage ="url('" + screenshot +"')";
		else tutorialsImg.style.backgroundImage="url('http://www.iconhot.com/icon/png/android-style-icons-r1/512/gallery-2.png')";  
	} 

	function assetsImgUpd(){  
		var screenshot = correctPaths( document.getElementById("screenshotA").value ); 
		var assetsImg = document.getElementById("assetsImg");
		if( screenshot != "") assetsImg.style.backgroundImage ="url('" + screenshot +"')";
		else assetsImg.style.backgroundImage="url('http://www.iconhot.com/icon/png/android-style-icons-r1/512/gallery-2.png')";  
	} 

	function deleteGame(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) { 
			//newGPopup = $('#deleteGame').bPopup(fontsize); 
			if(!game) {
				newGPopup = $('#newGPopUp').bPopup(fontsize);  
				generisBusy = false;
	    		setCursorByID("body", "default");
				
				return;
			}
			generisBusy = true;
	    	setCursorByID("body", "wait");
	    	deleteGP = $('#deleteGP').bPopup(fontsize);  
 
			var gameId = gAccount.getFileId( game.gameName, [ "Generis Account", "Games"] ) ;
			gAccount.deleteFile(gameId, function() {   
				generisBusy = false;
	    		setCursorByID("body", "default");
	    		try { deleteGP.close(); } catch(e) {} 
				closeGame();
			});  
		}
		
	}

	function closeGame(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  
			if(!game) {newGPopup = $('#newGPopUp').bPopup(fontsize); return;}
			if( game ) {
				game.close();
				if(closeGamePP) closeGamePP.close();
			} 
		}
		
	}

	function Preferences(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  
			$('#preferencesT').bPopup(fontsize);
		}

	}

	function Edit(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  
			$('#EditT').bPopup(fontsize);
		}

	}

	function Windows(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  
			$('#WindowsT').bPopup(fontsize);
		}

	}

	function Tools(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  
			$('#ToolsT').bPopup(fontsize);
		}

	}

	function Help(){ 
	    if(generisBusy || !game) return;

		if(log.innerHTML == "LOGIN") logPopup = $('#login').bPopup(fontsize);   

		if(log.innerHTML == "LOGOUT" ) {  
			$('#HelpT').bPopup(fontsize);
		}

	}


	function userLoging(){ 
	    if(generisBusy ) return; 
	    log = document.getElementById("log");
		if(log.innerHTML == "LOGIN") {  
			logPopup = $('#login').bPopup(fontsize);  
		}
		else { 
			if( game ) game.close(); 
			//var log1 = document.getElementById("userName");
			//log1.innerHTML = "";  
			log.innerHTML = "LOGIN";
			document.getElementById("userInfo").style.visibility = "hidden";
			logPopup = $('#login').bPopup(fontsize); 
		}
	 } 

	 function userAccount() {
	    if(generisBusy ) return;
	 
		 //$('#NotAvaillable').bPopup(fontsize);
		 $('#NotAvaillable').bPopup(fontsize);

	 }

	 /**
       * Check if active user has authorized this application.
       */
      function checkAuth() {
      	if(generisBusy ) return;
		if(window.innerWidth<770) {  
			$('#warning #warningPopup').html("Window size too small.");
	    	$('#warning').bPopup(fontsize);
	    	return;
	    } 

		gAccount = new gDriveApi(true);
      }

	 function gDriveLog(){
	    if(generisBusy ) return;
		if(window.innerWidth<770) {
	    	
			$('#warning #warningPopup').html("Window size too small.");
	    	$('#warning').bPopup(fontsize);
	    	return;
	    }

		generisBusy = true; 
        setCursorByID("body", "wait");

		gAccount = new gDriveApi(); 
	 }   

	 function boxLog() {
	    if(generisBusy ) return;
	    if(window.innerWidth<770) {
	    	
			$('#warning #warningPopup').html("Window size too small.");
	    	$('#warning').bPopup(fontsize);
	    	return;
	    }
	 
		 //$('#NotAvaillable').bPopup(fontsize);
		 $('#NotAvaillable').bPopup(fontsize);

	 }
	 
	 function oneDriveLog(){
	    if(generisBusy ) return;
	    if(window.innerWidth<770) {
	    	
			$('#warning #warningPopup').html("Window size too small.");
	    	$('#warning').bPopup(fontsize);
	    	return;
	    }
	    
		$('#NotAvaillable').bPopup(fontsize);
	 }
	 
	 function dropBoxLog(){
	    if(generisBusy ) return;
	    if(window.innerWidth<770) {
	    	
			$('#warning #warningPopup').html("Window size too small.");
	    	$('#warning').bPopup(fontsize);
	    	return;
	    }
	    
		$('#NotAvaillable').bPopup(fontsize);
	 }
	 
	 function backImgChg(){
	    if(generisBusy ) return;
	    
		var body = document.getElementById("body");
		var backImgSrc = document.getElementById("backImgURL").value;
		if(backImgSrc == "" ) {
			$('#warning #warningPopup').html("Please enter a URL/Link");
	    	$('#warning').bPopup(fontsize);
			return;
		} 
		$('#workSpace').css('background-image', 'url(' + backImgSrc + ')');
		body.className=gAccount.filesInfo[0].theme;
		gAccount.filesInfo[0].Background = backImgSrc;

		if(gBackgroundT) try { gBackgroundT.close(); } catch(e) {}
	 }
	   
	 function escapeRegExp(str) {
	    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	 }
	 
	 function replaceAll(str, find, replace) {
	  	return str.replace(new RegExp(find, 'g'), replace);
	 }
	 
	 function listImgs(str) {
	 	var images = replaceAll(str, "<img src=\"", "");
		images = replaceAll(images, "\">", ",");  
		images = replaceAll(images, "\n", "");
		images = replaceAll(images, "&#9;", "");
		images = images.trim().split(",");
		images.pop(); 
	  	return images;
	 }
	 
	 function putImgs(imgs) {
		$("#sidr-id-bImages a").html("");
	 	for(var i=0; i<imgs.length; i++) {   
		    $("#sidr-id-bImages a").append("<img src='"+imgs[i]+"'/>");
		}
	 }
