<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
 request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/editLayer.css" type="text/css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/menu_tree.css"/>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/codebase/GooUploader.css"/>
<title>论文云簿</title>
<%-- <script src="http://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js"></script> --%>
<script src="http://libs.baidu.com/jquery/1.5.2/jquery.min.js"></script>
<script type = "text/javascript" src="${pageContext.request.contextPath}/js/jquery.treeview.js"></script>
<script type = "text/javascript" src="${pageContext.request.contextPath}/js/jquery.contextmenu.r2.js"></script>
<script type = "text/javascript" src="${pageContext.request.contextPath}/js/menu_tree.js"></script>
<script type = "text/javascript" src="${pageContext.request.contextPath}/js/jquery.cookie.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/codebase/GooUploader.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/codebase/swfupload/swfupload.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/editLayer.js"></script>
<script type="text/javascript" src="http://www.w3cschool.cc/try/jeasyui/jquery.easyui.min.js"></script>

<script type="text/javascript">

// var userInfo = '${param.userInfo}';
// alert(userInfo.userName);
var userInfo = {
	userName: '${param.userName}',
	password: "123123",
	currentFile:""
}
</script>
</head>
 

<body>
<a class="editStartBtn">启用编辑</a>
<a class="exitEditMode">关闭编辑</a>
<a class="editSaveBtn">保存笔记</a>
<!-- <a class="export">导出</a> -->
<iframe src="${pageContext.request.contextPath}/pdfjs/web/viewer.html?file=../../readme.pdf" frameborder="0" class="pdfFrame" name="pdfFrame"></iframe>
<iframe src="${pageContext.request.contextPath}/jsp/editContainer.jsp" frameborder="0" class="editFrame" name="editFrame"></iframe>
<div class="testDOMTREE"> </div>


<div class="fileManager">
	<div class="menu">
	<ul id="system_tree" class="filetree treeview-famfamfam">
	</ul>
	</div>
	
	<div id="addrootfolder" style="top:20px;position:absolute">
	<button onclick="AddRootFolder()">新增分类</button>
	</div>
	
	<div class="menu">
	<ul id="user_tree" class="filetree treeview-famfamfam">
	</ul>
	</div>
	
	<div class="contextMenu" id="folderMenu">
	   <ul>
	     <li id="addFolder">添加文件夹</li>
	     <li id="deleteFolder">删除文件夹</li>
	     <li id="renameFolder">重命名文件夹</li>
	     <li id="uploadFile">上传文件</li>
	   </ul>
	</div>
	
	<div class="contextMenu" id="fileMenu">
	   <ul>
	     <li id="deleteFile">删除文件</li>
	     <li id="renameFile">重命名文件</li>
	     <li id="intensiveRead">精读</li>
	     <li id="roughRead">粗读</li>
	     <li id="unRead">未读</li>
	   </ul>
	</div>
	
	<div id="overlay" class="black_overlay">
	</div>
</div>
</body>
</html>