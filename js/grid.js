/*
* debouncedresize: special jQuery event that happens once after a window resize
*
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/
var $event = $.event, $item1,
$special,
resizeTimeout;

$special = $event.special.debouncedresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments,
			dispatch = function() {
				// set correct event type
				event.type = "debouncedresize";
				$event.dispatch.apply( context, args );
			};

		if ( resizeTimeout ) {
			clearTimeout( resizeTimeout );
		}

		execAsap ?
			dispatch() :
			resizeTimeout = setTimeout( dispatch, $special.threshold );
	},
	threshold: 250
};

// ======================= imagesLoaded Plugin ===============================
// https://github.com/desandro/imagesloaded

// $('#my-container').imagesLoaded(myFunction)
// execute a callback when all images have loaded.
// needed because .load() doesn't work on cached images

// callback function gets image collection as argument
//  this is the container

// original: MIT license. Paul Irish. 2010.
// contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

// blank image data-uri bypasses webkit log warning (thx doug jones)
var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function( callback ) {
	var $this = this,
		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
		hasNotify = $.isFunction(deferred.notify),
		$images = $this.find('img').add( $this.filter('img') ),
		loaded = [],
		proper = [],
		broken = [];

	// Register deferred callbacks
	if ($.isPlainObject(callback)) {
		$.each(callback, function (key, value) {
			if (key === 'callback') {
				callback = value;
			} else if (deferred) {
				deferred[key](value);
			}
		});
	}

	function doneLoading() {
		var $proper = $(proper),
			$broken = $(broken);

		if ( deferred ) {
			if ( broken.length ) {
				deferred.reject( $images, $proper, $broken );
			} else {
				deferred.resolve( $images );
			}
		}

		if ( $.isFunction( callback ) ) {
			callback.call( $this, $images, $proper, $broken );
		}
	}

	function imgLoaded( img, isBroken ) {
		// don't proceed if BLANK image, or image is already loaded
		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
			return;
		}

		// store element in loaded images array
		loaded.push( img );

		// keep track of broken and properly loaded images
		if ( isBroken ) {
			broken.push( img );
		} else {
			proper.push( img );
		}

		// cache image and its state for future calls
		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

		// trigger deferred progress method if present
		if ( hasNotify ) {
			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
		}

		// call doneLoading and clean listeners if all images are loaded
		if ( $images.length === loaded.length ){
			setTimeout( doneLoading );
			$images.unbind( '.imagesLoaded' );
		}
	}

	// if no images, trigger immediately
	if ( !$images.length ) {
		doneLoading();
	} else {
		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){
			// trigger imgLoaded
			imgLoaded( event.target, event.type === 'error' );
		}).each( function( i, el ) {
			var src = el.src;

			// find out if this image has been already checked for status
			// if it was, and src has not changed, call imgLoaded on it
			var cached = $.data( el, 'imagesLoaded' );
			if ( cached && cached.src === src ) {
				imgLoaded( el, cached.isBroken );
				return;
			}

			// if complete is true and browser supports natural sizes, try
			// to check for image status manually
			if ( el.complete && el.naturalWidth !== undefined ) {
				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
				return;
			}

			// cached images don't fire load sometimes, so we reset src, but only when
			// dealing with IE, or image is complete (loaded) and failed manual check
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			if ( el.readyState || el.complete ) {
				el.src = BLANK;
				el.src = src;
			}
		});
	}

	return deferred ? deferred.promise( $this ) : $this;
};

var Grid = (function() {

		// list of items
	var $grid = $( '#og-grid' ),
		// the items
		$items = $grid.children( 'li' ),
		// current expanded item's index
		current = -1,
		// position (top) of the expanded item
		// used to know if the preview will expand in a different row
		previewPos = -1,
		// extra amount of pixels to scroll the window
		scrollExtra = 0,
		// extra margin when expanded (between preview overlay and the next items)
		marginExpanded = 10,
		$window = $( window ), winsize,
		$body = $( 'html, body' ),
		// transitionend events
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support for csstransitions
		support = Modernizr.csstransitions,
		// default settings
		settings = {
			minHeight : 500,
			speed : 350,
			easing : 'ease'
		};

	function init( config ) {
		
		if(config=="games") settings.gridType = "games";
		if(config=="tutorials") settings.gridType = "tutorials";
		if(config=="assets") settings.gridType = "assets";
		// the settings..
		settings = $.extend( true, {}, settings, config );

		// preload all images
		$grid.imagesLoaded( function() {

			// save item´s size and offset
			saveItemInfo( true );
			// get window´s size
			getWinSize();
			// initialize some events
			initEvents();

		} );

	}

	// add more items to the grid.
	// the new items need to appended to the grid.
	// after that call Grid.addItems(theItems);
	function addItems( $newitems ) {

		$items = $items.add( $newitems );

		$newitems.each( function() {
			var $item = $( this );
			$item.data( {
				offsetTop : $item.offset().top,
				height : $item.height()
			} );
		} );

		initItemsEvents( $newitems );

	}

	// saves the item´s offset top and height (if saveheight is true)
	function saveItemInfo( saveheight ) {
		$items.each( function() {
			var $item = $( this );
			$item.data( 'offsetTop', $item.offset().top );
			if( saveheight ) {
				$item.data( 'height', $item.height() );
			}
		} );
	}

	function initEvents() {
		
		// when clicking an item, show the preview with the item´s info and large image.
		// close the item if already expanded.
		// also close if clicking on the item´s cross
		initItemsEvents( $items );
		
		// on window resize get the window´s size again
		// reset some values..
		// $window.on( 'debouncedresize', function() {
			
			scrollExtra = 0;
			previewPos = -1;
			// save item´s offset
			saveItemInfo();
			getWinSize();
			var preview = $.data( this, 'preview' );
			if( typeof preview != 'undefined' ) {
				hidePreview();
			}

		// } );

	}

	function initItemsEvents( $items ) {
		$items.on( 'click', 'span.og-close', function() {
			hidePreview();
			$item1 = undefined;
			return false;
		} ).children( 'a' ).on( 'click', function(e) { 
			if($item1 && $item1.attr("id") == $( this ).parent().attr("id")) return false;
			// console.log("yes__"+$( this ).parent().attr("id")+"__"+$( this ).parent().attr("id"));
			var className = $(event.target).attr('class');
			if( className != "image" ) return true;
			$item1 = $( this ).parent();
			// check if item already opened
			(current === $item1.index()) ? hidePreview() : showPreview( $item1 ); 
			return false;

		} );
	}

	function getWinSize() {
		winsize = { width : $window.width(), height : $window.height() };
	}

	function showPreview( $item ) { 
		var preview = $.data( this, 'preview' ),
			// item´s offset top
			position = $item.data( 'offsetTop' );

		scrollExtra = 0;

		// if a preview exists and previewPos is different (different row) from item´s top then close it
		if( typeof preview != 'undefined' ) {

			// not in the same row
			if( previewPos !== position ) {
				// if position > previewPos then we need to take te current preview´s height in consideration when scrolling the window
				if( position > previewPos ) {
					scrollExtra = preview.height;
				}
				hidePreview(); 
			}
			// same row
			else {  
				preview.update( $item );
				return false;
			}
			
		}  
		// update previewPos
		previewPos = position;
		// initialize new preview for the clicked item
		preview = $.data( this, 'preview', new Preview( $item ) );
		// expand preview overlay
		preview.open();   

	}

	function hidePreview() {
		try { 
			current = -1;
			var preview = $.data( this, 'preview' );
			preview.close();
			$.removeData( this, 'preview' );
		} catch(e) {}
	}

	// the preview obj / overlay
	function Preview( $item ) {
		this.$item = $item;
		this.expandedIdx = this.$item.index();
		this.create();
		this.update( $item );  
	}

	Preview.prototype = {
		create : function() { 

			// create Preview structure:
			this.$title = $( '<h3></h3>' );
			this.$description = $( '<p></p>' );
			this.$tags = $( '<p></p>' );
			this.$userEmail = $( '<p></p>' );

			if(settings.gridType=="games")
				this.$pLink = $( '<a class="niceDiv" href="#" target="_blank">Play Game</a>' ); 
			if(settings.gridType=="tutorials") 
				this.$pLink = $( '<div></div>' ); 
			if(settings.gridType=="assets") 
				this.$pLink = $( '<div></div>' ); 
			this.$details = $( '<div class="og-details"></div>' ).append( this.$title, this.$description, this.$tags, this.$userEmail, this.$pLink );
			this.$loading = $( '<div class="og-loading"></div>' );
			this.$carrousel = $( '<div class="og-fullimg"></div>' ).append( this.$loading );
			this.$closePreview = $( '<span class="og-close glyphicon glyphicon-remove-sign"></span>' );
			this.$previewInner = $( '<div class="og-expander-inner"></div>' ).append( this.$closePreview, this.$carrousel, this.$details );
			this.$previewEl = $( '<div class="og-expander"></div>' ).append( this.$previewInner );
			// append preview element to the item
			this.$item.append( this.getEl() );
			// set the transitions for the preview and the item
			if( support ) {
				this.setTransition();
			}
		},
		update : function( $item ) { 
			if( $item ) {
				this.$item = $item;
			}
			
			// if already expanded remove class "og-expanded" from current item and add it to new item
			if( current !== -1 ) {
				var $currentItem = $items.eq( current );
				$currentItem.removeClass( 'og-expanded' );
				this.$item.addClass( 'og-expanded' );
				// position the preview correctly
				// this.positionPreview();
			}

			// update current value
			current = this.$item.index();

			// update preview´s content
			var previewData = this.$item.children('a').data( 'data' ) ;

			var NUM, screenshots, videos, assets;

			if(settings.gridType=="games") { 
	            this.$title.html( previewData.gameName );
				this.$description.html( previewData.description );
				this.$tags.html(  "Genres: "+previewData.genres );
				this.$userEmail.html( "Developer Email: "+previewData.userEmail );
				this.$pLink.attr( 'href', document.location.origin+"/showcase?gameId="+Base64.encode( previewData.userEmail+previewData.gameName ) ); 

				 screenshots = previewData.screenshots.split(',');
				 videos = previewData.trailers.split(','); 
				NUM = previewData.gameN; 
			}

			if(settings.gridType=="tutorials") { 
	            this.$title.html( previewData.tutorialTitle );
				this.$description.html( previewData.description );
				this.$tags.html(  "Tags: "+previewData.tags );
				this.$userEmail.html( "Developer Email: "+previewData.userEmail );

				 screenshots = previewData.screenshots.split(',');
				 videos = previewData.tutorials.split(','); 

				 this.$pLink.html(""); 
				for (var i = 0; i < videos.length; i++) {
					this.$pLink.append( 
			            ' <a class="niceDiv" href="'+videos[i]+'" download>Download Tutorial Part'+(i+1)+'</a> '
			        ); 
				}; 
				NUM = previewData.tutN; 
			}

			if(settings.gridType=="assets") { 
	            this.$title.html( previewData.assetName );
				this.$description.html( previewData.description );
				this.$tags.html(  "Tags: "+previewData.tags );
				this.$userEmail.html( "Developer Email: "+previewData.userEmail ); 

				screenshots = previewData.screenshots.split(','); 
				assets = previewData.assets.split(','); 
				
				this.$pLink.html(""); 
				for (var i = 0; i < assets.length; i++) {
					this.$pLink.append( 
			            ' <a class="niceDiv" href="'+assets[i]+'" download>Download Asset '+(i+1)+'</a> '
			        ); 
				};
				NUM = previewData.assetN; 
			}
			
			if($('#jssor_slider'+NUM).length) { 
				$('#jssor_slider'+NUM).remove();
			}

			var $slides = $("<div></div>"); 
 
			for (var i = 0; settings.gridType!="assets" &&  i < videos.length ; i++) {
				var videoVid =  ''+ 
				'<video id="gamevideo" class="video-js image1" controls preload="auto" poster="'+ screenshots[0] +'"   '+ 
				'data-setup="{}">        '+
				'    <source id="gameVid" src="'+ videos[i] +'">     '+
				'</video>   ' ;

				$slides.append( 
		            ' <div data-p="144.50" style="display: none;"> ' +
		            	  videoVid +
		            '     <img class="thumb1" data-u="thumb" src="data/images/video.png" /> ' +
		            ' </div> '
		        ); 
			}; 
 
			for (var i = 0; i < screenshots.length; i++) {
				$slides.append( 
		            ' <div data-p="144.50" style="display: none;"> ' +
		            '     <img class="image1" data-u="image" src="'+ screenshots[i]+'" /> ' +
		            '     <img class="thumb1" data-u="thumb" src="'+ screenshots[i]+'" /> ' +
		            ' </div> '
		        ); 
			}; 

			var carrouselInner = '' +
' <div id="jssor_slider'+NUM+'" class="slider"> ' +
' <div data-u="loading" style="position: absolute; top: 0px; left: 0px;"> ' +
'     <div style="filter: alpha(opacity=70); opacity: 0.7; position: absolute; display: block; top: 0px; left: 0px; width: 100%; height: 100%;"></div> ' +
'     <div style="position:absolute;display:block;background:url("data/images/loading.gif") no-repeat center center;top:0px;left:0px;width:100%;height:100%;"></div> ' +
' </div> ' +
' <div data-u="slides" class="slides1"> ' + $slides.html() +

' </div> ' +
' <!-- Thumbnail Navigator --> ' +
' <div data-u="thumbnavigator" class="jssort01 thumbnav" data-autocenter="1"> ' +
'     <!-- Thumbnail Item Skin Begin --> ' +
'     <div data-u="slides" style="cursor: default;"> ' +
'         <div data-u="prototype" class="p"> ' +
'             <div class="w"> ' +
'                 <div data-u="thumbnailtemplate" class="t"></div> ' +
'             </div> ' +
'             <div class="c"></div> ' +
'         </div> ' +
'     </div> ' +
'     <!-- Thumbnail Item Skin End --> ' +
' </div> ' +
' <!-- Arrow Navigator --> ' +
' <span data-u="arrowleft" class="jssora05l" style="top:158px;left:8px;width:40px;height:40px;"></span> ' +
' <span data-u="arrowright" class="jssora05r" style="top:158px;right:8px;width:40px;height:40px;"></span> ' +
' </div> ';

			this.$carrousel.html( carrouselInner );

			var jssor_slider_init = function() {
                
                var jssor_1_SlideshowTransitions = [ 
              		{$Duration:1200,x:0.3,$During:{$Left:[0.3,0.7]},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
                ];
	            
	            var jssor_1_options = {
	              $AutoPlay: false,
	              $SlideshowOptions: {
	                $Class: $JssorSlideshowRunner$,
	                $Transitions: jssor_1_SlideshowTransitions,
	                $TransitionsOrder: 1
	              },
	              $ArrowNavigatorOptions: {
	                $Class: $JssorArrowNavigator$
	              },
	              $ThumbnailNavigatorOptions: {
	                $Class: $JssorThumbnailNavigator$,
	                $Cols: 10,
	                $SpacingX: 8,
	                $SpacingY: 8,
	                $Align: 360
	              }
	            };
	            
	            var jssor_1_slider = new $JssorSlider$("jssor_slider"+NUM, jssor_1_options);
	            
	            //responsive code begin
	            //you can remove responsive code if you don't want the slider scales while window resizing
	            function ScaleSlider() {
	                var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
	                if (refSize) { 
	                    jssor_1_slider.$ScaleWidth(refSize);
	                }
	                else {
	                    window.setTimeout(ScaleSlider, 30);
	                }
	            }
	            ScaleSlider(); 
                //responsive code end
            };

            // console.log(  $("#jssor_slider"+NUM).attr('class') );
			try {
				jssor_slider_init();  
			} catch(e) { }

		},
		open : function() {

			setTimeout( $.proxy( function() {	
				// set the height for the preview and the item
				this.setHeights();
				// scroll to position the preview in the right place
				// this.positionPreview();
			}, this ), 25 );

		},
		close : function() {

			var self = this,
				onEndFn = function() {
					if( support ) {
						$( this ).off( transEndEventName );
					}
					self.$item.removeClass( 'og-expanded' );
					self.$previewEl.remove();
				};

			setTimeout( $.proxy( function() {

				if( typeof this.$largeImg !== 'undefined' ) {
					this.$largeImg.fadeOut( 'fast' );
				}
				this.$previewEl.css( 'height', 0 );
				// the current expanded item (might be different from this.$item)
				var $expandedItem = $items.eq( this.expandedIdx );
				$expandedItem.css( 'height', $expandedItem.data( 'height' ) ).on( transEndEventName, onEndFn );

				if( !support ) {
					onEndFn.call();
				}

			}, this ), 25 );
			
			return false;

		},
		calcHeight : function() {

			var heightPreview = winsize.height - this.$item.data( 'height' ) - marginExpanded,
				itemHeight = winsize.height;

			if( heightPreview < settings.minHeight ) {
				heightPreview = settings.minHeight;
				itemHeight = settings.minHeight + this.$item.data( 'height' ) + marginExpanded;
			}

			this.height = heightPreview;
			this.itemHeight = itemHeight;

		},
		setHeights : function() {

			var self = this,
				onEndFn = function() {
					if( support ) {
						self.$item.off( transEndEventName );
					}
					self.$item.addClass( 'og-expanded' );
				};

			this.calcHeight();
			this.$previewEl.css( 'height', this.height );
			this.$item.css( 'height', this.itemHeight ).on( transEndEventName, onEndFn );

			if( !support ) {
				onEndFn.call();
			}

		},
		positionPreview : function() {

			// scroll page
			// case 1 : preview height + item height fits in window´s height
			// case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
			// case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
			var position = this.$item.data( 'offsetTop' ),
				previewOffsetT = this.$previewEl.offset().top - scrollExtra,
				scrollVal = this.height + this.$item.data( 'height' ) + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - ( winsize.height - this.height ) : previewOffsetT;
			
			$body.animate( { scrollTop : scrollVal  /* (this.$previewEl.offset().top - 200) */ }, settings.speed );

		},
		setTransition  : function() {
			this.$previewEl.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
			this.$item.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
		},
		getEl : function() {
			return this.$previewEl;
		}
	}

	return { 
		init : init,
		addItems : addItems
	};

})();