
gDriveApi = Class.extend({
    
    gdriveAccFiles : {},
    gdriveAccFilesIds : {},
    generisAccFiles : [],
    account : null,
    Host:"gDrive",
	filesInfo: [], 
	libp:"",
  CLIENT_ID: CLIENT_ID,
  SCOPES: ['https://www.googleapis.com/auth/drive'],
	
    init: function(check) {

        var x = this;

        if(check) 
            gapi.auth.authorize( {client_id: this.CLIENT_ID, scope: this.SCOPES.join(' '), immediate: true},
                                  handleAuthResult_1);
        else
            gapi.auth.authorize( {client_id: this.CLIENT_ID, scope: this.SCOPES, immediate: false},
                                  handleAuthResult_2);

            function handleAuthResult_1(authResult) {
                if (authResult && !authResult.error) { 
                  generisBusy = true; 
                  setCursorByID("body", "wait"); 
                  loginP = $('#loginP').bPopup(fontsize);
                  loadDriveApi();  
                } else { 
                   logPopup = $('#login').bPopup(fontsize); 
                }
            }

            function handleAuthResult_2(authResult) {

                if (authResult && !authResult.error) { 
                  loadDriveApi();  
                  try { logPopup.close(); } catch(e) {} 
                } else { 
                   $('#logError').bPopup(fontsize);
                   setCursorByID("body", "default"); 
                }
            }

            function loadDriveApi() {
              try {
                gapi.client.load('drive', 'v2', setup);
              } catch(e) {
                   if(loginP) loginP.close();
                   generisBusy = false;   
                   setCursorByID("body", "default");  
                   $('#logError').bPopup(fontsize);
              }
            } 

            function setup() { 
              try { 
                var request = gapi.client.drive.about.get();

                request.execute(function(resp) { 
                  try { 
                    x.displayName = resp.user.displayName;
                    x.emailAddress = resp.user.emailAddress;
                    document.getElementById("userName").innerHTML = resp.user.displayName;
                    document.getElementById("userEmail").innerHTML = resp.user.emailAddress;
                    document.getElementById("userInfo").style.visibility = "visible";
                    document.getElementById("hostUrl").href = "https://drive.google.com/drive/my-drive";
                    document.getElementById("hostLogo").src = "data/images/google-drive-logo.png";
				    log.innerHTML = "LOGOUT";
                    if(loginP) loginP.close();
			        x.filesInfoUpdate(x.generisAccount);
			        
			        window.setInterval(function(){
	                    refreshToken(); 
                    },3000000); //<--this is in milliseconds
                    function refreshToken() {
                      try {
                          generisBusy = true; 
                          setCursorByID("body", "wait"); 
                          gapi.auth.authorize( {client_id: x.CLIENT_ID, scope: x.SCOPES.join(' '), immediate: true},   tokenRefreshed);
                      } catch(e) {  
                      console.log(e);
                         generisBusy = false;   
                         setCursorByID("body", "default");  
                         $('#logError').bPopup(fontsize); 
                      }   
                    }
                    function tokenRefreshed(result){
                         generisBusy = false;   
                         setCursorByID("body", "default");  
                    }
                  } catch(e) {
                       if(loginP) loginP.close();
                       generisBusy = false;   
                       setCursorByID("body", "default");  
                       $('#logError').bPopup(fontsize);
                  } 
                });
              } catch(e) { 
                 if(loginP) loginP.close();
                 generisBusy = false;   
                 setCursorByID("body", "default");  
                 $('#logError').bPopup(fontsize); 
              }   
            }
    },  

    publish: function(fileId, callback) {
      var permissionBody = {
        'value': '',
        'type': 'anyone',
        'role': 'reader'
      };
      var permissionRequest = gapi.client.drive.permissions.insert({
        'fileId': fileId,
        'resource': permissionBody
      });
      permissionRequest.execute(function(resp) { 
          callback(resp);
      });
    },

    sendFile: function(File, id, parents, That) {
      var This=this;// failed = 0;
      var uploader = new MediaUploader({
          file: File,
          parents: parents,
          token: gapi.auth.getToken().access_token,
          uploadType: 'resumable',
          onProgress: webix.bind(function(e){ That.$updateProgress(id, e.loaded/e.total*100); }, That),
          onError: function(resp) {
            //if(failed != 5) {
            //  failed += 1;
              console.log("resumed");
              uploader.upload();  
            //}
          },
          onComplete: function(resp) {
            console.log("uploaded"); 
            var data = JSON.parse(resp);  
            var file = {id: data.id, value: data.title, type: data.mimeType.split("/")[0], size: data.fileSize, date: new Date(data.modifiedDate) }; 
            for(var i=0; i< parents.length;i++) {   
              var parentFolder = This.getFileD(parents[i].id);  
              if ( parentFolder ) parentFolder.data.push(file);
              else This.filesInfo.push(file);
            }
            webix.bind(function(){ That._file_complete(id); }, That);
            gAccount.saveFilesInfo();
          }
      });
      uploader.upload();
    },

    updateFile: function(fileId, type, text, callback) {
        generisBusy = true;
        setCursorByID("body", "wait");

        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var contentType = type;
        var metadata = {'mimeType': contentType,};

        var multipartRequestBody =
            delimiter +  'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter + 'Content-Type: ' + contentType + '\r\n' + '\r\n' +
            text +
            close_delim;

        if (!callback) { callback = function(file) { console.log("Update Complete ",file) }; }

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + fileId,
            'method': 'PUT',
            'params': {'uploadType': 'multipart', 'alt': 'json'},
            'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
            'body': multipartRequestBody,
        });
        var callback1;
        if (callback) {
          callback1 = function(file) {
            generisBusy = false;
            setCursorByID("body", "default");
            callback(file);
          };
        }
        request.execute(callback1);
      },
	
	filesInfoUpdate: function(callback) {
		var x = this;
		var f = function(arrS) {
                x.filesInfo = JSON.parse(arrS)||[]; 
                if(callback == x.generisAccount) x.generisAccount(NewGame); 
                  else if(callback) callback(arrS);
            }; //x.retrieveAllFilesInFolder
		x.getFilesContent("title", "filesInfo", f);  
	},

    saveFilesInfo: function(callback) { 
        if(game) game.saveWindows();
  		var xx = JSON.stringify( this.filesInfo );
  		var aa = this;  
  		// var callback2 = function() { gAccount.createFile( Base64.encode( xx ), "filesInfo", "text/html", [{"id": aa.getFileId("System", ["Generis Account", "Profile" ])}] , callback); }
  		var f = function(file ){
  			if(file && file.items && file.items.length > 0) aa.updateFile(file.items[0].id, "text/html", xx,  callback);
        //else callback2();
  		}
  		aa.getFileByTitle("filesInfo", f, "text/html");   
    },
    
    saveFiles: function(title, type, parents, data, callback) { 
      generisBusy = true;
      setCursorByID("body", "wait");
  	  saveFP =  $('#saveFP').bPopup(fontsize); 
      if(!callback) callback = function() {};

  		//var xx = JSON.stringify( data );
  		var aa = this;   
      var f2 = function(){ 
        generisBusy = false; setCursorByID("body", "default"); try { saveFP.close(); } catch(e) {}
        aa.saveFilesInfo(callback);
      } 

  		var callback2 = function() { gAccount.createFile( Base64.encode( data ), title, type, parents , f2); }
  		
  		var f = function(file ){
  		  console.log(file);
  			if(file && file.items && file.items.length > 0) aa.updateFile(file.items[0].id, type, data, f2);
  			else callback2();
  		}
  		aa.getFileByTitle(title, f, type);  
		 
    },

	deleteFile : function (fileId, callback) {
    var This = this;
    if (!fileId) return;
	  var request = gapi.client.drive.files.delete({
		'fileId': fileId
	  });
	  request.execute(function(resp) { 
      This.deleteFileD(fileId);  
      callback(resp);
    });
	},
	
	renameFile : function (fileId, newName, callback) {
      var body = {'title': newName};
      var This = this;
      var request = gapi.client.drive.files.patch({
        'fileId': fileId,
        'resource': body
      });
      request.execute(function(resp) { 
        var file = This.getFileD(fileId);
        file.value = newName;  
        callback(resp);
      });
  },

  copyFile : function(originFileId, parents, callback) {
        var This = this;
        var body = { 'parents': parents};
        var request = gapi.client.drive.files.copy({
          'fileId': originFileId,
          'resource': body
        });

        request.execute(function(resp) {

          var originFile = This.getFileD(originFileId); 
          if (originFile.type == "folder") var file = {id: resp.id, value: resp.title, type: "folder", date: new Date(resp.modifiedDate), data: JSON.parse(JSON.stringify(originFile.data)) };
          else var file = {id: resp.id, value: resp.title, type: originFile.type, size: resp.fileSize, date: new Date(resp.modifiedDate) }; 
          for(var i=0; i< parents.length;i++) {   
            var parentFolder = This.getFileD(parents[i].id);  
            if ( parentFolder ) parentFolder.data.push(file);
            else This.filesInfo.push(file);
          }

          callback(resp);
        });
  },

  moveFile : function(fileId, parents, callback) {
      
      var This = this;
      var request = gapi.client.drive.files.patch({
        'fileId': fileId,
        'resource': { 'parents': parents}
      });
      request.execute(function(resp) {
         
        var originFile = This.getFileD(fileId);
        if (originFile.type == "folder") var file = {id: resp.id, value: resp.title, type: "folder", date: new Date(resp.modifiedDate), data: JSON.parse(JSON.stringify(originFile.data)) };
        else var file = {id: resp.id, value: resp.title, type: resp.type, size: resp.fileSize, date: new Date(resp.modifiedDate) }; 

         originFile.id = "moved";
          for(var i=0; i< parents.length;i++) {   
            var parentFolder = This.getFileD(parents[i].id);  
            if ( parentFolder ) parentFolder.data.push(file);
            else This.filesInfo.push(file);
          }
          This.deleteFileD("moved");  
        callback(resp);
      });
  },


  
	
	getFileByTitle : function (title, callback, type) {
		var x = this;   
	  
        var retrievePageOfFiles = function(request ) {
            request.execute(function(resp) {  
               if (callback) callback(resp);
            });
          }
          var initialRequest;
          if(type) { 
             initialRequest = gapi.client.request({
                  'path': 'drive/v2/files',
                  'method': 'GET',
                  'params': {
                   'maxResults': '10',
                   'q':"mimeType = '" + type + "' and title contains '" + title + "'"
                  }
             });
         } else { 
            initialRequest = gapi.client.request({
                  'path': 'drive/v2/files',
                  'method': 'GET',
                  'params': {
                   'maxResults': '10',
                   'q':"mimeType = 'text/html' and title contains '" + title + "'"
                  }
             });
         } 
          retrievePageOfFiles(initialRequest );
   
	}, 
	
	getFilesContent : function (type, idTitle, callback) {
      try {
    		if ( type == "title") { 
    			var x = this;
    			var f = function(file ){ 
    				x.downloadFile(file.items[0], callback);
    			}
    		   this.getFileByTitle(idTitle, f );
    		} else {
    			var x = this;
    			var f = function(file ){
    				x.downloadFile(file , callback);
    			}
    		   this.getFileMData(idTitle, f);
    		}
      } catch(e) { 
         generisBusy = false;   
         setCursorByID("body", "default");  
         $('#logError').bPopup(fontsize); 
      }
    }, 
	
	downloadFile : function (file, callback) {
    try { 
  	  if (file && file.downloadUrl) {
  		var accessToken = gapi.auth.getToken().access_token;
      var xhr = new XMLHttpRequest();
      console.log(file.downloadUrl.replace('content.google','www.google'))
  		xhr.open('GET', file.downloadUrl.replace('content.google','www.google')); // .replace because of a new bug since 2020
  		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  		xhr.onload = function() {
  		  if (callback) callback(xhr.responseText);
  		  else console.log(xhr.responseText);
  		};
  		xhr.onerror = function() {
  		  if (callback) callback(null);
  		  else console.log(null);
  		};
  		xhr.send();
  	  } else {
  		if (callback) callback(null);
  		else console.log(null);
  	  }
    } catch(e) { 
       generisBusy = false;   
       setCursorByID("body", "default");  
       $('#logError').bPopup(fontsize); 
    }
	},

     generisAccount: function(callback) {
        var x = this;   
		    x.filesInfo.push({});
        
    		var createGfolder3 = function(){   
    			document.getElementById("createdFile").innerHTML = " creating Scene 1 page ";

          x.filesInfo[0].theme = "moonB";
          x.filesInfo[0].Background = "data/images/generisWall1.jpg";

    			var xx = JSON.stringify( x.filesInfo );
    			console.log(xx); 
    			
    			gAccount.createFile( Base64.encode( xx ), "filesInfo", "text/HTML", [{"id": x.getFileId("System", ["Generis Account", "Profile" ])}] , callback);
    		}

        var publishTuts = function(resp){
          gAccount.publish(resp.id, createGfolder3); 
          x.filesInfo[0].tutorials = "https://drive.google.com/uc?id=" + resp.id; 
        };
        var publishAssets = function(resp){
          gAccount.publish(resp.id, createGfolder23); 
          x.filesInfo[0].assets = "https://drive.google.com/uc?id=" + resp.id; //"https://googledrive.com/host/" + resp.id; 
        };
		    
        var createGfolder23 = function(){ 
          x.createFolder("Tutorials", [{"id": x.getFileId("Profile", ["Generis Account" ])}] , publishTuts);
        }

        var createGfolder22 = function(){ 
          x.createFolder("Assets", [{"id": x.getFileId("Profile", ["Generis Account" ])}] , publishAssets );
        } 
		    var createGfolder2 = function(){ 
          x.createFolder("System", [{"id": x.getFileId("Profile", ["Generis Account" ])}] , createGfolder22);
        }

        var createGfolder1 = function(){ 
          x.createFolder("Profile", [{"id": x.getFileId("Generis Account", [ ])}], createGfolder2);
        }

        var createGfolder0 = function(){
          x.createFolder("Games", [{"id": x.getFileId("Generis Account", [ ])}], createGfolder1);
        }

        var retrievePageOfFiles = function(request, result) {
          request.execute(function(resp) {
            var result = resp.items;

             if (result.length <= 0) {  
                createChilds = function (result) { 
                    createGfolder0();
                }; 

                x.createFolder("Generis Account", [{"id": "root"}], createChilds); 
             } else {
              if(gAccount.filesInfo[0] && gAccount.filesInfo[0].theme) document.getElementById("body").className=gAccount.filesInfo[0].theme + " bg"; 
              if(gAccount.filesInfo[0] && gAccount.filesInfo[0].Background ) $('#workSpace').css('background-image', 'url(' + gAccount.filesInfo[0].Background + ')');
			   
                  generisBusy = false;
                  setCursorByID("body", "default");

                if ( callback == x.retrieveAllFilesInFolder) x.retrieveAllFilesInFolder(x.getFileId("Generis Account", [ ]), NewGame);
                else if(callback) callback();   
             }
          });
        }
        var initialRequest = gapi.client.request({
            'path': 'drive/v2/files',
            'method': 'GET',
            'params': {
             'maxResults': '20',
             'q':"mimeType = 'application/vnd.google-apps.folder' and title contains '" + "Generis Account" + "'"
            }
       });
        retrievePageOfFiles(initialRequest, []);


        generisGetFiles = function (id) {
            x.retrieveAllFilesInFolder( id, function ( ) { console.log(x.generisAccFiles)})
        }; 
    }, 

     retrieveAllFiles: function(callback) {
          /*
          var x = this;

          var retrievePageOfFiles = function(request, result) {
            request.execute(function(resp) {
              result = result.concat(resp.items);
              
                 for ( var i=0; i< result.length; i++) {
                    x.gdriveAccFiles[result[i].title] = result[i]; 
                    // console.log(result[i] );
                 }

                 if ( callback == x.generisAccount)  x.generisAccount(x.retrieveAllFilesInFolder); 
                 else callback();  
            });
          }
          var initialRequest = gapi.client.drive.files.list();
          retrievePageOfFiles(initialRequest, []);
          */
    }, 

    listFilesInFolder: function(folderId, callback) {
      var retrievePageOfChildren = function(request, result) {
        request.execute(function(resp) { 
          result = result.concat(resp.items);
          var nextPageToken = resp.nextPageToken;
          if (nextPageToken) {
            request = gapi.client.drive.children.list({
              'folderId' : folderId,
              'pageToken': nextPageToken
            });
            retrievePageOfChildren(request, result);
          } else {
            callback(result);
          }
        });
      }
      var initialRequest = gapi.client.drive.children.list({
          'folderId' : folderId
        });
      retrievePageOfChildren(initialRequest, []);
    },

    retrieveAllFilesInFolder: function(folderId, callback) {
       
      callback();
      
      /*
      x = this; 
      x.d = 0;

      var nextfuncts = [];
      var tmp = [];

      var populate = function(resp, a, callbackb){

        var ss = resp.title;
        for(var ii=0;ii<x.d;ii++) ss = "| " + ss;
        console.log(ss + " " +resp.mimeType);

        var Rrequest = gapi.client.drive.children.list({
                'folderId' : a[0][a[1]].id
              });
        //console.log(a[2]); 
        //console.log(tmp.length); 
         if( nextfuncts.length > 0 ) { 
           tmp.push(Rrequest);
           var f = nextfuncts.shift();
           f[0](f[1]); 
        }  
        else retrievePageOfChildren( Rrequest ); 

        //x.generisAccFiles.push( {id: resp.id, value: resp.title, open: true,  type: "folder", date:  resp.modifiedDate, data:[]} );
      }

      var getNext = function( result, getNext, j , callback){
          
          x.getFileData(result[j].id, populate, [ result, getNext, j]); 
          
      }

      //x.getFileData(folderId, populate);

      //console.log(folderId);
 
      var retrievePageOfChildren = function(request ) {
        request.execute(function(resp) {
          result = resp.items ;
        // console.log(resp)
		
		callback();

          if ( false && result && result.length > 0) { 
             //console.log(result  );
              
              //for (j = 0; j < result.length; j++) 
              //  getNext( result, getNext, j); 
              
              for (j = 0; j < result.length; j++) { 
                nextfuncts.push( [function(i) { x.getFileData(i) }, [result, j, populate] ] ); 
              } 

               x.d += 1;

              var f = nextfuncts.pop();
              f[0](f[1]);
              




   
          } 
           else if( tmp.length > 0 ) { x.d -= 1; retrievePageOfChildren( tmp.pop()); }
          else {
              //callback();
              ///* 
              if( nextfuncts.length > 0 ) {
                 var f = nextfuncts.shift();
                 f[0](f[1]);
              }  
              else callback();
             // * /
            }
 
        });
      }
      var Request = gapi.client.drive.children.list({
          'folderId' : folderId
        });
      retrievePageOfChildren( Request );

      */
    },

    getFileData: function(a, callbackb ) {
 
      var request = gapi.client.drive.files.get({
        'fileId': a[0][a[1]].id
      });
      request.execute(function(resp) {  
        a[2](resp, [a[0], a[1]], callbackb); 
      });
    },
	
	getFileMData: function(id, callback ) { 
      var request = gapi.client.drive.files.get({
        'fileId': id
      });
      request.execute(callback);
    },

     getFolders: function(folderName) {
        var x = this;

         var request = gapi.client.request({
              'path': 'drive/v2/files',
              'method': 'GET',
              'params': {
               'maxResults': '20',
               'q':"mimeType = 'application/vnd.google-apps.folder' and title contains '" + folderName + "'"
              }
         });

         request.execute(x.listItems);
    },

     listItems: function(resp) {
         var result = resp.items;
         var i = 0;
         for (i = 0; i < result.length; i++) {
             console.log(result[i].title);
         }


    },

     createFolder: function(folderName, parents, callback) {
        
        generisBusy = true;
	    setCursorByID("body", "wait");
	     
        var x = this; 

        var body = {
          'title': folderName,
          "parents": parents ,
          'mimeType': "application/vnd.google-apps.folder"
        };

        var request = gapi.client.drive.files.insert({
          'resource': body
        });

        request.execute(function (result) { 
            try { 
        			// if (folderName == "ffff") console.log("yep");
        			var folder = {id: result.id, value: result.title, type: "folder", date: new Date(result.modifiedDate), data : [] };
        			for(var i=0; i< parents.length;i++) {   
        				var parentFolder = x.getFileD(parents[i].id);  
        				if ( parentFolder ) parentFolder.data.push(folder);
        				else x.filesInfo.push(folder);
        			}
    			 
    	        generisBusy = false;
    	        setCursorByID("body", "default");
    	        
              if ( callback == x.retrieveAllFilesInFolder)  x.retrieveAllFilesInFolder("root", NewGame);
              else if(callback) callback(result);  
            } catch(e) {
               if(newGStatusPopup) newGStatusPopup.close(); 
               generisBusy = false;   
               setCursorByID("body", "default");  
               $('#logError').bPopup(fontsize);
            }  
        });
    },

     printout: function(result) {
        //console.log(result);
    },

     onIdFind: function(title, callback) { 
        
        var request = gapi.client.drive.children.list({
            'folderId': "root"
          });

        request.execute( function(resp) { 
                    var files = resp.items;
                    if (files && files.length > 0) {
                      for (var i = 0; i < files.length; i++) {
                          var request = gapi.client.drive.files.get({
                            'fileId': files[i].id
                          });

                          request.execute(function(resp) { 
                                if ( resp.title == title ) callback(resp.id); 
                          }); 
                      }
                    } 
              });  
    },  

    insertFile: function (fileData, callback, parents) {
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var reader = new FileReader();
      reader.readAsBinaryString(fileData);
      reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
          'title': fileData.fileName,
          'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
          callback = function(file) {
            console.log(file)
          };
        }
        request.execute(callback);
      }
    },


    createFile: function (fileData, title, type, parents, callback ) {
	  
	  generisBusy = true;
      setCursorByID("body", "wait"); 
        
	  var x = this;
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";
 
        var contentType = type || 'application/octet-stream';
        var metadata = {
          'title': title,
          'mimeType': contentType,
          'parents' : parents
        };

        var base64Data = fileData;
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
          callback = function(file) {
            console.log(file)
          };
        } else if ( callback == x.retrieveAllFilesInFolder) callback = function(file) {
				x.retrieveAllFilesInFolder(x.getFileId("Generis Account", [ ]), NewGame); 
          };   
        request.execute(function(resp){
			
			var file = {id: resp.id, value: resp.title, type: type, size: resp.fileSize, date: new Date(resp.modifiedDate) };
			for(var i=0; i< parents.length;i++) {  
        var parentFolder = x.getFileD(parents[i].id); 
         
				var dd = parentFolder.data.length;  
				if ( parentFolder ) {  
					for(var i=0; i< parentFolder.data.length;i++) {  
						if(parentFolder.data[i].value == resp.title && parentFolder.data[i].type == type) { parentFolder.data.splice(i, 1); break; }
					}
					parentFolder.data.push(file);
				}
				else {   
					for(var i=0; i< parentFolder.data.length;i++) {  
						if(parentFolder.data[i].value == resp.title && parentFolder.data[i].type == type) { parentFolder.data.splice(i, 1); break; }
					}
					x.filesInfo.push(file);
				}
			} 
	        generisBusy = false;
	        setCursorByID("body", "default");
	        
			callback(resp);
		});
       
    },
	
	 getFileD : function( ID ) {
		x = this;
		
		function getFD(id, files){
			var data = null;
			for(var i=0; i< files.length;i++) {
				 if( files[ i ].id == id) { return files[ i ]; }
				 else if(files[ i ].data && files[ i ].data.length > 0) {
					if (!data) data = getFD(id, files[ i ].data); 
				 }
			}
			return data;
		}
		 
		return getFD(ID, x.filesInfo);
	},

  deleteFileD : function( ID ) {
    x = this;
    
    function getFD(id, files){
      var data = null;
      for(var i=0; i< files.length;i++) {
         if( files[ i ].id == id) { files.splice(i, 1); return; }
         else if(files[ i ].data && files[ i ].data.length > 0) {
          if (!data) getFD(id, files[ i ].data); 
         }
      }
    }
     
    getFD(ID, x.filesInfo);
  },
	
	getFileId : function( Title, Parents ) {
		x = this;
		
		function getFID(title, p, files){
			var parents = [];
			for(var i=0; i< p.length;i++) parents.push(p[i]);
			
			var data = null;
			// if( title == "ffff") console.log(parents);
			for(var i=0; i< files.length;i++) { 
				 if( parents.indexOf( files[ i ].value ) != -1 && files[ i ].type == "folder") {
					var index = parents.indexOf(files[ i ].value);
					parents.splice(index, 1); 
					 // console.log(parents);
					
					data = getFID(title, parents, files[ i ].data); 
				 } else if( files[ i ].value == title && parents.length == 0) { 
					if( files[ i ].value == "ffff") console.log(parents);
					return files[ i ].id;
				}
			} 
			return data;
		}
 
		return getFID(Title, Parents, x.filesInfo);
	},

     createAccount: function() { 
        
          
    },



}); 
