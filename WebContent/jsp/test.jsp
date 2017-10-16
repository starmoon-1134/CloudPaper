<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html>

<HTML>
 <HEAD>
  <TITLE> JQuery右键菜单 </TITLE>
    <script type="text/javascript" src="../js/jquery-1.8.2.js"></script> 
	<script type = "text/javascript" src=../js/jquery.treeview.js></script>
	<script type = "text/javascript" src=../js/jquery.contextmenu.r2.js></script>
 </HEAD>
 <BODY>
 <span class="demo1" style="color:green;">
    右键点此
 </span>
    <!--右键菜单的源-->
     <div class="contextMenu" id="myMenu1">
      <ul>
        <li id="open">打开</li>
        <li id="email">邮件</li>
        <li id="save">保存</li>
        <li id="delete">关闭</li>
      </ul>
    </div>
 </BODY>
 <script>
    //所有class为demo1的span标签都会绑定此右键菜单
     $('span.demo1').contextMenu('myMenu1', 
     {
          bindings: 
          {
            'open': function(t) {
              alert('Trigger was '+t.id+'\nAction was Open');
            },
            'email': function(t) {
              alert('Trigger was '+t.id+'\nAction was Email');
            },
            'save': function(t) {
              alert('Trigger was '+t.id+'\nAction was Save');
            },
            'delete': function(t) {
              alert('Trigger was '+t.id+'\nAction was Delete');
            }
          }
    });
 </script>
</HTML>