<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Menu-Tree</title>
<script type="text/javascript" src="js/jquery-1.8.2.js"></script> 
<script type = "text/javascript" src=js/jquery.treeview.js></script>
<script type = "text/javascript" src=js/jquery.contextmenu.r2.js></script>
<script type = "text/javascript" src=js/menu_tree.js></script>
<link rel="stylesheet" type="text/css" href="css/menu_tree.css"/>
</head> 
<body> 
<div class="menu">
<ul id="tree" class="filetree treeview-famfamfam">
</ul>
</div>
<div class="contextMenu" id="folderMenu">
   <ul>
     <li id="addFolder">添加文件夹</li>
     <li id="deleteFolder">删除文件夹</li>
     <li id="package">打包</li>
     <li id="close">关闭</li>
   </ul>
</div>
</body> 
</html>