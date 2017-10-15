$(document).ready(function(){
	$(".editCanvas").bind("click",{mousepos:event}, insertLabel);
	})
	

function insertLabel(mousepos) {
    var xx = mousepos.pageX;  
    var yy = mousepos.pageY;   
    var scrollyy = $(".editDiv").scrollTop();
    var scrollxx = $(".editDiv").scrollLeft();
    alert("x: "+xx+"y: "+ yy);
    alert("scrollx: "+scrollxx+"scrolly: "+ scrollyy);
}