

GameViewer = TabClass.extend({

    properties: null, 
    tabObj: null,
    tabContent: null,
    
    init : function( name, path, num, wndId, callback, args ) { 
        
        generisBusy = true;
	    setCursorByID("body", "wait");
	     
        this.title = name;
        this.path = path;
        this.tabId = "game" + name;
        this.wndId = wndId;
        this.type = "game" ;
		this.num = num;
        var tabName = name.split('.');

        var elements = document.getElementById( wndId);

        var tabs = elements.getElementsByClassName("tabs")[0]; 

        tabs.innerHTML = tabs.innerHTML + '<div id="' + name + '"class="tab-link current" data-tab="tab-' + num + '">'+ tabName[0] + ' </div>' ;

        var container = elements.getElementsByClassName("container")[0];  

        var div =document.createElement("div");
        div.innerHTML = '<div id="tab-' + num + '" class="tab-content current"> <iframe id="' + this.tabId + wndId + '" class="game" frameborder="0">  </iframe > </div> ';

        container.appendChild(div ); 
        
        var This = this;
        var gameF = {};
        this.tabObj = gameF;
        var tabType = tabName[1];

        if (tabType == "html") {
            //editor.session.setMode("ace/mode/html"); 
            if ( path && name ) {  
                var f = function(value) {  

                    //console.log(arrS);
                    This.initDom(value); 
                    if(callback) callback(args); 
                    generisBusy = false;
                    setCursorByID("body", "default"); 
                    //////////////////////////////////////////////////////////////////////////////////////////////////////
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
                                aWindows[i][j] = [ tabs[j].title, tabs[j].path, tabs[j].tabId, tabs[j].type, tabs[j].num, tabs[j].wndId];
                            }
                        }
                        g["gameData"] = [ game.gameName,  game.gameSource, aWindows, game.activeWindow, game.currPath, wdsData ] ; 
                        
                    } catch(e) { console.log(e); }

                    gAccount.saveFilesInfo();
                    //////////////////////////////////////////////////////////////////////////////////////////////////////
        
                }; 
                gAccount.getFilesContent("id", gAccount.getFileId(name , path), f); 
            } 
        }  
         
	    generisBusy = false;
	    setCursorByID("body", "default");
	    
	    //this.gNewGame( this.title );
	    

    }, 

    correctPaths: function(str) {
        try{ 
            var find = 'Libraries/';
            var re = new RegExp(find, 'g'); 
            str = str.replace(re, game.gameSource+'/Libraries/');
            find = 'Media/';
            re = new RegExp(find, 'g'); 
            str = str.replace(re, game.gameSource+'/Media/');
            find = 'Scripts/';
            re = new RegExp(find, 'g'); 
            str = str.replace(re, game.gameSource+'/Scripts/');
        } catch(e){console.log(e);}
        return str;
    },

    initDom: function(value){

        generisBusy = true;
        setCursorByID("body", "wait");
        
        var This = this;
        var gameF = This.tabObj;
        gameF["pageValue"] = value || gameF.pageValue;  
        gameF["pageDom"] = document.createElement( 'html' );
        gameF.pageDom.innerHTML = gameF.pageValue; 
 
        anchors = gameF.pageDom.getElementsByTagName( 'script' );
        gameF["scripts"] = {};

        var toLoad = [];

        for (var i=0; i<anchors.length;i++){
            var str1 = decodeURI(anchors[i].src);
            var str2 = str1.replace(/^.*\/\/[^\/]+/, '');
            var key = This.path.join("/") + str2; 
            console.log(str1+"__"+str2);
            gameF.scripts[key] =  anchors[i]; 
            anchors[i].removeAttribute("src"); toLoad.push(key);
            //if ( str2.indexOf("Scripts") < 0) anchors[i].title = "gLibrary";
            //else { anchors[i].removeAttribute("src"); toLoad.push(key); }
        }

        var frameInit = function(){ 
            var gameFrame = document.getElementById(This.tabId + This.wndId); 
            gameFrame.contentWindow.contents = gameF.pageDom.innerHTML;
            gameFrame.src = 'javascript:window["contents"]';

            generisBusy = false;
            setCursorByID("body", "default");
            
        };

        var loader = function(){

            generisBusy = true;
            setCursorByID("body", "wait");
            
            var file = toLoad.pop();
            var filePath = file.split("/");
            var fileName = filePath.pop();
            var callback = function(value) {  
                      
                    generisBusy = true;
                    setCursorByID("body", "wait"); 
                    gameF.scripts[file].innerHTML = "try {" + This.correctPaths(value) + "} catch(e) {}";
                    if(toLoad.length > 0) loader();
                    else(frameInit());
        
            }; 
            gAccount.getFilesContent("id", gAccount.getFileId(fileName , filePath), callback); 
        };

        if(toLoad.length > 0) loader();
        else frameInit();


    },

    updateDom: function(key, content){
        
        try {
            var This = this;
            var gameF = This.tabObj; 
            if( gameF.scripts.hasOwnProperty(key) ) gameF.scripts[key].innerHTML = "try {" + This.correctPaths(content) + "} catch(e) {}";
            else return;  
            var gameFrame = document.getElementById(This.tabId + This.wndId); 
            gameFrame.contentWindow.contents = gameF.pageDom.innerHTML;
            gameFrame.src = 'javascript:window["contents"]';
        } catch(e) {console.log(e);}

    },

    updateFrame: function(){

    },
    
    gNewGame: function (canvasTitle){  
        
        var  canvas = document.getElementById( "Game" + canvasTitle );  
        var b = canvas.parentElement.getBoundingClientRect();
        canvas.width = b.width ;
        canvas.height = b.height ;
        
        var scene = gGameEngine.newScene(canvasTitle, canvas, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height, 0, 0);
          
        var sets = {pos: { x: 0 , y: canvas.height - 65 } , size: { height: 150 , width: canvas.width } }; 
        var animBs = { animationIdle: sets };
        var animationFs = [ [ "animationIdle", [  ] ], ];
        var charPs = { id: 'stageObj1', animBodies: animBs, animFrames: animationFs, initBody: "animationIdle", zIndex: 1 } 
        scene.spawnEntity(charPs); 
         
        gGameEngine.startScene(canvasTitle);
	  
	 },
    
    options: function( name ) {

    }, 

    // can all be overloaded by child classes
    update : function() { },

});





