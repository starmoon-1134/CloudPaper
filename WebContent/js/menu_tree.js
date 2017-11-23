function LiSort(id) {
  var select = "#" + id + " > li";
  var lis = $(select);
  lis.sort(function(a, b) {
    var text_a = $(a).find("span:first").html();
    var text_b = $(b).find("span:first").html();
    return text_a < text_b ? -1 : 1;
  });
  $("#" + id).empty();
  for (var i = 0; i < lis.length; i++) {
    $("#" + id).append(lis[i]);
  }
  for (var i = 0; i < lis.length; i++) {
    LiSort($($(lis[i]).find("ul:first")).attr("id"));
    LiSort($($(lis[i]).find("ul:last")).attr("id"));
  }
}

function AddRootFolder() {
  var input = document.createElement("input");
  $("#addrootfolder").prepend(input);
  $(input).keydown(function(e) {
    if (e.keyCode == 13) {
      var RootFolderName = $(input).val();
      $.ajax({
        url : "menutree_addRootFolder",
        data : {
          "userName" : userInfo.userName,
          "rootFolderName" : RootFolderName
        },
        dataType : 'json',
        type : 'post',
        async : false,
        success : function(data) {
          if (data.indexOf("checkFailed") >= 0) {
            window.location.href = "/CloudPaper";
            return;
          }
          if (data == "complete") {
            InitUserTree();
            $(input).remove();
          } else {
            alert(data);
          }
        },
        error : function() {
          alert("addrootfolder error");
        }
      });
    }
  })
}

function InitUserTree() {
  if (userInfo.userName == "null") {
    window.location.href = "/CloudPaper";
    return;
  }
  $
    .ajax({
      url : "menutree_initUserTree",
      data : {
        "userName" : userInfo.userName
      },
      dataType : 'json',
      type : 'post',
      async : false,
      success : function(data) {
        if (data.indexOf("checkFailed") >= 0) {
          window.location.href = "/CloudPaper";
          return;
        }
        var d = eval("(" + data + ")");
        var root = document.createElement("ul");
        $(root).attr("id", "user_root");
        var container = new Object();
        var pathes = d["pathes"];
        $
          .each(
                pathes,
                function(i, record) {
                  var path = record["path"];
                  var nodes = path.split('>');
                  var last_node = (nodes[nodes.length - 1].split('*'))[0];
                  var pdf_or_url = (nodes[nodes.length - 1]
                    .split('*'))[1];
                  nodes[nodes.length - 1] = last_node;
                  var pre_node_name = "";
                  var cur_node_name = "";
                  for (var j = 0; j < nodes.length; j++) {
                    if (j == 0) {
                      cur_node_name = nodes[j];
                    } else {
                      cur_node_name = pre_node_name + ">" + nodes[j];
                    }
                    if (container[cur_node_name + "folders"] == undefined
                        && j == 0) {
                      var li = document.createElement("li");
                      var span = document.createElement("span");
                      var text = document.createTextNode(nodes[j]);
                      container[cur_node_name + "folders"] = document
                        .createElement("ul");
                      container[cur_node_name + "files"] = document
                        .createElement("ul");
                      $(container[cur_node_name + "folders"])
                        .attr("id", cur_node_name + "folders");
                      $(container[cur_node_name + "files"])
                        .attr("id", cur_node_name + "files");
                      span.appendChild(text);
                      $(span).attr("class", "folder");
                      $(span).attr("id", "usertree_folder");
                      li.appendChild(span);
                      $(li).attr("class", "closed");
                      li.appendChild(container[cur_node_name
                                               + "folders"]);
                      li.appendChild(container[cur_node_name
                                               + "files"]);
                      $(root).prepend(li);
                      pre_node_name = cur_node_name;
                    } else if (container[cur_node_name + "folders"] == undefined) {
                      var li = document.createElement("li");
                      var span = document.createElement("span");
                      var text = document.createTextNode(nodes[j]);
                      container[cur_node_name + "folders"] = document
                        .createElement("ul");
                      container[cur_node_name + "files"] = document
                        .createElement("ul");
                      $(container[cur_node_name + "folders"])
                        .attr("id", cur_node_name + "folders");
                      $(container[cur_node_name + "files"])
                        .attr("id", cur_node_name + "files");
                      span.appendChild(text);
                      $(span).attr("class", "folder");
                      $(span).attr("id", "usertree_folder");
                      li.appendChild(span);
                      $(li).attr("class", "closed");
                      li.appendChild(container[cur_node_name
                                               + "folders"]);
                      li.appendChild(container[cur_node_name
                                               + "files"]);
                      $(container[pre_node_name + "folders"])
                        .prepend(li);
                      pre_node_name = cur_node_name;
                    } else {
                      pre_node_name = cur_node_name;
                    }
                  }
                  if (pdf_or_url != undefined) {
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    var text = document.createTextNode(pdf_or_url);
                    span.appendChild(text);
                    $(span).attr("class", "file");
                    $(span).attr("id", "usertree_file");
                    li.appendChild(span);
                    container[pre_node_name + "files"]
                      .appendChild(li);
                  }
                })
        $("#user_tree").empty();
        $(root).appendTo("#user_tree");
        LiSort("user_root");
        $.cookie('usertreeState');
        $("#user_tree").treeview({
          persist : "cookie",
          cookieId : "usertreeState",
          cookieOptions : {
            path : '/'
          },
          collapsed : "true",
          add : root
        });
        $("span#usertree_folder")
          .contextMenu(
                       'folderMenu',
                       {
                         bindings : {
                           'addFolder' : function(t) {
                             AddFolder(t);
                           },
                           'deleteFolder' : function(t) {
                             DeleteFolder($($(t).next()).attr("id"));
                           },
                           'renameFolder' : function(t) {
                             RenameFolder(t);
                           },
                           'uploadFile' : function(t) {
                             $("#overlay").empty();
                             var upload_div = document
                               .createElement("div");
                             $(upload_div).attr("id", "upload");
                             $(upload_div).appendTo("#overlay");
                             var post_params = {
                               folder : $($(t).next()).attr("id"),
                               username : userInfo.userName
                             };
                             var upload_property = {
                               width : 300,
                               height : 300,
                               multiple : true,
                               file_types : "*.pdf",
                               // file_types_description:
                               // "Web
                               // Image Files",
                               post_params : post_params,
                               btn_add_text : "添加",
                               btn_up_text : "上传",
                               btn_cancel_text : "放弃",
                               btn_clean_text : "清空",
                               op_del_text : "单项删除",
                               op_up_text : "单项上传",
                               op_fail_text : "上传失败",
                               op_ok_text : "上传成功",
                               op_no_text : "取消上传",
                               upload_url : "upload",
                               flash_url : "/CloudPaper/swfupload.swf"
                             };
                             var create_ret = $
                               .createGooUploader($("#upload"),
                                                  upload_property);

                             var back_input = document
                               .createElement("input");
                             $(back_input).attr("type", "button");
                             $(back_input).attr("value", "返回");
                             $(back_input)
                               .click(
                                      function() {
                                        document
                                          .getElementById('overlay').style.display = 'none';
                                        InitSystemTree();
                                        InitUserTree();
                                      })
                             $(back_input).appendTo("#overlay");
                             document.getElementById('overlay').style.display = 'block';
                           }
                         }
                       });

        $("span#usertree_file").contextMenu('fileMenu', {
          bindings : {
            'deleteFile' : function(t) {
              DeleteFile(t);
            },
            'renameFile' : function(t) {
              RenameFile(t)
            },
            'intensiveRead' : function(t) {
              ChangeFileState(t, "intensive");
            },
            'roughRead' : function(t) {
              ChangeFileState(t, "rough");
            },
            'unRead' : function(t) {
              ChangeFileState(t, "un");
            },
            'exportNote' : function(t) {
              exportNote(t);
            }
          }
        });
        $("span#usertree_file")
          .dblclick(
                    function() {
                      var isInReadMode = $(".pdfFrame").contents()
                        .find("#saveNote").attr("disabled");

                      if (isInReadMode) {
                        userInfo.currentFile = this.innerText;
                        $(".pdfFrame").attr(
                                            "src",
                                            "../pdfjs/web/viewer.html?file=../../userFiles/"
                                              + userInfo.userName
                                              + "/pdf/"
                                              + this.innerText);
                      } else {
                        alert("请先退出编辑笔记模式");
                      }
                    });
      },
      error : function() {
        alert("menutree_initUserTree");
      }
    });
}

function InitSystemTree() {
  $
    .ajax({
      url : "menutree_initSystemTree",
      data : {
        "userName" : userInfo.userName
      },
      dataType : 'json',
      type : 'post',
      async : false,
      success : function(data) {
        if (data.indexOf("checkFailed") >= 0) {
          window.location.href = "/CloudPaper";
          return;
        }
        var d = eval("(" + data + ")");
        var root = document.createElement("ul");
        $(root).attr("id", "system_root");
        var container = new Object();
        var pathes = d["pathes"];
        $
          .each(
                pathes,
                function(i, record) {
                  var path = record["path"];
                  var nodes = path.split('>');
                  var last_node = (nodes[nodes.length - 1].split('*'))[0];
                  var pdf_or_url = (nodes[nodes.length - 1]
                    .split('*'))[1];
                  nodes[nodes.length - 1] = last_node;
                  var pre_node_name = "";
                  var cur_node_name = "";
                  for (var j = 0; j < nodes.length; j++) {
                    if (j == 0) {
                      cur_node_name = nodes[j];
                    } else {
                      cur_node_name = pre_node_name + ">" + nodes[j];
                    }
                    if (container[cur_node_name + "folders"] == undefined
                        && j == 0) {
                      var li = document.createElement("li");
                      var span = document.createElement("span");
                      var text = document.createTextNode(nodes[j]);
                      container[cur_node_name + "folders"] = document
                        .createElement("ul");
                      container[cur_node_name + "files"] = document
                        .createElement("ul");
                      $(container[cur_node_name + "folders"])
                        .attr("id", cur_node_name + "folders");
                      $(container[cur_node_name + "files"])
                        .attr("id", cur_node_name + "files");
                      span.appendChild(text);
                      $(span).attr("class", "folder");
                      $(span).attr("id", "systemtree_folder");
                      li.appendChild(span);
                      $(li).attr("class", "closed");
                      li.appendChild(container[cur_node_name
                                               + "folders"]);
                      li.appendChild(container[cur_node_name
                                               + "files"]);
                      $(root).prepend(li);
                      pre_node_name = cur_node_name;
                    } else if (container[cur_node_name + "folders"] == undefined) {
                      var li = document.createElement("li");
                      var span = document.createElement("span");
                      var text = document.createTextNode(nodes[j]);
                      container[cur_node_name + "folders"] = document
                        .createElement("ul");
                      container[cur_node_name + "files"] = document
                        .createElement("ul");
                      $(container[cur_node_name + "folders"])
                        .attr("id", cur_node_name + "folders");
                      $(container[cur_node_name + "files"])
                        .attr("id", cur_node_name + "files");
                      span.appendChild(text);
                      $(span).attr("class", "folder");
                      $(span).attr("id", "systemtree_folder");
                      li.appendChild(span);
                      $(li).attr("class", "closed");
                      li.appendChild(container[cur_node_name
                                               + "folders"]);
                      li.appendChild(container[cur_node_name
                                               + "files"]);
                      $(container[pre_node_name + "folders"])
                        .prepend(li);
                      pre_node_name = cur_node_name;
                    } else {
                      pre_node_name = cur_node_name;
                    }
                  }
                  if (pdf_or_url != undefined) {
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    var text = document.createTextNode(pdf_or_url);
                    span.appendChild(text);
                    $(span).attr("class", "file");
                    $(span).attr("id", "systemtree_file");
                    li.appendChild(span);
                    container[pre_node_name + "files"]
                      .appendChild(li);
                  }
                })
        $("#system_tree").empty();
        $(root).appendTo("#system_tree");
        LiSort("system_root");
        $.cookie('systemtreeState');
        $("#system_tree").treeview({
          persist : "cookie",
          cookieId : "systemtreeState",
          cookieOptions : {
            path : '/'
          },
          collapsed : "true",
          add : root
        });
        $("span#systemtree_file")
          .dblclick(
                    function() {
                      var isInReadMode = $(".pdfFrame").contents()
                        .find("#saveNote").attr("disabled");

                      if (isInReadMode) {
                        userInfo.currentFile = this.innerText;
                        $(".pdfFrame").attr(
                                            "src",
                                            "../pdfjs/web/viewer.html?file=../../userFiles/"
                                              + userInfo.userName
                                              + "/pdf/"
                                              + this.innerText);
                      } else {
                        alert("请先退出编辑笔记模式");
                      }
                    });
      },
      error : function() {
        alert("error");
      }
    });
}

function AddFolder(t) {
  // $($(t).next()).slideToggle(500);
  var input = document.createElement("input");
  $($(t).next()).prepend(input);
  $(input).keydown(function(e) {
    if (e.keyCode == 13) {
      var addFolderName = $(input).val();
      $.ajax({
        url : "menutree_addFolder",
        data : {
          "userName" : userInfo.userName,
          "addFolderName" : addFolderName,
          "addParentName" : $($(t).next()).attr("id")
        },
        dataType : 'json',
        type : 'post',
        async : false,
        success : function(data) {
          if (data.indexOf("checkFailed") >= 0) {
            window.location.href = "/CloudPaper";
            return;
          }
          if (data == "complete") {
            InitUserTree();
          } else if (data == "exist") {
            alert("exist");
          }
        },
        error : function() {
          alert("error");
        }
      });
    }
  })
}

function DeleteFolder(deleteFolderName) {
  $.ajax({
    url : "menutree_deleteFolder",
    data : {
      "userName" : userInfo.userName,
      "deleteFolderName" : deleteFolderName
    },
    dataType : 'json',
    type : 'post',
    async : false,
    success : function(data) {
      if (data.indexOf("checkFailed") >= 0) {
        window.location.href = "/CloudPaper";
        return;
      }
      InitSystemTree();
      InitUserTree();
    },
    error : function() {
      alert("error");
    }
  });
}

function RenameFolder(t) {
  // $($(t).next()).slideToggle(500);
  var input = document.createElement("input");
  $($(t).next()).prepend(input);
  $(input).keydown(function(e) {
    if (e.keyCode == 13) {
      var renameNewFolderName = $(input).val();
      $.ajax({
        url : "menutree_renameFolder",
        data : {
          "userName" : userInfo.userName,
          "renameNewFolderName" : renameNewFolderName,
          "renameOldFolderName" : $($(t).next()).attr("id")
        },
        dataType : 'json',
        type : 'post',
        async : false,
        success : function(data) {
          if (data.indexOf("checkFailed") >= 0) {
            window.location.href = "/CloudPaper";
            return;
          }
          if (data == "complete") {
            InitUserTree();
          } else if (data == "exist") {
            alert("exist");
          }
        },
        error : function() {
          alert("error");
        }
      });
    }
  })
}

function DeleteFile(t) {
  // alert($($($(t).parent()).parent()).attr("id"));
  // alert($(t).text());
  $.ajax({
    url : "menutree_deleteFile",
    data : {
      "userName" : userInfo.userName,
      "deleteFileName" : $(t).text(),
      "deleteFilePath" : $($($(t).parent()).parent()).attr("id")
    },
    dataType : 'json',
    type : 'post',
    async : false,
    success : function(data) {
      if (data.indexOf("checkFailed") >= 0) {
        window.location.href = "/CloudPaper";
        return;
      }
      InitSystemTree();
      InitUserTree();
    },
    error : function() {
      alert("error");
    }
  });
}

function RenameFile(t) {
  var input = document.createElement("input");
  $($(t).parent()).append(input);
  $(input).keydown(
                   function(e) {
                     if (e.keyCode == 13) {
                       var renameNewFileName = $(input).val();
                       var index = $(t).text().lastIndexOf(".");
                       var renameOldFileName = $(t).text()
                         .substr(0, index);
                       if (renameOldFileName != renameNewFileName) {
                         $.ajax({
                           url : "menutree_renameFile",
                           data : {
                             "userName" : userInfo.userName,
                             "renameNewFileName" : renameNewFileName,
                             "renameOldFileName" : $(t).text(),
                             "renameFilePath" : $(
                                                  $($(t).parent())
                                                    .parent())
                               .attr("id")
                           },
                           dataType : 'json',
                           type : 'post',
                           async : false,
                           success : function(data) {
                             if (data.indexOf("checkFailed") >= 0) {
                               window.location.href = "/CloudPaper";
                               return;
                             }
                             if (data == "complete") {
                               InitSystemTree();
                               InitUserTree();
                             } else if (data == "exist") {
                               alert("exist");
                             }
                           },
                           error : function() {
                             alert("error");
                           }
                         });
                       }
                     }
                   })
}

function ChangeFileState(t, newFileState) {
  // alert(newFileState);
  $.ajax({
    url : "menutree_changeFileState",
    data : {
      "userName" : userInfo.userName,
      "fileName" : $(t).text(),
      "newFileState" : newFileState
    },
    dataType : 'json',
    type : 'post',
    async : false,
    success : function(data) {
      if (data.indexOf("checkFailed") >= 0) {
        window.location.href = "/CloudPaper";
        return;
      }
      InitSystemTree();
    },
    error : function() {
      alert("error");
    }
  });
}

function exportNote(t) {
  var url = "/CloudPaper/userFiles/" + userInfo.userName + "/"
            + "pdf/" + $(t).text();

  PDFJS.getDocument(url).then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    // Initial/first page rendering
    count = pdfDoc.numPages;
    renderPage(pageNum);
    });

  pageNum = 1;
}



function renderPage(num) {
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
// alert("h:"+viewport.height+"\nw:"+viewport.width);
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext : ctx,
        viewport : viewport
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function() {
          pageNum++;
// var image = new Image();
          var image = $("#testIMG").attr("src",canvas.toDataURL("image/jpge"))
// image.src = canvas.toDataURL("image/png");
//          var tmp= JSON.stringify(image.attr("src"));
//          console.log(tmp.length);
          console.log('Canvas' + (pageNum-1) + '绘制完成');
          setTimeout(function() {
          if(pageNum<=count){
            renderPage(pageNum);
          }
        }, 2000);
      }); 
    });

}
function char2buf(str){
  var out = new ArrayBuffer(str.length);
  var u16a= new Uint8Array(out);
  var strs = str.split("");
  for(var i =0 ; i<strs.length;i++){
      u16a[i]=strs[i].charCodeAt();
  }
  return u16a;
}
function createDownload(fileName, content){
  var buff = char2buf(content);
  var blob = new Blob(buff);
  var link = document.createElement("a");
  link.innerHTML = fileName;
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  document.getElementById("system_tree").appendChild(link);
}

$(document).ready(function() {
  InitSystemTree();
  InitUserTree();
// $("#Testscript").text("function testjj(){alert('sjfdi');}");
// testjj();

  $.ajax({
    async : true,
    cache : false,
    timeout: 3000,
    url : "getExportFile", 
    type: "post",
    data: {"fileName" : "readme.pdf"},
    success: function(resultString){
     
//      createDownload("download.pdf",resultString);
////       console.log(resultString);
//      var blob = new Blob([resultString]);
//      var url=URL.createObjectURL(blob);
//      console.log(url);
//      alert(url);
      var url = char2buf(resultString);
      PDFJS.getDocument(url).then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        // Initial/first page rendering
        count = pdfDoc.numPages;
        renderPage(pageNum);
        });
    },
    error:function(XMLHttpRequest, textStatus, errorThrown){
        alert(XMLHttpRequest.status);
        alert(XMLHttpRequest.readyState);
        alert(textStatus);  
    }
});
  
  $.get("abc.txt",function(data,status){
    alert("数据: " + data + "\n状态: " + status);
  });
});