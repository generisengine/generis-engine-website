

ScriptEditor = TabClass.extend({

    properties: null,
    tabObj: null,
    tabContent: null,
    
    init : function( name, tabType, num, wndId, text ) { 
        
        generisBusy = true;
	    setCursorByID("body", "wait"); 
	    
        this.title = name; 
        this.tabId = tabType+"_"+name;
        this.type = tabType ;
		this.num = num; 

		var typeIcon = "jscriptIcon";
        if (tabType == "markup") typeIcon = "htmlIcon";
        if (tabType == "style") typeIcon = "cssIcon";

        var elements = document.getElementById( wndId); 

        var tabsBar = elements.getElementsByClassName("tabsBar")[0].getElementsByTagName("ul")[0];  
        tabsBar.innerHTML = tabsBar.innerHTML + '<li  id="' + this.tabId + '" class="tab-link active" data-tab="tab-' + num + '"><a href="javascript:;"><img src="data/images/tab'+typeIcon+'.png" /> <div class="title">'+ this.title + '</div> <span class="glyphicon glyphicon-remove-sign" data-tag="tooltip" title="close"></span></a></li>'
       
        var tabsContainer = elements.getElementsByClassName("tabsContainer")[0];   
        var div =document.createElement("div");
        div.innerHTML = '<div id="tab-' + num + '" class="tab-content active"> <div class="wTabType" > <img name="refresh" src="data/images/'+typeIcon+'.png" /> </div> <div id="' + this.tabId + wndId + '" class="editor" > </div> </div> ';

        tabsContainer.appendChild(div ); 

        var theme = "ace/theme/twilight";
        if (gAccount.filesInfo[0].theme == "clouds") theme = "ace/theme/monokai";
        if (gAccount.filesInfo[0].theme == "twilight") theme = "ace/theme/twilight";

		var This = this;
        var editor = ace.edit(this.tabId + wndId);
        editor.setTheme(theme);
        if (tabType == "script") {
            editor.session.setMode("ace/mode/javascript"); 
            //Remove leading spaces
            var array = text.split(/\n/);
            array[0] = array[0].trim();
            text = array.join("\n"); 
            //Actual beautify (prettify) 
            text = js_beautify(text); 
			editor.setValue(text);  
		}
		if (tabType == "markup") {
			editor.session.setMode("ace/mode/html"); 
			editor.setValue(text);    
		} 
		if (tabType == "style") {  
		    editor.session.setMode("ace/mode/css"); 
			editor.setValue(text);   
		} 

        try { 
            $("#" + this.tabId + wndId ).resize(function(){ editor.resize(); });  
            $(window).click(function(){ editor.resize(); });
            $("#" +wndId+" #tab-"+num+" [name=refresh]").click(function(){ This.refresh(); });
        }catch(e) {}

        editor.$blockScrolling = Infinity;
		editor.on('input', function(){ This.save(); }); 
        this.tabObj = editor;
         
	    generisBusy = false;
	    setCursorByID("body", "default");
	     
    }, 

    save: function(){
    	return;
    },  

    refresh: function(){
    	return;
    },  

    options: function( name ) {

    }, 

    // can all be overloaded by child classes
    update : function() { },

});





