

SceneEditor = TabClass.extend({

    properties: null, 
    tabObj: null,
    tabContent: null,
    images:{},
    selected:null,
    
    init : function( name, num, wndId) { 
        
        generisBusy = true;
	    setCursorByID("body", "wait");
	     
        this.title = name; 
        this.tabId = "sceneEditor_" + name;
        this.wndId = wndId;
        this.type = "sceneEditor" ;
		this.num = num;

        var elements = document.getElementById( wndId);

        var tabsBar = elements.getElementsByClassName("tabsBar")[0].getElementsByTagName("ul")[0];  
        tabsBar.innerHTML = tabsBar.innerHTML + '<li  id="' + this.tabId + '" class="tab-link active" data-tab="tab-' + num + '"><a href="javascript:;"><img src="data/images/tabSceneEditorIcon.png" /> <div class="title">'+ name + '</div> <span class="glyphicon glyphicon-remove-sign" data-tag="tooltip" title="close"></span></a></li>'
        
        var tabsContainer = elements.getElementsByClassName("tabsContainer")[0];   
        var div =document.createElement("div");
        div.innerHTML = '<div id="tab-' + num + '" class="tab-content active"> <div class="wTabType" > <img name="refresh" src="data/images/sceneEditorIcon.png" /> </div> <div style="height:100%; width:100%; margin:0; padding:0; background-color:#222; overflow:auto">  <canvas id="' + this.tabId + wndId + '" width="'+game.scenes[name].params.width+'" height="'+game.scenes[name].params.height+'" style="border: 2px solid #d3d3d3;"> </canvas> </div> </div> ';
        tabsContainer.appendChild(div );   

        var This=this;
        $("#" +wndId+" #tab-"+num+" [name=refresh]").click(function(){ This.refresh(); });
        $("#" +wndId+" #tab-"+num).click(function(){
        	$("#Scene [name=id] select").val(This.title);
        	$("#Scene [name=width] input").val(game.scenes[name].params.width); 
        	$("#Scene [name=height] input").val(game.scenes[name].params.height);
        	$("#Scene [name=WtoH] input").val(game.scenes[name].params.WtoH);
        	$("#Scene [name=gravityX] input").val(game.scenes[name].params.gravity.x);
        	$("#Scene [name=gravityY] input").val(game.scenes[name].params.gravity.y);
        	//if(typeof G !== 'undefined') {
        		try { 
	        		var camera = Object.keys(game.scenes[name].cameras)[0];
        			$("#Camera [name=id] slect").val(camera);
		        	$("#Camera [name=scene] input").val(name);
		        	$("#Camera [name=x] input").val(game.scenes[name].cameras[camera].params.x); 
		        	$("#Camera [name=y] input").val(game.scenes[name].cameras[camera].params.y); 
		        	$("#Camera [name=z] input").val(game.scenes[name].cameras[camera].params.z);  
		        	$("#Camera [name=width] input").val(game.scenes[name].cameras[camera].params.width); 
		        	$("#Camera [name=height] input").val(game.scenes[name].cameras[camera].params.height); 
		        } catch(e) {}
	        //}
        });   

		if($("#Mouse [name=create] active").attr('name') == "create") this.tabObj = new fabric.Canvas(this.tabId + this.wndId, { selection: false });
		else  this.tabObj = new fabric.Canvas(this.tabId + this.wndId);  

		This.copiedObject = null;
		This.copiedObjects = [];
		This.h = [];
		this.tabObj.on('object:added',function(){
		  if(!This.isRedoing){
		    This.h = [];
		  }
		  This.isRedoing = false;
		});

 

		This.drawtype = $("#New .sidr-class-active").attr("name");
		$("#New").click(function(){  
			This.drawtype = $("#New .sidr-class-active").attr("name");
        });
        $("#Mouse [name=edit]").click(function(){  
			This.tabObj.forEachObject(function(object){ 
		       object.selectable = true; 
		       object.evented = true; 
			}); 
			This.tabObj.selection = true;
        });
        $("#Mouse [name=create]").click(function(){  
			This.tabObj.forEachObject(function(object){ 
		       object.selectable = false; 
		       object.evented = false; 
			}); 
			This.tabObj.selection = false;
        });
 
		function updateEntity(e) { 
			if(e.target.params) { 
				var param = e.target.params;
				var idle = param.bodies[param.idleBody];
				var offset = {x:0,y:0}; 
	    		/*
	    		if(idle.radius) {
	    			offset.x = -idle.radius;
	    			offset.y = -idle.radius;
	    		} else if(idle.width) {
	    			offset.x = -idle.width/2;
	    			offset.y = -idle.height/2;
	    		}
	    		*/
				idle.x = e.target.getLeft()-offset.x;
				idle.y = e.target.getTop()-offset.y; 
	        	if(idle.radius) {
	        		try{
						idle.radius = e.target._objects[0].radius*e.target.scaleX; 
					} catch(e){ console.log(e) }  
		        } else if(idle.width) {
					idle.width = e.target.getWidth();
					idle.height = e.target.getHeight();
		        }
				idle.angle = e.target.getAngle()*(Math.PI/180);
				var params = { scene: name, param: param }
				game.setParams("entity", params);
				for(var i in game.activeWindows){  
					var elements = document.getElementById( game.activeWindows[i].id ); 
					var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
					var tab = game.activeWindows[i].tabs[tabCur2.id];  
					if(tab.type=="script" && tab.title == This.selected) tab.refresh();	
					// if(tab.type=="sceneViewer" && tab.title == This.title) tab.refresh(); 
		        }
	        	$("#Entity [name=id] select").val(param.id); 
	        	$("#Entity [name=scene] input").val(name); 
	        	$("#Entity [name=idleBody] input").val(param.idleBody); 
	        	$("#Entity [name=x] input").val(idle.x);  
	        	$("#Entity [name=y] input").val(idle.y);  
	        	$("#Entity [name=z] input").val(idle.z);  
	        	$("#Entity [name=angle] input").val(idle.angle*180/Math.PI);  
	        	if(idle.radius) { 
		        	$("#Entity [name=radius] input").val(idle.radius);   
		        } else if(idle.width) { 
		        	$("#Entity [name=width] input").val(idle.width);  
		        	$("#Entity [name=height] input").val(idle.height); 
		        }
	        	if(idle.type=="static") $("#sidr-id-bstatic").attr('checked',true); 
	        	if(idle.type=="dynamic") $("#sidr-id-bdynamic").attr('checked',true); 

	        	$("#Entity [name=alpha] input").val(idle.alpha); 	
	        	$("#Entity [name=groupIndex] input").val(idle.groupIndex);  
	        	$("#Entity [name=flip] input").val(idle.flip);  
	        	if(idle.eDebugDraw) $("#Entity [name=eDebugDraw] input").attr('checked',true); 
	        	if(idle.eDraw) $("#Entity [name=eDraw] input").attr('checked',true);  
	        	if(idle.useImageSize) $("#Entity [name=useImageSize] input").attr('checked',true);  

	        	putImgs( idle.frames);  
			} else { 
				try {   
			        e.target._objects.forEach(function(o){  
			            if(o.params) {
			            	var param = o.params;
							var idle = param.bodies[param.idleBody];
							var offset = {x:0,y:0};  
							idle.x = (o.left + e.target.left + e.target.width / 2)*e.target.scaleX;
							idle.y = (o.top + e.target.top + e.target.height / 2)*e.target.scaleY; 
							//if(e.target.scaleX<1) idle.x+= e.target.width*e.target.scaleX/2 + e.target.width/2;
							//else idle.x-= e.target.width*e.target.scaleX/2 - e.target.width/2;
							//if(e.target.scaleY<1) idle.y+= e.target.height*e.target.scaleY/2 + e.target.height/2;
							//else idle.y-= e.target.height*e.target.scaleY/2 - e.target.height/2;
							if(idle.radius) idle.radius = o.width*( e.target.scaleX)/2;
							else {
								idle.width = o.width*( e.target.scaleX);
								idle.height = o.height*( e.target.scaleY);
							}
							idle.angle += e.target.angle*(Math.PI/180) - idle.angle;
							var params = { scene: name, param: param }
							game.setParams("entity", params);
							for(var i in game.activeWindows){  
								var elements = document.getElementById( game.activeWindows[i].id ); 
								var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
								var tab = game.activeWindows[i].tabs[tabCur2.id];  
								if(tab.type=="script" && tab.title == This.selected) tab.refresh();	
								// if(tab.type=="sceneViewer" && tab.title == This.title) tab.refresh(); 
					        }
				        	$("#Entity [name=id] select").val(param.id); 
				        	$("#Entity [name=scene] input").val(name); 
				        	$("#Entity [name=idleBody] input").val(param.idleBody); 
				        	$("#Entity [name=x] input").val(idle.x);  
				        	$("#Entity [name=y] input").val(idle.y);  
				        	$("#Entity [name=z] input").val(idle.z);  
				        	$("#Entity [name=angle] input").val(idle.angle*180/Math.PI);  
				        	if(idle.radius) { 
					        	$("#Entity [name=radius] input").val(idle.radius);   
					        } else if(idle.width) { 
					        	$("#Entity [name=width] input").val(idle.width);  
					        	$("#Entity [name=height] input").val(idle.height); 
					        }
				        	if(idle.type=="static") $("#sidr-id-bstatic").attr('checked',true); 
				        	if(idle.type=="dynamic") $("#sidr-id-bdynamic").attr('checked',true); 

				        	$("#Entity [name=alpha] input").val(idle.alpha); 	
				        	$("#Entity [name=groupIndex] input").val(idle.groupIndex);  
				        	$("#Entity [name=flip] input").val(idle.flip);  
				        	if(idle.eDebugDraw) $("#Entity [name=eDebugDraw] input").attr('checked',true); 
				        	if(idle.eDraw) $("#Entity [name=eDraw] input").attr('checked',true);  
				        	if(idle.useImageSize) $("#Entity [name=useImageSize] input").attr('checked',true);  

				        	putImgs( idle.frames );  
			            }
			        });  
			    } catch(e) {}           
			}
		}
		function entititySelected(e) { 
			if(e.target.params) { 
				var param = e.target.params;
				This.selected = param.id;
				var idle = param.bodies[param.idleBody];
	        	$("#Entity [name=id] select").val(param.id); 
	        	$("#Entity [name=scene] input").val(name); 
	        	$("#Entity [name=idleBody] input").val(param.idleBody); 
	        	$("#Entity [name=x] input").val(idle.x);  
	        	$("#Entity [name=y] input").val(idle.y);  
	        	$("#Entity [name=z] input").val(idle.z);  
	        	$("#Entity [name=angle] input").val(idle.angle*180/Math.PI);  
	        	$("#Entity [name=width] input").val(idle.width);  
	        	$("#Entity [name=height] input").val(idle.height); 
	        	if(idle.radius) { 
		        	$("#Entity [name=radius] input").val(idle.radius);   
		        } else if(idle.width) { 
		        	$("#Entity [name=width] input").val(idle.width);  
		        	$("#Entity [name=height] input").val(idle.height); 
		        }
	        	if(idle.type=="static") $("#sidr-id-bstatic").attr('checked',true); 
	        	if(idle.type=="dynamic") $("#sidr-id-bdynamic").attr('checked',true); 

	        	$("#Entity [name=alpha] input").val(idle.alpha); 	
	        	$("#Entity [name=groupIndex] input").val(idle.groupIndex);  
	        	$("#Entity [name=flip] input").val(idle.flip);  
	        	if(idle.eDebugDraw) $("#Entity [name=eDebugDraw] input").attr('checked',true); 
	        	if(idle.eDraw) $("#Entity [name=eDraw] input").attr('checked',true);  
	        	if(idle.useImageSize) $("#Entity [name=useImageSize] input").attr('checked',true);  
	        	
	        	putImgs( param.bodies[param.idleBody].frames );  
			}
		}
		this.tabObj.on({
			'object:modified': updateEntity,
			'object:selected': entititySelected
		}); 
 
		var group, isDown, origX, origY;
		var isDown = false;
		This.tabObj.on('mouse:down', function(o){
			if(This.tabObj.selection) return; 
		    isDown = true; 
		    var pointer = This.tabObj.getPointer(o.e);
		    origX = pointer.x;
		    origY = pointer.y;
		    var pointer = This.tabObj.getPointer(o.e);
		    if(This.drawtype == "Circle") group = This.createCircle(1, {origX:origX, origY:origY});
			else if (This.drawtype == "Polygon"){

			}
			else group = This.createRect(pointer.x-origX, pointer.y-origY, {origX:origX, origY:origY}); 
		    group.selectable = false;  
	        group.evented = false; 
		    This.tabObj.add(group);
		    //console.log("added");
		});
		This.tabObj.on('mouse:up', function(o){ 
			for(var i in game.activeWindows){  
				var elements = document.getElementById( game.activeWindows[i].id ); 
				var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
				var tab = game.activeWindows[i].tabs[tabCur2.id];  
				if(tab.type=="sceneViewer" && tab.title == This.title) tab.refresh(); 
	        }
			if(This.tabObj.selection) return; 
		    isDown = false; 

		    var params;
		    if(This.drawtype == "Circle") {
		    	if(group.getRadiusX()<5) {
		    		This.tabObj.remove(group); 
					return;
				}
		    	params = This.circleParams(group.getLeft(), group.getTop(), group.getRadiusX());
		    }
			else if (This.drawtype == "Polygon"){

			}
			else {
				if(group.getWidth()<5 || group.getHeight()<5) {
					This.tabObj.remove(group); 
					return;
				}
				params = This.rectParams(group.getLeft(), group.getTop(), group.getWidth(), group.getHeight());
			}
 
		    group.params = params;
    		//group.set("selection", true);
    		//group.set("originX", "center");
    		//group.set("originY", "center");
		    This.tabObj.add(group).setActiveObject(group); 
			This.tabObj.bringToFront(group);
			params = { scene: name, param: params }
			game.setParams("entity", params); 

			var idle = params.param.bodies.idle;
        	$("#Entity [name=id] select").val(params.param.id); 
        	$("#Entity [name=scene] input").val(name); 
        	$("#Entity [name=idleBody] input").val(params.param.idleBody); 
        	$("#Entity [name=x] input").val(idle.x);  
        	$("#Entity [name=y] input").val(idle.y);  
        	$("#Entity [name=z] input").val(idle.z);  
        	$("#Entity [name=angle] input").val(idle.angle*180/Math.PI);  
        	$("#Entity [name=width] input").val(idle.width);  
        	$("#Entity [name=height] input").val(idle.height);
        	if(idle.type=="static") $("#sidr-id-bstatic").attr('checked',true); 
        	if(idle.type=="dynamic") $("#sidr-id-bdynamic").attr('checked',true); 

        	$("#Entity [name=alpha] input").val(idle.alpha); 	
        	$("#Entity [name=groupIndex] input").val(idle.groupIndex);  
        	$("#Entity [name=flip] input").val(idle.flip);  
        	if(idle.eDebugDraw) $("#Entity [name=eDebugDraw] input").attr('checked',true); 
        	if(idle.eDraw) $("#Entity [name=eDraw] input").attr('checked',true);  
        	if(idle.useImageSize) $("#Entity [name=useImageSize] input").attr('checked',true);  
        	
        	putImgs(idle.frames); 

			for(var i in game.activeWindows){  
				var elements = document.getElementById( game.activeWindows[i].id ); 
				var tabCur2 = elements.getElementsByClassName("tab-link active")[0]; 
				var tab = game.activeWindows[i].tabs[tabCur2.id];  
				if(tab.type=="script" && tab.title == This.selected) tab.refresh();	
				if(tab.type=="sceneViewer" && tab.title == This.title) tab.refresh(); 
	        }
	        This.refresh();  
		});

		This.tabObj.on('mouse:move', function(o){
			if(This.tabObj.selection) return; 
		    if (!isDown) return; 
		    var pointer = This.tabObj.getPointer(o.e); 
		    if (This.drawtype == "Rectangle") { 
			    group.set({ width: Math.abs(origX - pointer.x)*2 });
			    group.set({ height: Math.abs(origY - pointer.y)*2 }); 
			} else if (This.drawtype == "Circle") { 
			    group.set({ radius: Math.abs(origX - pointer.x)});
			} else {

			}
		    This.tabObj.renderAll();
		});

		this.refresh();

	    generisBusy = false;
	    setCursorByID("body", "default"); 

    },  

    refresh: function(){
    	var This = this;   
    	this.tabObj.clear();
    	$("#"+this.tabId + this.wndId).width(game.scenes[This.title].params.width); 
    	$("#"+this.tabId + this.wndId).height(game.scenes[This.title].params.height); 
    	var entities = game.scenes[this.title].entities; 
		var keys = Object.keys(entities);
        keys.sort(function(entityA,entityB) {  
          var A = entities[entityA].params.bodies[entities[entityA].params.idleBody].z;
          var B = entities[entityB].params.bodies[entities[entityB].params.idleBody].z;
          return A-B; 
        }); 
    	try{ 
	    	for (var ent=0;ent<keys.length;ent++) {   
	    		var idle = entities[keys[ent]].params.bodies[entities[keys[ent]].params.idleBody];
	    		if(idle.frames && idle.frames.length>0) {
	    			$(function(){ 
	    				var counter = ent;
	    				var entity = keys[ent]; 
			    		var Idle = entities[entity].params.bodies[entities[entity].params.idleBody];  
			    		Idle = JSON.parse(correctPaths(JSON.stringify(Idle)));
			    		fabric.Image.fromURL(Idle.frames[0], function(img) {  
							  var obj;
							  if(Idle.radius) {
							  	obj = This.createCircle(Idle.radius);
								  img.set({ 
								    width: Idle.radius*2,
								    height: Idle.radius*2,  
								  }); 
							  }
							  else if (Idle.polys){

							  }
							  else {
							  	obj = This.createRect(Idle.width, Idle.height);
								  img.set({ 
								    width: Idle.width,
								    height: Idle.height,  
								  }); 
							    }
							  var group = new fabric.Group([obj, img], 
							  			  { 
										    left: Idle.x, 
							  			  	top: Idle.y, 
							  			  	angle: (Idle.angle*(180/Math.PI) || 0), 
										    borderColor: 'white',
										    cornerColor: 'white', 
							  			  	originX: "center",
							  			  	originY: "center",
										    cornerSize: 7,
										    transparentCorners: false, 
							  			  });
							  group.params= entities[entity].params;
							  This.tabObj.add(group); 
					  		  This.tabObj.bringToFront(group);

					  		  	if(counter == keys.length-1 && $("#Mouse [name=create]").hasClass('sidr-class-active')){
									This.tabObj.forEachObject(function(object){ 
								       object.selectable = false; 
								       object.evented = false; 
									}); 
									This.tabObj.selection = false;
								} 
						}); 
					});
		    	} else { 
	    			$(function(){
					  var obj;
					  if(idle.radius) obj = This.createCircle(idle.radius);
					  else if (idle.polys){

					  }
					  else obj = This.createRect(idle.width, idle.height);
					  var group = new fabric.Group([ obj ], 
					  			  { left: idle.x, 
					  			  	top: idle.y, 
					  			  	angle: (idle.angle*(180/Math.PI) || 0), 
								    borderColor: 'white',
								    cornerColor: 'white', 
					  			  	originX: "center",
					  			  	originY: "center",
								    cornerSize: 7,
								    transparentCorners: false, 
					  			  });
					  group.params= entities[keys[ent]].params;
					  This.tabObj.add(group);
					  This.tabObj.bringToFront(group);
					});
		    	}
	    	};
	    } catch(e) {};

    	if($("#Mouse [name=create]").hasClass('sidr-class-active')) {  
			This.tabObj.forEachObject(function(object){ 
		       object.selectable = false; 
		       object.evented = false; 
			}); 
			This.tabObj.selection = false; 
			$("#Mouse [name=create]").trigger('click');
    	}
    },  

    createRect: function(w, h, f) {
    	if(f) {
    		var rect = new fabric.Rect({ 
				    width: w,
				    height: h,
					fill: 'rgba(169,169,169,0.4)',
				    stroke: '#d3d3d3',
				    strokeWidth: 1, 
			        left: f.origX,
			        top: f.origY,
			        originX: 'center',
			        originY: 'center',
				    borderColor: 'white',
				    cornerColor: 'white',
				    cornerSize: 7,
				    transparentCorners: false 
				  }); 
    		return rect; 
    	} else {
    		var rect = new fabric.Rect({ 
				    width: w,
				    height: h,
					fill: 'rgba(169,169,169,0.4)',
				    stroke: '#d3d3d3',
				    strokeWidth: 1,
				  }); 
    		return rect; 
    	} 
    }, 

    createCircle: function(r, f) {
    	if(f) {
	    	var circle = new fabric.Circle({ 
				    radius: r,
					fill: 'rgba(169,169,169,0.4)',
				    stroke: '#d3d3d3',
				    strokeWidth: 1, 
			        left: f.origX,
			        top: f.origY,
			        originX: 'center',
			        originY: 'center',
				    borderColor: 'white',
				    cornerColor: 'white',
				    cornerSize: 7,
				    transparentCorners: false 
				  });
	    	return circle;
	    } else {
	    	var circle = new fabric.Circle({ 
				    radius: r,
					fill: 'rgba(169,169,169,0.4)',
				    stroke: '#d3d3d3',
				    strokeWidth: 1,
				  });
	    	return circle;
	    }
    }, 

    createPoly: function(p, f) {

    },

    circleParams: function(x, y, r) {
    	var params = { 
			id: null,
			bodies: {
				idle: {
					x:x,
		            y:y,
		            z: 0,
					radius: r, 
					offset: {x:0,y:0,z:0}, 
					type: $("input[name=dType]:checked").val(), 
					angle: 0, 
					alpha: 1,
					groupIndex: 1,
					flip:"none",
					eDebugDraw:false,
					eDraw: true,
					useImageSize: false,
					frames: listImgs($("#Images .sidr-class-active a").html()), 
				}
			}, 
			idleBody: "idle", 
		}; 

		var today = new Date(); 
		var t = today.getHours(); // => 9
		t += today.getMinutes(); // =>  30
		t +=  today.getSeconds(); // => 51
		t +=  Math.random(); 
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear(); 
		if(dd<10) dd='0'+dd;
		if(mm<10) mm='0'+mm; 
		today = mm +dd +yyyy;   
		params.id = "entity_" + today + t;
		params.id = params.id.replace('.',"_"); 
		params = {
			id: params.id,
			bodies: params.bodies, 
			idleBody: params.idleBody, 
		};
		return params;
    },

    rectParams: function(x, y, w, h) {
    	var params = { 
			id: null,
			bodies: {
				idle: {
					x:x,
		            y:y,
		            z: 0,
					width: w,
					height: h,
					offset: {x:0,y:0,z:0}, 
					type: $("input[name=dType]:checked").val(),
					angle: 0,  
					alpha: 1,
					groupIndex: 1,
					flip:"none",
					eDebugDraw:false,
					eDraw: true,
					useImageSize: false,
					frames: listImgs($("#Images .sidr-class-active a").html()), 
				}
			}, 
			idleBody: "idle", 
		}; 

		var today = new Date(); 
		var t = today.getHours(); // => 9
		t += today.getMinutes(); // =>  30
		t +=  today.getSeconds(); // => 51
		t +=  Math.random(); 
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear(); 
		if(dd<10) dd='0'+dd;
		if(mm<10) mm='0'+mm; 
		today = mm +dd +yyyy;   
		params.id = "entity_" + today + t;
		params.id = params.id.replace('.',"_"); 
		params = {
			id: params.id,
			bodies: params.bodies, 
			idleBody: params.idleBody, 
		};
		return params;
    },

    polyParams: function(x, y, p) {

    },

    save: function(){
    },    

    selectAll: function() {
    	var This = this;
		var objs = This.tabObj.getObjects().map(function(o) {
			return o.set('active', true);
		}); 
		var group = new fabric.Group(objs, {
			originX: 'center', 
			originY: 'center'
		}); 
		This.tabObj._activeObject = null; 
		This.tabObj.setActiveGroup(group.setCoords()).renderAll();
    }, 

    copySelected: function() {
    	var This = this;
    	this.copiedObjects = [];
	    if(this.tabObj.getActiveGroup()){ 
	        this.tabObj.getActiveGroup().getObjects().forEach(function(o){
	            var object = fabric.util.object.clone(o);
	            This.copiedObjects.push(object);
	        });             
	    }
	    else if(this.tabObj.getActiveObject()){
	        var object = fabric.util.object.clone(this.tabObj.getActiveObject());
	        this.copiedObject = object;
	        this.copiedObjects = [];
	        
	    }
    },

    cutSelected: function() {
    	var This = this;
    	this.copiedObjects = [];
	    if(this.tabObj.getActiveGroup()){ 
	        this.tabObj.getActiveGroup().getObjects().forEach(function(o){
	            var object = fabric.util.object.clone(o);
	            This.copiedObjects.push(object);
	        });             
	    }
	    else if(this.tabObj.getActiveObject()){
	        var object = fabric.util.object.clone(this.tabObj.getActiveObject());
	        this.copiedObject = object;
	        this.copiedObjects = []; 
	    } 
		$("#" +this.wndId+" #tab-"+this.num).trigger('click');
    },

    paste: function() {
    	var This=this;
		if(this.copiedObjects.length > 0){ 
			for(var i=0; i<this.copiedObjects.length;i++){ 
				//$(function(){
					var params = {};
					var copiedObject = This.copiedObjects[i];
                    if(i!="erase"&&copiedObject.params) params = JSON.parse(JSON.stringify(copiedObject.params));
                    else return; 

                    var today = new Date(); 
                    var t = today.getHours(); // => 9
                    t += today.getMinutes(); // =>  30
                    t +=  today.getSeconds(); // => 51
                    t +=  Math.random(); 
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear(); 
                    if(dd<10) dd='0'+dd;
                    if(mm<10) mm='0'+mm; 
                    today = mm +dd +yyyy;   
                    params.id = "entity_" + today + t;
                    params.id = params.id.replace('.',"_"); 
 
                    params.bodies.idle.x += 50;
                    params.bodies.idle.y += 50;
                    copiedObject=fabric.util.object.clone(copiedObject); 
                    copiedObject.set("top", params.bodies.idle.y);
                    copiedObject.set("left", params.bodies.idle.x);

                    copiedObject.params = params;
                    This.tabObj.add(copiedObject).setActiveObject(copiedObject);
                    This.tabObj.item(This.tabObj.size() - 1).hasControls = true;
                    game.setParams("entity", {scene:This.title, param:copiedObject.params});

            $("#Entity [name=id] select").val(params.id); 
            $("#Entity [name=scene] input").val(this.title); 
            $("#Entity [name=idleBody] input").val(params.idleBody); 
            $("#Entity [name=x] input").val(params.bodies.idle.x);  
            $("#Entity [name=y] input").val(params.bodies.idle.y);  
            $("#Entity [name=z] input").val(params.bodies.idle.z);  
            $("#Entity [name=angle] input").val(params.bodies.idle.angle*180/Math.PI);  
            $("#Entity [name=width] input").val(params.bodies.idle.width);  
            $("#Entity [name=height] input").val(params.bodies.idle.height);
            if(params.bodies.idle.type=="static") $("#sidr-id-bstatic").attr('checked',true); 
            if(params.bodies.idle.type=="dynamic") $("#sidr-id-bdynamic").attr('checked',true); 
            putImgs( params.bodies.idle.frames );  
				//});
			}                
		}
		else if(this.copiedObject){
				var params = JSON.parse(JSON.stringify(this.copiedObject.params));
				var today = new Date(); 
				var t = today.getHours(); // => 9
				t += today.getMinutes(); // =>  30
				t +=  today.getSeconds(); // => 51
				t +=  Math.random(); 
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear(); 
				if(dd<10) dd='0'+dd;
				if(mm<10) mm='0'+mm; 
				today = mm +dd +yyyy;   
				params.id = "entity_" + today + t;
				params.id = params.id.replace('.',"_");  
            params.bodies.idle.x += 50;
            params.bodies.idle.y += 50;
			this.copiedObject= fabric.util.object.clone(this.copiedObject);
			this.copiedObject.set("top", params.bodies.idle.y);
			this.copiedObject.set("left", params.bodies.idle.x);

			this.copiedObject.params = params;
			this.tabObj.add(this.copiedObject).setActiveObject(this.copiedObject);
			this.tabObj.item(this.tabObj.size() - 1).hasControls = true;
			game.setParams("entity", {scene:this.title, param:this.copiedObject.params});

        	$("#Entity [name=id] select").val(params.id); 
        	$("#Entity [name=scene] input").val(this.title); 
        	$("#Entity [name=idleBody] input").val(params.idleBody); 
        	$("#Entity [name=x] input").val(params.bodies.idle.x);  
        	$("#Entity [name=y] input").val(params.bodies.idle.y);  
        	$("#Entity [name=z] input").val(params.bodies.idle.z);  
        	$("#Entity [name=angle] input").val(params.bodies.idle.angle*180/Math.PI);  
        	$("#Entity [name=width] input").val(params.bodies.idle.width);  
        	$("#Entity [name=height] input").val(params.bodies.idle.height);
        	if(params.bodies.idle.type=="static") $("#sidr-id-bstatic").attr('checked',true); 
        	if(params.bodies.idle.type=="dynamic") $("#sidr-id-bdynamic").attr('checked',true); 
        	putImgs(params.bodies.idle.frames);   
		}
		this.tabObj.renderAll();
        This.refresh();
    },
   
    deleteSelected: function() {
    	var This = this;
		var activeObject = This.tabObj.getActiveObject(),
			activeGroup = This.tabObj.getActiveGroup();  
	    if (activeObject) {
	        //if (confirm('Are you sure?')) {
	            This.tabObj.remove(activeObject);
	            if(activeObject.params) game.deleteEntity(This.title, activeObject.params);
	        //}
	    }
	    else if (activeGroup) {
	       //if (confirm('Are you sure?')) {
	            var objectsInGroup = activeGroup.getObjects();
	            This.tabObj.discardActiveGroup();
	            objectsInGroup.forEach(function(object) {
	            	This.tabObj.remove(object);
	            	if(object.params) game.deleteEntity(This.title, object.params);
	            }); 
	            if(activeGroup.params) game.deleteEntity(This.title, activeGroup.params);
	        //}
	    }
    }, 

    undo: function() {
		if(this.tabObj._objects.length>0){
			var object = this.tabObj._objects.pop();
			this.h.push(object);
        	if(object.params) game.deleteEntity(this.title, object.params);
			this.tabObj.renderAll(); 
		}
    },

    redo: function() {
		if(this.h.length>0){
			this.isRedoing = true;
			var object = this.h.pop();
			game.setParams("entity", {scene:this.title, param:object.params});
			this.tabObj.add(object);
		} 
    },

    delete: function() {

    },

});





