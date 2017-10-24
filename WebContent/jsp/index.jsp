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
<link rel="stylesheet" href="css/editLayer.css" type="text/css">
<!-- <link rel="stylesheet" href="pdfjs/web/viewer.css" type="text/css"> -->
<title>论文云簿</title>
<script src="http://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js"></script>
<script type="text/javascript" src="js/editLayer.js"></script>
</head>
 

<body>
<a class="editStartBtn">启用编辑</a>
<a class="exitEditMode">关闭编辑</a>
<a class="editSaveBtn">保存笔记</a>
<!-- <a class="export">导出</a> -->
<iframe src="pdfjs/web/viewer.html?file=../../Lab3.pdf" frameborder="0" class="pdfFrame"></iframe>
<iframe src="jsp/editContainer.jsp" frameborder="0" class="editFrame" name="editFrame"></iframe>
<div class="testDOMTREE"> </div>
</body>
</html>