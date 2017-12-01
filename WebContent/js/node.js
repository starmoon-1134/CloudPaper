$(document).ready(function() {
  // addCanvasEventListener();
  var pdfFrame = $('.pdfFrame', parent.document);
  pdfFrame.contents().find("#addNote").click(StartEditPre);
  
})

function addCanvasEventListener() {
  $(".editCanvas").bind("mousedown", {
    mousepos : event
  }, insertLabel);
}

function insertLabel(mousepos) {
  if (mousepos.button != 0) {
    // 只有鼠标左键才插入标签
    return;
  }
  var xx = mousepos.pageX - $(".editCanvas").offset().left;
  var yy = mousepos.pageY - $(".editToolbar").height();
  var scrollyy = $(".editDiv").scrollTop();
  var scrollxx = $(".editDiv").scrollLeft();
  // alert("x: " + xx + "y: " + yy);
  // alert("scrollx: " + scrollxx + "scrolly: " + scrollyy);

  // 生成DOM对象
  var wrap = document.createElement("div");
  var labelTitle = document.createElement("a");
  var textAreaContainer = document.createElement("div");
  var labelText = document.createElement("textarea");
  var cancelBtn = document.createElement("a");

  $(labelTitle).text("label1");

  // 设置笔记块的位置
  var scale = $(".NoteScale").text();
  $(wrap).css({
    "top" : (yy + scrollyy) / scale + "px",
    "left" : (xx + scrollxx) / scale + "px"
  });

  // 加入DOM Tree中
  textAreaContainer.append(labelText);
  wrap.append(labelTitle, textAreaContainer, cancelBtn);
  $(".editCanvas").append(wrap);

  // 设置css样式
  $(labelTitle).addClass("labelTitle");
  $(textAreaContainer).addClass("textAreaContainer");
  $(labelText).addClass("labelText");
  $(cancelBtn).addClass("cancelBtn");
  $(wrap).addClass("NoteWrap");

  // 如果已有笔记块，缩放应该统一
  var Note1 = $(".editCanvas").children()[0];
  if (Note1 != null) {
    $(wrap).css("zoom", scale);
  }

  addListenerForNote($(wrap));
  // $(wrap).click(function(e) {
  // e.stopPropagation();
  // })
}

function addListenerForNote(wrap) {
  // 屏蔽editCanvas的点击事件
  wrap.mousedown(function(e) {
    e.stopPropagation();
  });

  // 标签添加折叠响应
  wrap.find(".labelTitle").click(function() {
    wrap.toggleClass("NoteWrap");
    wrap.toggleClass("NoteWrapFold");
  });

  // 删除标签块响应
  wrap.find(".cancelBtn").click(function() {
    wrap.children().remove();
    wrap.detach();
  });

  // 允许拖拽
  wrap.draggable();
}

function StartEditPre() {
  // 更改按钮状态
  var $pdfFrame = $(".pdfFrame",parent.document);
  $pdfFrame.contents().find("#sidebarToggle").attr("disabled","true");
  $pdfFrame.contents().find("#zoomOut").attr("disabled","true");
  $pdfFrame.contents().find("#zoomIn").attr("disabled","true");
  $pdfFrame.contents().find("#scaleSelect").attr("disabled","true");
  $pdfFrame.contents().find("#secondaryToolbarToggle").attr("disabled","true");
  $pdfFrame.contents().find("#addNote").attr("disabled","true");
  $pdfFrame.contents().find("#saveNote").removeAttr("disabled");
  $pdfFrame.contents().find("#cancelNote").removeAttr("disabled");
  
  // 读取之前保存的笔记
  $.ajax(
      {
          type : "post",
          url : "loadNoteDOM",
          async : false,
          data :
                  {// 设置数据源
                  'userName' : window.parent.userInfo.userName,
                  'fileName' : window.parent.userInfo.currentFile
              },
          dataType : "json",// 设置需要返回的数据类型
          success : function(resultString) {
              if (resultString.indexOf("checkFailed") >= 0) {
                  window.location.href = "/CloudPaper";
                  return;
              }
              if (resultString.indexOf("###$$$file lost!###$$$") >= 0) {
                  $(".NoteScale").text("1");
                  return;
              }
              if(resultString.indexOf("checkFailed") >= 0){
                  window.location.href="/CloudPaper";
              }
              
              var editBody = $("body");// 添加笔记的DOM
              editBody.html(resultString);

              // 为读取出的笔记添加监听、默认都折叠、设置缩放
              var NoteWraps = $(".editCanvas").children();
              var originWidth = $(".editCanvas").width();
              var curWidth = $pdfFrame.contents().find("#page1").width();
              var scale = $(".NoteScale").text();
              scale = curWidth / (originWidth/scale);
              $(".NoteScale").text(scale);
              NoteWraps.each(function() {
                  // 1
                  addListenerForNote($(this));

                  // 2
                  $(this).css(
                      {
                          "zoom" : scale
                      // "top" : originPosY * scale + "px",
                      // "left" : originPosX * scale + "px"
                      });

                  // 3
                  if ($(this).hasClass("NoteWrap")) {
                      $(this).toggleClass("NoteWrapFold");
                      $(this).toggleClass("NoteWrap");
                  }
              })
          },
          error : function(resultString) {
                  alert("抱歉,好像出错了...");
// var str = JSON.stringify(resultString);
// alert(str);
          }
      });// $.ajax({}) end

  // 已做笔记位置适配

  // 蒙板层尺寸适配
  var pdfShowDiv = $pdfFrame.contents().find("#viewer");
  var pdfShowViewerContainer = $pdfFrame.contents().find("#viewerContainer");
  var pdfShowToolbar = $pdfFrame.contents().find("#mainContainer > div.toolbar");
  var pdfShowFirstPage = $pdfFrame.contents().find("#page1");

  var editCanvas = $(".editCanvas");
  var editDiv = $(".editDiv");
  var editMaxContainer = $(".editOuterContainer");

// var posYpdfFrame = $pdfFrame.offset().top;
  var posYpdfFrame = $pdfFrame.css("top");
  $(".editFrame",parent.document).css({
      "height":($pdfFrame.height()-pdfShowToolbar.height())+"px",
      "top":(posYpdfFrame.substring(0,posYpdfFrame.length-3)+pdfShowToolbar.height())+"px"
  })
  editCanvas.width(pdfShowFirstPage.width());
  editCanvas.height(pdfShowDiv.height());
// editToolbar.width(pdfShowToolbar.width());
// editToolbar.height(pdfShowToolbar.height());
// editDiv.height($(".editFrame").height() - pdfShowToolbar.height());
// editDiv.css("top", pdfShowToolbar.height());
  editDiv.height($(".editFrame",parent.document).height());
  editDiv.css("top", "0px");
  editDiv.scroll(function() {
      pdfShowViewerContainer.scrollTop(editDiv.scrollTop());
      pdfShowViewerContainer.scrollLeft(editDiv.scrollLeft());
  })
  if (pdfShowFirstPage.width() < pdfShowDiv.width()) {
      editCanvas.css("left", (pdfShowDiv.width() - pdfShowFirstPage.width()) * 0.5);
  } else {
      editCanvas.css("left", 0);
  }
  addCanvasEventListener();// 为蒙板层添加事件监听
  $(".editFrame",parent.document).show();
}
