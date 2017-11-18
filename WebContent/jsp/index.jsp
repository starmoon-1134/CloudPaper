<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
 request.setCharacterEncoding("UTF-8");
%>

<!DOCTYPE html>
<html lang="en-GB">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script src="/CloudPaper/js/home/home1.js"></script>
        <meta name="apple-itunes-app" content="app-id=380669300">

        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="Mendeley Web Library">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">

        <title>Web Library</title>

        <link rel="icon" href="/CloudPaper/images/paper.ico">
        <link rel="stylesheet" href="/CloudPaper/css/main.css" type="text/css" />

        <script src="///assets.adobedtm.com/376c5346e33126fdb6b2dbac81e307cbacfd7935/satelliteLib-4a7497b2b1d1900fe42ef2c13e32daeedf9c1642.js"></script>
        <script src="///cdn.optimizely.com/js/238413261.js"></script>

        <!-- Hotjar Tracking Code for https://www.mendeley.com/ -->

        <script type="text/javascript">
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:134424,hjsv:5};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
        </script>
        <script src="http://libs.baidu.com/jquery/1.5.2/jquery.min.js"></script>
		<script type = "text/javascript" src=/CloudPaper/js/jquery.treeview.js></script>
		<script type = "text/javascript" src=/CloudPaper/js/jquery.contextmenu.r2.js></script>
		<script type = "text/javascript" src=/CloudPaper/js/menu_tree.js></script>
		<script type = "text/javascript" src=/CloudPaper/js/jquery.cookie.js></script>
		<link rel="stylesheet" type="text/css" href="/CloudPaper/codebase/GooUploader.css"/>
		<link rel="stylesheet" type="text/css" href="/CloudPaper/css/editLayer.css"/>
		<script  type="text/javascript" src="/CloudPaper/codebase/GooUploader.js"></script>
		<script type="text/javascript" src="/CloudPaper/codebase/swfupload/swfupload.js"></script>
		<script type="text/javascript" src="/CloudPaper/js/editLayer.js"></script>
	<style type="text/css">
		.with-container span {
			position: absolute;
			top: 30px;
			left: 90px;
			font-size: 100;
			font-family: NexusSans, Arial, sans-serif;	
		}
		#logo_img {
			position: absolute;
			top: 20px;
			left: 30px;
			height: 45px;
			weight: 45px;
		}
		.menu {
			margin-top: 40px;
		}
		.menu span {
			font-family: NexusSans, Arial, sans-serif;
	    	color: gray;
	    	font-size: 15px;
		}
		.menu ul {
			margin-left: 10px;
		} 
		#library-navigation header {
			border-top: 1px solid #CFCFCF;
			border-bottom: 1px solid #CFCFCF;
			cursor: pointer;
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
			height: 33px;
			width: 100%;
			padding: 0 0 0 8px;
			background: rgba(0, 0, 0, 0.05);
			color: #004E68;
			font-weight: bold;
			font-size: 13px;
			line-height: 2.46154;
			box-sizing: border-box;
		}
	</style>
	<script type="text/javascript">

// var userInfo = '';
// alert(userInfo.userName);

var userInfo = {
    userName: <%="\""+ (String) session.getAttribute("username")+"\""%>,
    password: <%="\""+(String) session.getAttribute("password")+"\""%>,
    currentFile:""
}
</script>
	
    </head>
    <body>
        <!--[if IE 9 | (lt IE 9)]>
            <h2 style='margin:15px; padding:15px;text-align:center'>Your current version of Internet Explorer is not compatible with the Mendeley Web Library.
            Please use the latest version of <a href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">Internet Explorer</a>,
            <a href='http://www.google.co.uk/chrome/'>Google Chrome</a> or <a href='https://www.mozilla.org/en-US/firefox/new/?scene=2#download-fx'>Firefox</a>. Apologies for any inconveniences caused.</h2>
        <!--<![endif]-->

        <!--[if (gt IE 9)]><!-->
            <div id="global-feedback" class="global-feedback"></div>

            <header class="masthead web-library with-library-selected">
              <div class="with-container">
                <img id="logo_img" src="../images/paper.png"  alt="CloudPaper" />
                <span>论文云簿</span>
                <nav class="js-menu-slider ">
                  <ul class="navigation-list js-dropdown">

<!--                     <li><a class="feed-section-link" href="https://www.mendeley.com/newsfeed/" title="Feed">Feed</a></li> -->
<!--                     <li><a class="library-section-link" href="https://www.mendeley.com/library/" title="Library">Library</a></li> -->
<!--                     <li><a class="suggest-section-link" href="https://www.mendeley.com/suggest/" title="Suggest">Suggest</a></li> -->
<!--                     <li><a class="stats-section-link" href="https://www.mendeley.com/stats/" title="Stats">Stats</a></li> -->
<!--                     <li><a class="groups-section-link" href="https://www.mendeley.com/community/" title="Groups">Groups</a></li> -->
<!--                     <li><a class="data-section-link" href="https://data.mendeley.com" rel="noopener" target="_blank" title="Datasets">Datasets</a></li> -->
<!--                     <li><a class="careers-section-link" href="https://www.mendeley.com/careers/" title="Careers">Careers</a></li> -->
<!--                     <li><a class="funding-section-link" href="https://www.mendeley.com/research-funding/" title="Funding">Funding</a></li> -->

                    <li id="search-toolbar" class="masthead-library-search">
                        <input type="text" name="query" placeholder="Library search">
                        <span class="with-icon-before icon-search"></span>
                    </li>

                    <li class="profile">
                      <a class="profile-section-link" href="https://www.mendeley.com/profiles/yue-zhou23/" title="Yue Zhou" data-id="5412159e-5b9f-3087-b35a-db13762f786b">
                        <span>Yue</span>
                        <img src="https://photos.mendeley.com/awaiting/48/48/WXVl/WmhvdQ" alt="Profile Picture" class="small-image">
                      </a>
                    </li>

                    <li class="account">
                      <a href="" class="with-nav with-icon-after icon-navigatedown"></a>
                      <ul>
                        <li class="l-hidden m-hidden indeed with-divider"><a href="https://www.mendeley.com/profiles/yue-zhou23/" title="Yue">Profile</a></li>
                        <li><a href="https://www.mendeley.com/account-settings/" title="Settings & privacy">Settings &amp; privacy</a></li>
                        <li><a href="https://www.mendeley.com/download-mendeley-desktop/" title="Download">Download Mendeley</a></li>
                        <li><a href="https://www.mendeley.com/invite/" title="Invite">Invite to Mendeley</a></li>
                        <li><a href="https://www.mendeley.com/contact-support/" title="Support">Support</a></li>
                        <li class="with-divider"><a href="https://www.mendeley.com/logout/" title="Logout">Logout</a></li>
                      </ul>
                    </li>

                  </ul>
                </nav>

              </div>
            </header>

            <script src="//static.mendeley.com/lib-js-onboarding/loader.js" async></script>
            <div id="container" class="container initialstate">
                <section id="leftcolumn-area">
                    <nav id="content-navigation">
                        <div id="library-navigation" class="library-navigation accordion noanimation">
                            
                            <header >目录 <i class="icon icon-caret"></i></header>
<!-- 							<div class="menu"> -->
<!-- 								<ul id="tree" class="filetree treeview-famfamfam"> -->
<!-- 								</ul> -->
<!-- 								</div> -->
                                <div class="menu">
    <ul id="system_tree" class="filetree treeview-famfamfam">
    </ul>
    </div>
    
    <div id="addrootfolder" style="position:relative;float:left">
    <button onclick="AddRootFolder()">新增分类</button>
    </div>
    <br></br>
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
								
<!-- 								<div class="contextMenu" id="fileMenu"> -->
<!-- 								   <ul> -->
<!-- 								     <li id="deleteFile">删除文件</li> -->
<!-- 								     <li id="renameFile">重命名文件</li> -->
<!-- 								     <li id="exportFile">导出文件</li> -->
<!-- 								   </ul> -->
<!-- 								</div> -->
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
                            <div class="accordion-pane" data-content="all-documents my-publications favorites folders">
                                <div class="accordion-content scrollable">
                                    <section id="my-library">
                                        <div id="special-folder-list">
                                        </div>
                                        <div id="folders" class="folders">
                                        </div>
                                    </section>
                                </div>
                                <div class="beforeshadow"></div>
                                <div class="aftershadow"></div>
                                <header class="accordion-trigger">
                                     MY LIBRARY <i class="icon icon-caret"></i>
                                </header>
                            </div>
                            <div class="accordion-pane" data-content="groups">
                                <div class="accordion-content scrollable">
                                    <section id="groups">
                                    </section>
                                </div>
                                <div class="beforeshadow"></div>
                                <div class="aftershadow"></div>
                                <header class="accordion-trigger">
                                     GROUPS <i class="icon icon-caret"></i>
                                </header>
                            </div>
                            <div id="trash" class="accordion-pane" data-content="trash" data-maxheight="180">
                                <div class="accordion-content scrollable">
                                    <section></section>
                                </div>
                                <div class="beforeshadow"></div>
                                <div class="aftershadow"></div>
                                <header class="accordion-trigger">
                                     TRASH <i class="icon icon-caret"></i>
                                </header>
                            </div>
                        </div>
                    </nav>
                </section>

                <section id="content-centralarea">
                	<iframe src="/CloudPaper/pdfjs/web/viewer.html?file=09.pdf" frameborder="0" class="pdfFrame" name="pdfFrame"></iframe>
					<iframe src="/CloudPaper/jsp/editContainer.jsp" frameborder="0" class="editFrame" name="editFrame"></iframe>
					<div class="testDOMTREE"> </div>

<!--                         <ul id="message-toolbar" class="toolbar"></ul> -->

<!--                         <ul id="selection-toolbar" class="selection-toolbar"> -->
<!--                             <li class="action select-all notin-none"> -->
<!--                                 <button title="Select All"> -->

<!--                                 </button> -->
<!--                             </li> -->
<!--                             <li class="action organize notin-trash"> -->
<!--                                 <button title="Add to"> -->

<!--                                 </button> -->
<!--                             </li> -->
<!--                             <li class="action remove in-folders"> -->
<!--                                 <button title="Remove from folder"> -->

<!--                                 </button> -->
<!--                             </li> -->
<!--                             <li class="action removespecialfolder in-my-publications" data-id="my-publications" > -->
<!--                                 <button title="Remove from My Publications"> -->

<!--                                 </button> -->
<!--                             </li> -->
<!--                             <li class="action removespecialfolder in-favorites" data-id="favorites" > -->
<!--                                 <button title="Remove from Favorites"> -->

<!--                                 </button> -->
<!--                             </li> -->
<!--                             <li class="action trash notin-trash"> -->
<!--                                 <button title="Delete"> -->

<!--                                 </button> -->
<!--                             </li> -->
<!--                             <li class="action restore in-trash"> -->

<!--                             </li> -->
<!--                             <li class="action delete in-trash"> -->

<!--                             </li> -->
<!--                             <li class="action ms-word-export notin-trash notin-groups"> -->

<!--                             </li> -->
<!--                         </ul> -->
<!--                         <ul id="document-list-toolbar" class="document-list-toolbar actioncontainer"> -->
<!--                             <li id="document-sort-order" class="document-sort-order dropdown"> -->

<!--                                 <ul class="menu"> -->
<!--                                 </ul> -->
<!--                             </li> -->
<!--                         </ul> -->



<!--                         <div id="document-list" class="document-list loading"> -->
<!--                             <p>Loading documents&hellip;</p> -->
<!--                         </div> -->





                </section>

                <section id="content-related">
                    <div id="collapsehandle">
                        <div id="collapsehandle-inner">
                            <span class="icon icon-handle"></span>
                        </div>
                    </div>
                </section>

                <div id="version"></div>

                <section id="content-overlay" style="display:none;">
                </section>
            </div>

            <div id="organize-modal" class="modal" data-size="s" data-effect="scale">
                <div class="modal-content">
                    <div class="modal-header">
                        <a href="#" class="modal-close"><i class="icon icon-remove"></i></a>
                        Add <span class="docnumber"></span> to
                    </div>
                    <div class="modal-body">
                        <div class="organize-home my-library">

                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="organize-destination-container">
                            <span class="organize-error">
                                <i class="icon icon-triangle-warning"></i><span class="organize-error-label"></span>
                            </span>
                            <button class="organize-submit" disabled>
                                Add Here
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="confirm-modal" class="modal" data-size="s" data-effect="scale">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="confirm-message"></div>
                    </div>

                    <div class="modal-footer">
                        <a href="#" class="cancel-submit">Cancel</a>
                        <button class="confirm-submit">Ok</button>
                    </div>
                </div>
            </div>

            <div id="journey-tutorial"></div>

            <script type="text/javascript" src="/CloudPaper/js/home/home2.js"></script>
        <!--<![endif]-->

        <script type="text/javascript">
            window.pageData = {
                page: {
                    businessUnit: 'els:rp:st',
                    language: 'en',
                    loadTime: String(Date.now() - 1510413804827),
                    loadTimeStamp: '1510413804827',
                    name: 'library',
                    productName: 'md',
                    environment: 'prod',
                    noTracking: 'false',
                    type: 'np-gp'
                },
                visitor: {
                    userId: 'md:5412159e-5b9f-3087-b35a-db13762f786b',
                    accountId: '',
                    accountName: '',
                    accessType: 'md:registered-user',
                    ipAddress: '253.185.185.171'
                }
            };

            window.pageDataTracker.trackPageLoad();
        </script>

    </body>
</html>
