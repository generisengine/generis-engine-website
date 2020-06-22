

WindowClass = Class.extend({

    tabs: {},
    id: null,
    name:null,
    
    init :  function(){},
    
    init : function( tabType, x, y, w, h, name, text ) { 
        
        generisBusy = true;
      setCursorByID("body", "wait");
      
        var wnd = document.createElement("div");
        
        var today = new Date();

        var t = today.getHours(); // => 9
        t += today.getMinutes(); // =>  30
       t +=  today.getSeconds(); // => 51
        t +=  Math.random();

        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        today = mm +dd +yyyy; 

        wnd.id = "window" + today + t;
        wnd.id = wnd.id.split('.').join("");
        wnd.className = "winPane";

        this.id = wnd.id; 
 
        wnd.innerHTML =  this.strWnd(x, y, w, h);  

        ///////////////////////////////////////
                        
        document.getElementById("windows").appendChild(wnd); 
      
     // var activeWin = document.getElementById(this.id);
      //    activeWin.onclick = function(){ game.activeWindow = this.id;}; 
      
      
      this.createTab(tabType, name, text) ; 

      $(document).on("click" , function(event) {  
            if ($(event.target).attr('class') != "glyphicon glyphicon-plus" &&
              $(event.target).attr('class') != "glyphicon glyphicon glyphicon-cog params" &&
              $(event.target).attr('class') != "btn newTab"
              ) 
              $(".contextMenu").hide(); 
        }); 


      $('#' + wnd.id + ' .menuClose').click(function(e) { 
          var elements = document.getElementById(wnd.id); 
          delete game.activeWindows[wnd.id];
          elements.parentNode.removeChild(elements);  
      }); 

      $('#' + wnd.id + ' .newTab').click(function(e) { 
          console.log("newTab"); 
          $(".contextMenu").hide(); 
          $("#newTabDropdown").css({
            display: "block",
            left: e.pageX,
            top: e.pageY
          }); 
      });  

      $('#' + wnd.id + ' .params').click(function(e) { 
          console.log("params"); 
          $(".contextMenu").hide(); 
          $("#paramsDropdown").css({
            display: "block",
            left: e.pageX,
            top: e.pageY
          }); 
      });  
       ///////////////////////////////////////
                      
      // var tabOpt = wnd.getElementsByClassName("tabOpt")[0];
      // tabOpt.onclick = function(){ windowProps = $('#windowProps').bPopup(fontsize); }
      
      generisBusy = false;
      setCursorByID("body", "default");
     
     
  
    },

    strWnd : function(x, y, w, h) { 
        $( 'div.pane').removeClass('active'); 

        var style = "width: " + w + "px; height: " + h + "px; top: " + y + "px; left: " + x + "px;";

        return ' <div class ="pane active" style="' + style + '""> <div class="menuBar"> <div class="btn-group">  <button class="btn menuClose" data-tag="tooltip" title="close"> <span class="glyphicon glyphicon-remove" style="position: absolute; top:6px; left:6px"></span> </button> <button class="btn maxim" data-tag="tooltip" title="Maximize/Minimize"> <span class="glyphicon glyphicon-unchecked" style="position: absolute; top:6px; left:6px"></span> </button> <button class="btn newTab" data-tag="tooltip" title="New Tab"> <span class="glyphicon glyphicon-plus" style="position: absolute; top:6px; left:6px"></span> </button>  </div>  <span class="glyphicon glyphicon glyphicon-cog params" data-tag="tooltip" title="Local Parameters"> </span> <span id="activeTabTitle"> Active Tab Title </span> </div> <!--menuBar-->  <div  class="tabsBar"> <div class="btn-group"> <button class="btn scrollTabsLeft" data-tag="tooltip" title="Scroll Left"> <span class="glyphicon glyphicon-chevron-left" ></span> </button> <button class="btn scrollTabsRight" data-tag="tooltip" title="Scroll Right"> <span class="glyphicon glyphicon-chevron-right" ></span> </button> </div> <nav> <ul></ul> </nav> </div> <!--tabsBar--> <div class="tabsContainer" > </div> <div class="footer"> </div> </div>  <div class = "ghostpane" style="' + style + '""></div> '
    
    },

    createTab : function(tabType, name, text) {
      
      //name = (name+" ["+tabType+"]");
      $('#'+this.id+' #activeTabTitle').html($('#'+this.id+" .tabsBar .active .title").html()); 
      
      if ( tabType == "empty" ) {
        this.wdwMechanics( this.id );
        return;
      }

      if ( (tabType+"_"+name) in this.tabs  ) { 
        $('#TabIsOpened').bPopup(fontsize);
        return;
      }

      var tab ; 
      var tabNum = Object.keys(this.tabs).length + 1;

      $( '#' + this.id + ' div.tabsBar nav li').removeClass('active');
      $('#' + this.id + ' .tab-content').removeClass('active');

      //console.log(Object.keys(this.tabs).length + 1);
      var This = this;
      var close = function() {

      };



      if ( tabType == "script"  || tabType == "style" || tabType == "markup" ) {

        tab = new ScriptEditor( name, tabType, tabNum, this.id, text);
        this.tabs[(tabType+"_"+name)] = tab;
   
      } else if ( tabType == "sceneEditor" ) {

        tab = new SceneEditor( name, tabNum, this.id );
        this.tabs[tabType+"_"+name] = tab;
   
      } else if ( tabType == "sceneViewer" ) {

        tab = new SceneViewer( name, tabNum, this.id );
        this.tabs[tabType+"_"+name] = tab;
   
      } else if ( tabType == "browser" ) {

        tab = new ProjectBrowser( name, tabNum, this.id );
        this.tabs[tabType+"_"+name] = tab;
   
      } else if ( tabType == "Documentation" ) {
        
        tab = new DocClass( name, tabNum, this.id );
        this.tabs[tabType+"_"+name] = tab;
   
      }

      $('#'+this.id+' #activeTabTitle').html($('#'+this.id+" .tabsBar .active .title").html()); 

      this.wdwMechanics( this.id );

      return tab;
    },

    closeTab : function() {
      try { 
        var elements = document.getElementById(this.id);

        var tabCur1 = elements.getElementsByClassName("tab-content active")[0];
        var tabCur2 = elements.getElementsByClassName("tab-link active")[0];
        
        console.log(tabCur1.id +"__"+ tabCur2.id)
        
        delete this.tabs[tabCur1.id]; 
        delete this.tabs[tabCur2.id]; 

        tabCur1.parentNode.removeChild(tabCur1); 

        tabCur2.parentNode.removeChild(tabCur2); 
        var arr = Object.keys(this.tabs); 
        $('#' + this.id + ' #tab-' + this.tabs[ arr[arr.length - 1] ].num).addClass('active');
        $( '#' + this.id + " div[id='" + ((arr[arr.length - 1]).replace('.','-')) + "']").addClass('active'); 
        console.log("yes");
      } catch(e){console.log(e);}

    },


    close : function() {
 
        var elements = document.getElementById(this.id); 
        delete game.activeWindows[this.id];
        elements.parentNode.removeChild(elements); 
    },

    // can all be overloaded by child classes
    update : function() { },


    wdwMechanics : function( wdwName) { 
            
            game.activeWindow = wdwName;
            var This = this;

            $('#' + wdwName).ready(function(){

                var item = $('#' + wdwName + ' div.tabsBar nav');

                $('#' + wdwName + ' .scrollTabsRight').click( function(event) { 
                    var far = item.width();
                    var pos = item.scrollLeft() + far; //200;
                    item.animate( { scrollLeft: pos }, 500, 'easeOutQuad' );  
                });
                $('#' + wdwName + ' .scrollTabsLeft').click(function(event) { 
                    var far = $('#' + wdwName + ' div.tabsBar nav').width();
                    var pos = item.scrollLeft() - far; //200;
                    item.animate( { scrollLeft: pos }, 500, 'easeOutQuad' );  
                });

                var newHeight = $('#' + wdwName + ' div.pane').height() - 65; 
                $('#' + wdwName + ' div.tabsContainer').css("height", newHeight); 

                $('#' + wdwName + ' div.tabsBar nav li').click(function(event){

                    if( $(event.target).attr('class') == "glyphicon glyphicon-remove-sign") {

                      var tabId = $(this).attr("id");
                      var tabDataId = $(this).attr('data-tab'); 
                      var tabCur1 = document.getElementById( tabId );
                      var tabCur2 = document.getElementById(tabDataId );          
                      delete This.tabs[tabId]; 
                      delete This.tabs[tabDataId]; 
                      $("#"+wdwName+" #"+ tabId.replace('.','\\.')).remove();
                      $("#"+wdwName+" #"+ tabDataId).remove();
                      var arr = Object.keys(This.tabs);  
                      if($(this).hasClass('active') && arr.length>0) {  
                        var id= arr[arr.length - 1];
                        $('#' + wdwName + ' #tab-' + This.tabs[id].num).addClass('active');  
                        $( '#' + wdwName + " #" +  id.replace('.','\\.')).addClass('active');  
                      }   
                      return;
                    }

                    if($(this).hasClass('active') ) return;
                    var tab_num = $(this).attr('data-tab'); 
                    $('#' + wdwName + ' div.tabsBar nav li').removeClass('active');
                    $('#' + wdwName + ' .tab-content').removeClass('active'); 
                    $(this).addClass('active');
                    $( '#' + wdwName + " div[id='" + tab_num + "']").addClass('active'); 
                }) 

                $('#' + wdwName + ' div.pane').click(function(){ 
                    $('#'+wdwName+' #activeTabTitle').html($('#'+wdwName+" .tabsBar .active .title").html()); 
                    $( 'div.pane').removeClass('active'); 
                    $(this).addClass('active');  
                    game.activeWindow = wdwName;
                }) 

                // ctxMenuCreate('#' + wdwName + ' div.menuBar', "#menuBarCtxMenu"); 
                // ctxMenuCreate('#' + wdwName + ' div.tabsBar nav', "#tabsBarCtxMenu");


            })

            /*
             * @author https://twitter.com/blurspline / https://github.com/zz85
             * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
             */

             //// All of the 40s and 41s and 38s

            "use strict";

            // Minimum resizable area
            var minWidth = 230;
            var minHeight = 200;

            var menuBarHeight = 6;

            // Thresholds
            var FULLSCREEN_MARGINS = -10;
            var MARGINS = 5;
            var MARGINS2 = -2;
            var offset = $('#menubar').height(); 

            // End of what's configurable.
            var clicked = null;
            var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

            var rightScreenEdge, bottomScreenEdge;

            var preSnapped;

            var b, x, y;
            var out = {x:0, y:0, width:0, height:0};
            var toggledFull = false;

            var redraw = false;

            var wdw = document.getElementById(wdwName);

            var pane = wdw.getElementsByClassName("pane")[0];
            var ghostpane =wdw.getElementsByClassName("ghostpane")[0];

            function setBounds(element, x, y, w, h) {
                element.style.left = x + 'px';
                element.style.top = y + 'px';
                element.style.width = (w ) + 'px';
                element.style.height =  (h )  + 'px';
                
                var newHeight = $('#' + wdwName + ' div.pane').height() - 65; 
                $('#' + wdwName + ' div.tabsContainer').css("height", newHeight); 
            }

            function saveBounds(element, out) {
                var boundOut = pane.getBoundingClientRect();
                out.x = boundOut.left + 'px';
                out.y = boundOut.top + 'px';
                out.width = (boundOut.width ) + 'px';
                out.height =  (boundOut.height )  + 'px';
            }

            function hintHide() {
              setBounds(ghostpane, b.left, b.top, b.width, b.height);
              ghostpane.style.opacity = 0;

              // var b = ghostpane.getBoundingClientRect();
              // ghostpane.style.top = b.top + b.height / 2;
              // ghostpane.style.left = b.left + b.width / 2;
              // ghostpane.style.width = 0;
              // ghostpane.style.height = 0;
            }


            // Mouse events
            pane.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);

            // Touch events 
            pane.addEventListener('touchstart', onTouchDown);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);

            $( '#'+wdwName+' .toggleFull').click(function(e){
                if(!toggledFull){ 
                  setBounds(pane, 0, 0, workSpaceSize.width, workSpaceSize.height);
                  saveBounds(pane, out);
                  toggledFull = true;
                } else {
                  setBounds(pane, out.x, out.y, out.width, out.height);
                  toggledFull = false;
                }
            });

             $('#'+wdwName+' .maxim').click(function(e) {  
                  var snapped = {
                    width: b.width,
                    height: b.height
                  };
                  setBounds(pane, 0, 0, workSpaceSize.width, workSpaceSize.height);
                  preSnapped = snapped; 
              }); 

            function onTouchDown(e) {
              onDown(e.touches[0]);
              e.preventDefault();
            }

            function onTouchMove(e) {
              onMove(e.touches[0]);     
            }

            function onTouchEnd(e) {
              if (e.touches.length ==0) onUp(e.changedTouches[0]);
            }

            function onMouseDown(e) {
              onDown(e);
              e.preventDefault();
            }

            function onDown(e) {
              calc(e);

              var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

              clicked = {
                x: x,
                y: y,
                cx: e.clientX,
                cy: e.clientY,
                w: b.width,
                h: b.height,
                isResizing: isResizing,
                isMoving: !isResizing &&  (e.which==1?canMove():false) && pane.style.cursor != 'pointer',
                onTopEdge: onTopEdge,
                onLeftEdge: onLeftEdge,
                onRightEdge: onRightEdge,
                onBottomEdge: onBottomEdge
              };
            }

            function canMove() {
              return x > 0 && x < b.width && y > 0 && y < b.height
              && y < 25;
            }

            function calc(e) {
              b = pane.getBoundingClientRect();
              x = e.clientX - b.left;
              y = e.clientY - b.top;

              onTopEdge = y < MARGINS ;
              onLeftEdge = x < MARGINS ;
              onRightEdge = x >= b.width - MARGINS ;
              onBottomEdge = y >= b.height - MARGINS ;

              rightScreenEdge = workSpaceSize.width - MARGINS;
              bottomScreenEdge = workSpaceSize.height - MARGINS;
            }

            var e;

            function onMove(ee) {
              calc(ee);

              e = ee;

              redraw = true;

            } 

            function animate() {

              requestAnimationFrame(animate);

              if (!redraw) return;

              redraw = false; 

              if (clicked && clicked.isResizing) {

                if (clicked.onRightEdge) pane.style.width = Math.max(x-30+(offset/2), minWidth) + 'px';
                if (clicked.onBottomEdge) pane.style.height = Math.max(y-30+(offset/2), minHeight) + 'px';

                if (clicked.onLeftEdge) {
                  var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w , minWidth);
                  if (currentWidth > minWidth) {
                    pane.style.width = currentWidth + 'px';
                    pane.style.left = (e.clientX-$('#workSpace').position().left) + 'px'; 
                  }
                }

                if (clicked.onTopEdge) {
                  var currentHeight = Math.max(clicked.cy - e.clientY + clicked.h , minHeight);
                  if (currentHeight > minHeight) {
                    pane.style.height = currentHeight + 'px';
                    pane.style.top = (e.clientY-offset-18) + 'px';  
                  }
                }

                hintHide();

                return;
              }

              if (clicked && clicked.isMoving) {

                //if (b.top < FULLSCREEN_MARGINS2 || b.left < FULLSCREEN_MARGINS2 || b.right > workSpaceSize.width - FULLSCREEN_MARGINS2 || b.bottom > workSpaceSize.height - FULLSCREEN_MARGINS2) {
                //  // hintFull();
                //  setBounds(ghostpane, 0, 0, workSpaceSize.width, workSpaceSize.height);
                //  ghostpane.style.opacity = 0.2;
                //} else   

                if (e.clientY <= offset+18) {
                  // hintTop();
                  setBounds(ghostpane, 0, 0, workSpaceSize.width, workSpaceSize.height / 2);
                  ghostpane.style.opacity = 0.4;
                } else if (e.clientX <= $('#workSpace').position().left) {
                  // hintLeft();
                  setBounds(ghostpane, 0, 0, workSpaceSize.width / 2, workSpaceSize.height );
                  ghostpane.style.opacity = 0.4;
                } else if (e.clientX >= workSpaceSize.width-2+$('#workSpace').position().left) {
                  // hintRight();
                  setBounds(ghostpane, workSpaceSize.width / 2, 0, workSpaceSize.width / 2, workSpaceSize.height);
                  ghostpane.style.opacity = 0.4;
                } else if (e.clientY >= workSpaceSize.height-2+offset) {
                  // hintBottom();
                  setBounds(ghostpane, 0, workSpaceSize.height / 2, workSpaceSize.width, workSpaceSize.height / 2);
                  ghostpane.style.opacity = 0.4;
                } else {
                  hintHide();
                }

                if (preSnapped) {
                  setBounds(pane,
                    e.clientX - preSnapped.width / 2,
                    e.clientY - Math.min(clicked.y, preSnapped.height) - offset - 18,
                    preSnapped.width,
                    preSnapped.height
                  );
                  return;
                }

                // moving
                pane.style.top = (e.clientY - clicked.y - offset - 18) + 'px';
                pane.style.left = (e.clientX - clicked.x-$('#workSpace').position().left) + 'px';

                return;
              }

              // This code executes when mouse moves without clicking

              // style cursor
              if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
                pane.style.cursor = 'nwse-resize';
              } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
                pane.style.cursor = 'nesw-resize';
              } else if (onRightEdge || onLeftEdge) {
                pane.style.cursor = 'ew-resize';
              } else if (onBottomEdge || onTopEdge) {
                pane.style.cursor = 'ns-resize';
              } else if (canMove() ) {
                pane.style.cursor = 'move';
              } else {
                pane.style.cursor = 'default';
              }
            }

            animate(); 

            function onUp(e) {
              calc(e);

              if (clicked && clicked.isMoving) {
                // Snap
                var snapped = {
                  width: b.width,
                  height: b.height
                };

                //if (b.top < FULLSCREEN_MARGINS2 || b.left < FULLSCREEN_MARGINS2 || b.right > workSpaceSize.width - FULLSCREEN_MARGINS2 || b.bottom > workSpaceSize.height - FULLSCREEN_MARGINS2) {
                //  // hintFull();
                //  setBounds(pane, 0, 0, workSpaceSize.width, workSpaceSize.height);
                //  preSnapped = snapped;
                //} else  

                if (e.clientY <= offset+18) {
                  // hintTop();
                  setBounds(pane, 0, 0, workSpaceSize.width, workSpaceSize.height / 2);
                  preSnapped = snapped;
                } else if (e.clientX <= $('#workSpace').position().left) {
                  // hintLeft();
                  setBounds(pane, 0, 0, workSpaceSize.width / 2, workSpaceSize.height );
                  preSnapped = snapped;
                } else if (e.clientX >= workSpaceSize.width-2+$('#workSpace').position().left) {
                  // hintRight();
                  setBounds(pane, workSpaceSize.width / 2, 0, workSpaceSize.width / 2, workSpaceSize.height);
                  preSnapped = snapped;
                } else if (e.clientY >= workSpaceSize.height-2+offset ) {
                  // hintBottom();
                  setBounds(pane, 0, workSpaceSize.height / 2, workSpaceSize.width, workSpaceSize.height / 2);
                  preSnapped = snapped;
                } else {
                  preSnapped = null;
                }

                hintHide();

              }

              clicked = null;

            }

        },

});





