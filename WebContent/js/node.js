$(document).ready(function() {
    // addCanvasEventListener();
})

function addCanvasEventListener() {
    $(".editCanvas").bind("click",
	{
	    mousepos : event
	}, insertLabel);
}

function insertLabel(mousepos) {
    var xx = mousepos.pageX;
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
    $(wrap).css(
	{
	    "top" : yy + scrollyy + "px",
	    "left" : xx + scrollxx + "px"
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

    // 屏蔽editCanvas的点击事件
    $(wrap).click(function(e) {
	e.stopPropagation();
    })
}