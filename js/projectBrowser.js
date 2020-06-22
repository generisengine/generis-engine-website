

ProjectBrowser = TabClass.extend({

    properties: null,
    browserFiles: {},
    tabObj: null,
    tabContent: null,
    filesI : [],
    
    init : function( name, num, wndId) { 
        
        generisBusy = true;
        setCursorByID("body", "wait");
        
        this.title = name; 
        this.tabId = "browser_" + name;
        this.type = "browser" ;
        this.num = num;
        this.wndId = wndId;   
        
        var elements = document.getElementById( wndId); 

        var tabsBar = elements.getElementsByClassName("tabsBar")[0].getElementsByTagName("ul")[0];  
        tabsBar.innerHTML = tabsBar.innerHTML + '<li  id="' + this.tabId + '" class="tab-link active" data-tab="tab-' + num + '"><a href="javascript:;"><img src="data/images/tabfileExplorerIcon.png" /> <div class="title"> Project Browser </div> <span class="glyphicon glyphicon-remove-sign" data-tag="tooltip" title="close"></span></a></li>'
        
        var tabsContainer = elements.getElementsByClassName("tabsContainer")[0];   
        var div =document.createElement("div");
        div.innerHTML = '<div id="tab-' + num + '" class="tab-content active"> <div class="wTabType" > <img name="refresh" src="data/images/fileExplorerIcon.png" /> </div> <div id="' + this.tabId + wndId + '" class="browser" > </div> </div> ';

        tabsContainer.appendChild(div ); 
         
        var browser;
        var This = this;
          webix.ready(function(){
            
            This.tabObj = This.create();
             
            webix.event(this.tabId + this.wndId , "resize", function(){ This.tabObj.adjust(); }); 
            $(window).click(function(){ try { This.tabObj.adjust(); } catch(e) {} }); 
            $("#" +wndId+" #tab-"+num+" [name=refresh]").click(function(){ This.refresh(); });
             
            generisBusy = false;
            setCursorByID("body", "default");
            
        }); 
        

    }, 
    
    refresh: function() {
        //if ( this.filesI == JSON.stringify(gAccount.filesInfo) ) return;
        if(generisBusy) return;
        this.tabObj.destructor();
        this.tabObj = this.create();  
    },
    
    create: function() { 
        var ctn = this.tabId + this.wndId;
        this.filesI = JSON.stringify(gAccount.filesInfo) ;
        var This = this;
        var Browser = webix.ui({ 
            container:ctn,
            css:"browser", 
            adjust:true,
            view:"filemanager", 
            id:"files", 
        });  
         
        $$("files").parse(JSON.parse(This.filesI));
        


        $("#Images").mouseover(function (event) {
           if(browserDragUrl){
                if(overEvent && overEvent != event) {
                    $(overEvent.target).removeClass("dragover");
                }
                if(event.target.tagName == "A") { 
                    if(overEvent && overEvent != event) {
                        $(overEvent.target).removeClass("dragover");
                    }
                    overEvent = event;
                    event.preventDefault(); 
                    $(event.target).addClass("dragover");
                }
           }
        });

        $("#bImages").mouseover(function (event) {
           if(browserDragUrl){
                if(overEvent && overEvent != event) {
                    $(overEvent.target).removeClass("dragover");
                }
                if(event.target.tagName == "A") {  
                    overEvent = event;
                    event.preventDefault(); 
                    $(event.target).addClass("dragover");
                }
           }
        });

        $("#Images").mouseup(function (event) { 
           if(browserDragUrl){
                if(overEvent && overEvent != event) {
                    $(overEvent.target).removeClass("dragover");
                }
                if(event.target.tagName == "A") { 
                    overEvent = event;  
                    event.preventDefault();
                    $(event.target).removeClass("dragover");
                    event.preventDefault();
                    $(event.target).append( "<img src='"+browserDragUrl+"'/>"); 
                    browserDragUrl = null;
                } 
           }
        });

        $("#bImages").mouseup(function (event) { 
           if(browserDragUrl){
                if(overEvent && overEvent != event) {
                    $(overEvent.target).removeClass("dragover");
                }
                if(event.target.tagName == "A") { 
                    overEvent = event;  
                    event.preventDefault();
                    $(event.target).removeClass("dragover");
                    event.preventDefault();
                    $(event.target).append( "<img src='"+browserDragUrl+"'/>"); 
                    browserDragUrl = null;
                } 
           }
        });

        $(document).mouseup(function (event) { 
           if(browserDragUrl){
                if(overEvent && overEvent != event) {
                    $(overEvent.target).removeClass("dragover");
                } 
           }
        });

        $$("files").attachEvent("onBeforeDrag",function(context,ev){
            browserDragUrl = "https://drive.google.com/uc?id="+context.start ; 
            return true;
        }); 

        $$("files").attachEvent("onBeforeCreateFolder",function(id){
            generisBusy = true;
            setCursorByID("body", "wait");
            
            //console.log("yes  "+ gAccount.getFileD(id).value);
            gAccount.createFolder("newFolder", [{"id": id}], function() { console.log("Folder created"); generisBusy = false; setCursorByID("body", "default");}  );
            return true;
        });
        
        $$("files").attachEvent("onBeforeDeleteFile",function(id){
            generisBusy = true; 
            setCursorByID("body", "wait");
            
            gAccount.deleteFile(id, function() { console.log("File Deleted"); generisBusy = false; 
        setCursorByID("body", "default");}  );
            
            return true;
        }); 

        Browser.renameFile = function(id, newName){
            generisBusy = true; 
            setCursorByID("body", "wait");
            
            gAccount.renameFile(id, newName, function() { console.log("File Renamed"); generisBusy = false; 
        setCursorByID("body", "default");}  );
            
            return true;
        }; 

        Browser.copyFile = function(source,target){
            generisBusy = true; 
            setCursorByID("body", "wait");
            
            for (var i=0;i<source.length;i++) { 
                var originFile = gAccount.getFileD(source[i]);
                if (originFile.type != "folder") 
                    gAccount.copyFile(source[i], [{"id": target}], function() { console.log("Files Copied"); generisBusy = false; 
            setCursorByID("body", "default");}  );
            } 
            
            return true;
        }; 

        Browser.moveFile = function(source,target){
            generisBusy = true; 
            setCursorByID("body", "wait");

            for (var i=0;i<source.length;i++) {
                if (target.row) var id = target.row;
                else var id = target;
                gAccount.moveFile(source[i], [{"id": id}], function() { console.log("Files Moved"); generisBusy = false; 
            setCursorByID("body", "default");}  );
            }  
            
            return true;
        };  
 
        return Browser;
        
    },

    options: function( name ) {

    }, 

    // can all be overloaded by child classes
    update : function() { },

});





