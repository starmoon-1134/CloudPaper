$(document).ready(function() {
    // addCanvasEventListener();
})

function addCanvasEventListener() {
    $(".editCanvas").bind("mousedown",
        {
            mousepos : event
        }, insertLabel);
}

function insertLabel(mousepos) {
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
    $(wrap).css(
        {
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
        // $('.drag', parent.document).css("z-index", "9999");
    });

    // $('.drag', parent.document).mouseup(function(e) {
    // $('.drag', parent.document).css("z-index", "-1");
    // });
    //
    // wrap.mouseup(function(e) {
    // $('.drag', parent.document).css("z-index", "-1");
    // });

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

    // // 允许拖拽
    // wrap.draggable();
}