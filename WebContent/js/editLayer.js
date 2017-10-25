$(document).ready(function() {
    $(".editStartBtn").click(StartEditPre);
    $(".exitEditMode").click(exitEditMode);
    $(".export").click(exportStandardDoc);
    $(".editSaveBtn").click(saveNoteDOM);
})

function StartEditPre() {
    // 读取之前保存的笔记
    $.ajax(
	{
	    type : "post",
	    url : "loadNoteDOM",
	    async : false,
	    data :
		{// 设置数据源
		    'userID' : "xhy",
		    'fileName' : "实验手册.pdf"
		},
	    dataType : "json",// 设置需要返回的数据类型
	    success : function(resultString) {
		if (resultString.indexOf("###$$$file lost!###$$$") >= 0) {
		    $(".editFrame").contents().find(".NoteScale").text("1");
		    return;
		}
		var editBody = $(".editFrame").contents().find("body");// 添加笔记的DOM
		editBody.html(resultString);

		// 未读取出的笔记添加监听、默认都折叠、设置缩放
		var NoteWraps = $(".editFrame").contents().find(".editCanvas").children();
		var originWidth = $(".editFrame").contents().find(".editCanvas").width();
		var curWidth = $(".pdfFrame").contents().find("#page1").width();
		var scale = $(".editFrame").contents().find(".NoteScale").text();
		alert(scale);
		scale = curWidth / (originWidth/scale);
		alert(scale);
		$(".editFrame").contents().find(".NoteScale").text(scale);
		NoteWraps.each(function() {
		    // 1
		    window.frames["editFrame"].addListenerForNote($(this));

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
	    }
	});// $.ajax({}) end

    // 已做笔记位置适配

    // 蒙板层尺寸适配
    var pdfShowDiv = $(".pdfFrame").contents().find("#viewer");
    var pdfShowViewerContainer = $(".pdfFrame").contents().find("#viewerContainer");
    var pdfShowToolbar = $(".pdfFrame").contents().find("#mainContainer > div.toolbar");
    var pdfShowFirstPage = $(".pdfFrame").contents().find("#page1");

    var editCanvas = $(".editFrame").contents().find(".editCanvas");
    var editDiv = $(".editFrame").contents().find(".editDiv");
    var editMaxContainer = $(".editFrame").contents().find(".editOuterContainer");
    var editToolbar = $(".editFrame").contents().find(".editToolbar");

    editCanvas.width(pdfShowFirstPage.width());
    editCanvas.height(pdfShowDiv.height());
    editToolbar.width(pdfShowToolbar.width());
    editToolbar.height(pdfShowToolbar.height());
    editDiv.height($(".editFrame").height() - pdfShowToolbar.height());
    editDiv.css("top", pdfShowToolbar.height());
    editDiv.scroll(function() {
	pdfShowViewerContainer.scrollTop(editDiv.scrollTop());
	pdfShowViewerContainer.scrollLeft(editDiv.scrollLeft());
    })
    if (pdfShowFirstPage.width() < pdfShowDiv.width()) {
	editCanvas.css("left", (pdfShowDiv.width() - pdfShowFirstPage.width()) * 0.5);
    } else {
	editCanvas.css("left", 0);
    }
    window.frames["editFrame"].addCanvasEventListener();// 为蒙板层添加事件监听
    $(".editFrame").show();
}

function exportStandardDoc() {
    // 导出标准文档
    var pdfShowDiv = $(".pdfFrame").contents().find("#viewerContainer");
    var pdfShowViewerContainer = $(".pdfFrame").contents().find("#viewerContainer");
    $(".testDOMTREE").html(pdfShowDiv.html());
    // var pdfPages = $(".pdfFrame").contents().find(".canvasWrapper > canvas");
    // pdfPages.each(function() {
    // pdfShowViewerContainer.scrollTop(pdfShowViewerContainer.scrollTop()+$(this).height());
    // alert("scroll:"+pdfShowViewerContainer.scrollTop());
    // while( $(this).children().filter(".loadingIcon")!=null){
    // setTimeout(function(){
    // alert("dnf");
    // }, 1000);
    // }
    // alert($(this).html());
    // })
}

function showPdf() {
    var container = document.getElementById("container");
    container.style.display = "block";
    var url = 'Lab3.pdf';
    PDFJS.workerSrc = 'js/pdf.worker.js';
    PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
	pdf.getPage(1).then(function getPageHelloWorld(page) {
	    var scale = 1;
	    var viewport = page.getViewport(scale);
	    var canvas = document.getElementById('the-canvas');
	    var context = canvas.getContext('2d');
	    canvas.height = viewport.height;
	    canvas.width = viewport.width;
	    var renderContext =
		{
		    canvasContext : context,
		    viewport : viewport
		};
	    page.render(renderContext);
	});
    });
}

function exitEditMode() {
    $(".editFrame").hide();
    $(".editFrame").contents().find(".editCanvas").children().remove();
}

function saveNoteDOM() {
    // 添加笔记的DOM
    var editBody = $(".editFrame").contents().find("body");

    // 保留textarea的shadow-dom内部的笔记内容
    var NoteWraps = $(".editFrame").contents().find(".editCanvas").children();
    NoteWraps.each(function() {
	var textarea = this.getElementsByTagName("textarea")[0];
	$(textarea).text(textarea.value);
    })

    alert(editBody.html());
    $.ajax(
	{
	    type : "post",
	    url : "saveNoteDOM",
	    data :
		{// 设置数据源
		    'mDOMString' : editBody.html(),
		    'userID' : "xhy",
		    'fileName' : "实验手册.pdf"
		},
	    dataType : "json",// 设置需要返回的数据类型
	    success : function(resultString) {
		alert(resultString);
	    },
	    error : function(resultString) {
		alert("抱歉,好像出错了...");
	    }
	});// $.ajax({}) end
}