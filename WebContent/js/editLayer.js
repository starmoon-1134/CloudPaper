$(document).ready(function(){
	$(".editStartBtn").click(StartEditPre);
	$(".exitEditMode").click(exitEditMode);
	
//	var info;
//	 var plugins = navigator.plugins;
//	 if (plugins.length>0) { 
//	  for (i=0; i < navigator.plugins.length; i++ ) { 
//	   info += navigator.plugins[i].name+";";
//	  }
//	 } 
	
	//alert(document.querySelector('#plugin').shadowRoot.querySelector('#sizer').width());
	//$(".editLayer").createShadowRoot();
//	var tmp = new Object();
//	tmp["a"] = $(".editLayer");
//	alert(tmp["a"].width());
	})
	
	
function StartEditPre() {
	
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
	editDiv.height($(".editFrame").height()-pdfShowToolbar.height());
	editDiv.css("top",pdfShowToolbar.height());
	editDiv.scroll(function() {
		pdfShowViewerContainer.scrollTop(editDiv.scrollTop());
		pdfShowViewerContainer.scrollLeft(editDiv.scrollLeft());
	})
	$(".editFrame").show();
}

function exitEditMode() {
	$(".editFrame").hide();
}