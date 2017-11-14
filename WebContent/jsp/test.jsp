<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<body>
<script type="text/javascript">
    onload=function(){  
        setInterval(go, 1000);  
    };  
    var x=3; //利用了全局变量来执行  
    function go(){  
    x--;  
        if(x>0){  
        document.getElementById("sp").innerHTML=x;  //每次设置的x的值都不一样了。  
        }else{  
        location.href='jsp/login.jsp';  
        }  
    }  
</script>
<div>
<lable>剩余
<span id="sp">3</span>
</label>
<label>
秒跳转
</label>
</div>
</body>
</html>