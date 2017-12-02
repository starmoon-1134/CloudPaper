<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>test</title>
  <meta name="site" content="content site">
  <meta name="Site" content="content Site">
  <meta name="title" content="content title">
  <meta name="Title" content="content Title">
  <link rel="stylesheet" href="/CloudPaper/css/share.min.css">
  <style>
.row { padding: 20px 0 0 20px }
.row-pad { padding: 20px 0 0 60px }
</style>
  </head>
  <body>
  <div class="row-pad">
    <h1>test</h1>
  </div>
  <ol>
    <li class="row">
    <div class="social-share" data-sites="qq"></div>
  </li>
  </ol>
<script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
<script src="/CloudPaper/js/jquery.share.min.js"></script> 
<script>
	$('#share-1').share();
	$('#share-2').share({sites: ['qzone', 'qq', 'weibo','wechat']});
	$('#share-3').share();
	$('#share-4').share();
	$(document).ready(function() {
	  var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false,
        false, false, false, 0, null);
      $(".social-share-icon").attr("id","transform");
      document.getElementById("transform").dispatchEvent(ev);
	});
</script>
</body>
</html>