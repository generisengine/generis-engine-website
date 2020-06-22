

SceneViewer = TabClass.extend({

    properties: null, 
    tabObj: null,
    tabContent: null,
    srcElements: null,
    
    init : function( name, num, wndId) { 
        
        generisBusy = true;
	    setCursorByID("body", "wait");
	     
        this.title = name; 
        this.tabId = "sceneViewer_" + name;
        this.wndId = wndId;
        this.type = "sceneViewer" ;
		this.num = num; 

        var elements = document.getElementById( wndId);

        var tabsBar = elements.getElementsByClassName("tabsBar")[0].getElementsByTagName("ul")[0];  
        tabsBar.innerHTML = tabsBar.innerHTML + '<li  id="' + this.tabId + '" class="tab-link active" data-tab="tab-' + num + '"><a href="javascript:;"><img src="data/images/tabgameViewerIcon.png" /> <div class="title">'+ name + '</div> <span class="glyphicon glyphicon-remove-sign" data-tag="tooltip" title="close"></span></a></li>'
        
        var tabsContainer = elements.getElementsByClassName("tabsContainer")[0];   
        var div =document.createElement("div");
        div.innerHTML = '<div id="tab-' + num + '" class="tab-content active"> <div class="wTabType" > <img name="refresh" src="data/images/gameViewerIcon.png" /> </div>  <iframe id="' + this.tabId + wndId + '" class="game" frameborder="0">  </iframe > </div> ';
        tabsContainer.appendChild(div );   
        var This=this;
        $("#" +wndId+" #tab-"+num+" [name=refresh]").click(function(){ This.refresh(); });

        this.tabObj = document.getElementById(this.tabId + this.wndId);  
        this.refresh();

        generisBusy = false;
        setCursorByID("body", "default"); 
    },  

    refresh: function(){  
        var gameCode = document.createElement( 'html' );
        gameCode.innerHTML = correctPaths(game.gameCode.innerHTML);
        $(gameCode).find("[name=start]").html("G.generisIntro = false; G.start('scene',{id:'"+this.title+"'});");//game.scenes[this.title].start
        
        var elements = document.getElementById(this.wndId);

        var tabsContainer = elements.getElementsByClassName("tabsContainer")[0];
        $("#" +this.wndId+" #tab-"+this.num).remove();
        
        var div =document.createElement("div");
        div.innerHTML = '<div id="tab-' + this.num + '" class="tab-content active"> <div class="wTabType" > <img name="refresh" src="data/images/gameViewerIcon.png" /> </div>  <iframe id="' + this.tabId + this.wndId + '" class="game" frameborder="0">  </iframe > </div> ';
        tabsContainer.appendChild(div );   
        var This=this;
        $("#" +this.wndId+" #tab-"+this.num+" [name=refresh]").click(function(){ This.refresh(); });

        this.tabObj = document.getElementById(this.tabId + this.wndId);
        
        this.tabObj.contentWindow.document.open();
        this.tabObj.contentWindow.document.write(gameCode.innerHTML); 
        this.tabObj.contentWindow.document.close(); 
    },  
 
    options: function( name ) {

    }, 

});





