

DocClass = TabClass.extend({

    properties: null,
    tabObj: null,
    tabContent: null,
    filesI : [],
    
    init : function( name, num, wndId  ) {  
        generisBusy = true;
        setCursorByID("body", "wait");
        
        $('#warning #warningPopup').html("This API Documentation might be out of date. Please check the github repository for the latest version.");
        $('#warning').bPopup(fontsize); 

        this.title = name; 
        this.tabId = "Documentation_" + name;
        this.type = "Documentation" ;
        this.num = num;
        this.wndId = wndId;
  
        var elements = document.getElementById( this.wndId );
 
        var tabsBar = elements.getElementsByClassName("tabsBar")[0].getElementsByTagName("ul")[0];  
        tabsBar.innerHTML = tabsBar.innerHTML + '<li  id="' + this.tabId + '" class="tab-link active" data-tab="tab-' + num + '"><a href="javascript:;"><img src="data/images/tabAPIIcon.png" /> <div class="title"> API </div> <span class="glyphicon glyphicon-remove-sign" data-tag="tooltip" title="close"></span></a></li>'
        
        var tabsContainer = elements.getElementsByClassName("tabsContainer")[0];   
        var div =document.createElement("div");
        var docs = "/API1";
        if (gAccount.filesInfo[0].theme == "moonB") docs = "/API2";
        if (gAccount.filesInfo[0].theme == "twilight") docs = "/API3";  
        div.innerHTML = '<div id="tab-' + num + '" class="tab-content active"> <div class="wTabType" > <img src="data/images/APIIcon.png" /> </div>  <iframe id="' + this.tabId + wndId + '" class="Documentation" src="'+ docs+'" style="width: 100%; height: 100%;" frameborder="0">  </iframe > </div> ';

        tabsContainer.appendChild(div ); 

        generisBusy = false;
        setCursorByID("body", "default");
 
    },  
});
 