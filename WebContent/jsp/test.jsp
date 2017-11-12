<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<body>

字段1: <input type="text" id="field1" value="Hello World!" >
<br />
字段2: <input type="text" id="field2" ondblclick="this.value=''">
<span ondblclick="document.getElementById('field2').value = document.getElementById('field1').value">（双击此按钮拷贝）</span>

</body>
</html>