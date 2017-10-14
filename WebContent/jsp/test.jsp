<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jQuery多级层叠树形菜单效果</title>
<style>
.topnav {
 width: 213px;
 padding: 40px 28px 25px 0;
 font-family: "CenturyGothicRegular", "Century Gothic", Arial, Helvetica, sans-serif;
}
ul.topnav {
 padding: 0;
 margin: 0;
 font-size: 1em;
 line-height: 0.5em;
 list-style: none;
}
ul.topnav li {}
ul.topnav li a {
 line-height: 10px;
 font-size: 11px;
 padding: 10px 5px;
 color: #000;
 display: block;
 text-decoration: none;
 font-weight: bolder;
}
ul.topnav li a:hover {
 background-color:#675C7C;
 color:white;
}
ul.topnav ul {
 margin: 0;
 padding: 0;
 display: none;
}
ul.topnav ul li {
 margin: 0;
 padding: 0;
 clear: both;
}
ul.topnav ul li a {
 padding-left: 20px;
 font-size: 10px;
 font-weight: normal;
 outline:0;
}
ul.topnav ul li a:hover {
 background-color:#D3C99C;
 color:#675C7C;
}
ul.topnav ul ul li a {
 color:silver;
 padding-left: 40px;
}
ul.topnav ul ul li a:hover {
 background-color:#D3CEB8;
 color:#675C7C;
}
ul.topnav span{
 float:right;
}
</style>
<script type="text/javascript" src="js/jquery-1.8.2.js"></script>
<script type="text/javascript">
(function($){
 $.fn.extend({
 accordion: function(options) {
  var defaults = {
   accordion: 'true',
   speed: 300,
   closedSign: '[+]',
   openedSign: '[-]'
  };
  var opts = $.extend(defaults, options);
   var $this = $(this);
   $this.find("li").each(function() {
    if($(this).find("ul").size() != 0){
     $(this).find("a:first").append("<span>"+ opts.closedSign +"</span>");
     if($(this).find("a:first").attr('href') == "#"){
      $(this).find("a:first").click(function(){return false;});
     }
    }
   });
   $this.find("li.active").each(function() {
    $(this).parents("ul").slideDown(opts.speed);
    $(this).parents("ul").parent("li").find("span:first").html(opts.openedSign);
   });
   $this.find("li a").click(function() {
    if($(this).parent().find("ul").size() != 0){
     if(opts.accordion){
      if(!$(this).parent().find("ul").is(':visible')){
       parents = $(this).parent().parents("ul");
       visible = $this.find("ul:visible");
       visible.each(function(visibleIndex){
        var close = true;
        parents.each(function(parentIndex){
         if(parents[parentIndex] == visible[visibleIndex]){
          close = false;
          return false;
         }
        });
        if(close){
         if($(this).parent().find("ul") != visible[visibleIndex]){
          $(visible[visibleIndex]).slideUp(opts.speed, function(){
           $(this).parent("li").find("span:first").html(opts.closedSign);
          });
         }
        }
       });
      }
     }
     if($(this).parent().find("ul:first").is(":visible")){
      $(this).parent().find("ul:first").slideUp(opts.speed, function(){
       $(this).parent("li").find("span:first").delay(opts.speed).html(opts.closedSign);
      });
     }else{
      $(this).parent().find("ul:first").slideDown(opts.speed, function(){
       $(this).parent("li").find("span:first").delay(opts.speed).html(opts.openedSign);
      });
     }
    }
   });
 }
});
})(jQuery);
</script>
<script type="text/javascript">
$(document).ready(function() {
 $(".topnav").accordion({
  accordion:false,
  speed: 500,
  closedSign: '[+]',
  openedSign: '[-]'
 });
});
</script>
<head>
<body>
<ul class="topnav">
 <li><a href="#" target="scriptbreaker">Home</a></li>
 <li><a href="#">JavaScript</a>
  <ul>
    <li><a href="#">Cookies</a></li>
    <li><a href="#">Events</a></li>
    <li><a href="#">Forms</a></li>
    <li><a href="#">Games</a></li>
    <li><a href="#">Images</a></li>
    <li><a href="#">Navigations</a>
    <ul>
     <li><a href="#">CSS</a></li>
     <li><a href="#">JavaScript</a></li>
     <li><a href="#">JQuery</a></li>
    </ul>
   </li>
    <li><a href="#">Tabs</a></li>
  </ul>
 </li>
 <li><a href="#">Tutorials</a>
  <ul>
    <li class="active"><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
    <li><a href="#">JavaScript</a></li>
    <li><a href="#">Java</a>
    <ul>
     <li><a href="#">JSP</a></li>
     <li><a href="#">JSF</a></li>
     <li><a href="#">JPA</a></li>
     <li><a href="#" target="_blank">Contact</a></li>
    </ul>
   </li>
    <li><a href="#">Tabs</a></li>
  </ul>
 </li>
 <li><a href="#" target="_blank">Contact</a></li>
 <li><a href="#">Upload script</a></li>
</ul>
</body>
</html>