<!DOCTYPE html>
<<<<<<< HEAD
<html>
<head>
<script src="pdfjs/build/pdf.js"></script>


</head>

<body>


<h1>PDF.js Previous/Next example</h1>

<div>
  <button id="prev">Previous</button>
  <button id="next">Next</button>
  &nbsp; &nbsp;
  <span>Page: <span id="page_num"></span> / <span id="page_count"></span></span>
</div>

<canvas id="the-canvas" style="width:1056px;height:816px;"></canvas>
=======
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
>>>>>>> CloudPaper/packdownload
</body>

<script>
//If absolute URL from the remote server is provided, configure the CORS
//header on that server.
var url = '/CloudPaper/userFiles/xhy/pdf/Lab7实验手册.pdf';

//The workerSrc property shall be specified.
PDFJS.workerSrc = '/CloudPaper/pdfjs/build/pdf.worker.js';

var pdfDoc = null,
 pageNum = 1,
 pageRendering = false,
 pageNumPending = null,
 scale = 1.8,
 canvas = document.getElementById('the-canvas'),
 ctx = canvas.getContext('2d');

/**
* Get page info from document, resize canvas accordingly, and render page.
* @param num Page number.
*/
function renderPage(num) {
pageRendering = true;
// Using promise to fetch the page
pdfDoc.getPage(num).then(function(page) {
 var viewport = page.getViewport(scale);
 canvas.height = viewport.height;
 canvas.width = viewport.width;

 // Render PDF page into canvas context
 alert("h:"+viewport.height+"\nw:"+viewport.width);
 var renderContext = {
   canvasContext: ctx,
   viewport: viewport
 };
 var renderTask = page.render(renderContext);

 // Wait for rendering to finish
 renderTask.promise.then(function() {
   pageRendering = false;
   if (pageNumPending !== null) {
     // New page rendering is pending
     renderPage(pageNumPending);
     pageNumPending = null;
   }
 });
});

// Update page counters
document.getElementById('page_num').textContent = pageNum;
}

/**
* If another page rendering in progress, waits until the rendering is
* finised. Otherwise, executes rendering immediately.
*/
function queueRenderPage(num) {
if (pageRendering) {
 pageNumPending = num;
} else {
 renderPage(num);
}
}

/**
* Displays previous page.
*/
function onPrevPage() {
if (pageNum <= 1) {
 return;
}
pageNum--;
queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
* Displays next page.
*/
function onNextPage() {
if (pageNum >= pdfDoc.numPages) {
 return;
}
pageNum++;
queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
* Asynchronously downloads PDF.
*/
PDFJS.getDocument(url).then(function(pdfDoc_) {
pdfDoc = pdfDoc_;
document.getElementById('page_count').textContent = pdfDoc.numPages;

// Initial/first page rendering
renderPage(pageNum);
});
</script>
</html>