var Lists = [
			{
			    title: "主页", code: "000", href: "ConsumerCategories/ConsumerCategories.aspx", img: "images/index-nav-img-0.gif"
			    , Link: [{
			        title: "消费类别", code: "001", href: "ConsumerCategories/ConsumerCategories.aspx",
			        Link: [ { title: "消别2", code: "012", href: "ConsumerCategories/ConsumerCategories.aspx" }]
			    },
			           { title: "消费", code: "002", href: "ConsumerCategories/ConsumerCategories.aspx" }
			    ]
			},
			{
			    title: "收支模块", code: "100", href: "OutCome/OutCome.aspx", img: "images/index-nav-img-1.gif",
			    Link: [{ title: "支出功能", code: "101", href: "OutCome/OutCome.aspx" }
			    , { title: "支出列表", code: "102", href: "OutCome/OutComeList.aspx" }
			    , { title: "月消费图", code: "103", href: "OutCome/OutComeChart.aspx" }
			    , { title: "easyUI", code: "104", href: "OutCome/OutComeQuery.aspx" }
			    ]
			}
        ];

        $(document).ready(function () {
    
            //用Json的方式设置定义参数
            var setting = {
                //组合而成的html代码
                treeString: "",
                //是否为首节点
                isRootNode: true,
                //+、-交互按钮
                switchClass: "",
                //顶级目录的竖虚线
                ulClass: "",
                //文件、文件夹图标
                fileClass: "",
                //定义是否显示子目录
                isDisplay: "display:block",
                //开始坐标
                startAxisX: 0,
                startAxisY: 0,
                //移动坐标
                moveAxisX: 0,
                moveAxisY: 0,
                //最小移动距离
                MinMoveSize: 5
            };
            var SwitchBool = false;     //拖拽时判断当前节点是否展开状态
            var isDrageToRoot = false;  //是否拖拽至顶级节点


            //1.树Html初始化
            var InitTreeHtml = function (treeId, treeTitle, treeHref, treeImg, switchClass, fileClass) {
                var TreeHtml = '<li class="tree-node" id="treeDemo_' + treeId + '_li"><input type="button" title="switch" class="' + switchClass + '" id="treeDemo_' + treeId + '_switch" /><a id="treeDemo_' + treeId + '_a" onclick="" target="_blank" ><input type="button" title="ico" class="' + fileClass + '" id="treeDemo_' + treeId + '_ico" onfocus="this.blur();"/><span id="treeDemo_' + treeId + '_span">' + treeTitle + '</span></a>';                
                return TreeHtml;
            };

            //虚线和展开、收缩图标[初始化,jsonList:json数据,index:索引,initClass:初始化图标]
            var InitIcon = function (jsonList, index, initClass, isFirstNode) {
                if (index + 1 == jsonList.length) {
                    if (jsonList.length == 1 && isFirstNode == true) {
                        //整个树只有一个节点的情况【特殊】
                        setting.switchClass = "";
                    } else {
                        //同级最后一个元素图标
                        setting.switchClass = "switch_bottom_" + initClass;
                    }
                    setting.ulClass = "";
                } else {
                    //同级中间元素图标
                    setting.switchClass = "switch_center_" + initClass;
                    setting.ulClass = "line";
                }
            }

            //根节点【isRootNode】首次加载判断
            var InitFirstIcon = function (jsonList, index) {
                //同级第一个元素图标
                if (index == 0) {
                    setting.switchClass = "switch_roots_close";
                    setting.ulClass = "line";
                }

                //本级目录只有一项显示图标【jsonList为一个值时】
                if (jsonList.length == 1) {
                    setting.switchClass = "switch_root_close";
                    setting.ulClass = "";
                }
            };

            //切换图标[beforeIcon:以前图标,thisIcon:当前图标]
            var InteractiveIcon = function ($this, beforeIcon, thisIcon) {
                if ($this.attr("class") == "switch_roots_" + beforeIcon) {
                    $this.attr("class", "switch_roots_" + thisIcon);
                } else if ($this.attr("class") == "switch_bottom_" + beforeIcon) {
                    $this.attr("class", "switch_bottom_" + thisIcon);
                } else if ($this.attr("class") == "switch_root_" + beforeIcon) {
                    $this.attr("class", "switch_root_" + thisIcon);
                } else if ($this.attr("class") == "switch_center_" + beforeIcon) {
                    $this.attr("class", "switch_center_" + thisIcon);
                }
            };
            
            //实现树节点的隐藏与显示
            function HideShowNode(switchNodeId) {
                //获取节点Id转换为对象
                thisObject = $("#" + switchNodeId);
                var currentDrageNodeId = switchNodeId.substring(0, switchNodeId.length - 7);
                var icoNodeId = "#" + currentDrageNodeId + "_ico"; 
				//文件夹图标打开与关闭
                var UlNodeId = "#" + currentDrageNodeId + "_ul";                

                //组合成ul为实现隐藏与显示 
                if ($(UlNodeId).is(":hidden")) {
                    //切换图标
                    InteractiveIcon(thisObject, "close", "open");
                    if ($(icoNodeId).attr("class") == "ico_close") {
                        $(icoNodeId).attr("class", "ico_open");
                    }

                    //滑入
                    $(UlNodeId).slideDown("fast");
                } else {
                    //切换图标
                    InteractiveIcon(thisObject, "open", "close");
                    if ($(icoNodeId).attr("class") == "ico_open") {
                        $(icoNodeId).attr("class", "ico_close");
                    }

                    //滑出
                    $(UlNodeId).slideUp("fast");
                }
            }

            //触发器实现节点的隐藏与显示
            function HideShowTrigger($switchId) {
                var strSwitchId = $switchId.substring(1, $switchId.length);
                $($switchId).bind("myEvent", function (event, messageObject) {
                    HideShowNode(messageObject);
                });
                $($switchId).trigger("myEvent", [strSwitchId]);

                //避免事件被多次绑定
                $($switchId).unbind("myEvent");
            }

            //当前节点在移动后按其原来的样式显示【原来是展开就展开，收缩则收缩】
            function CurrentNodeExpandContract($switchId) {
                if (SwitchBool) {
                    HideShowTrigger($switchId);
                    SwitchBool = false;
                }
            }

            //拖拽切换文件、文件夹图标
            function DragingInteractiveIcon(drageNodeClass, switchId, ulId, status) {
                //1.源根节点 2.目标当前父节点  3.源上个节点  4.目标上个节点  5.目标当前节点  6.源父节点
                switch (drageNodeClass) {
                    case "switch_root_open":
                        //4
                        if (status == "targetPrevNode") {
                            $(switchId).attr("class", "switch_roots_open");
                            $(ulId).attr("class", "line");
                        }

                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_roots_docu");
                        }
                        
                        break;
                    case "switch_root_close":
                        //4[不会执行，因为根节点为一个时不可能是关闭状态]
                        if (status == "targetPrevNode") {
                            $(switchId).attr("class", "switch_roots_close");
                            $(ulId).attr("class", "line");
                        }

                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_roots_docu");
                        }

                        break;
                    case "switch_roots_open":
                        //3
                        if (status == "sourcePrevNode") {
                            $(switchId).attr("class", "switch_root_open");
                            $(ulId).attr("class", "");
                        }
                        
                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_roots_docu");
                        }

                        break;
                    case "switch_roots_close":
                        //2
                        if (status == "targetCurrentParentNode") {                                                     
                            //涉及触发事件展开的问题
                              HideShowTrigger(switchId);
                            $(ulId).attr("class", "line");
                        }

                        //3
                        if (status == "sourcePrevNode") {
                            $(switchId).attr("class", "switch_root_close");
                            $(ulId).attr("class", "");
                        }

                        //5
                        if (status == "targetCurrentNode") {
                            $(switchId).attr("class", "switch_bottom_close");
                            $(ulId).attr("class", "");

                            //涉及触发事件展开的问题
                            CurrentNodeExpandContract(switchId);                            
                        }
                        
                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_roots_docu");
                        }

                        break;
                    case "switch_roots_docu":
                        //2
                        if (status == "targetCurrentParentNode") {
                            $(switchId).attr("class", "switch_roots_open");
                            $(ulId).attr("class", "line");
                        }

                        //5
                        if (status == "targetCurrentNode") {
                            $(switchId).attr("class", "switch_bottom_docu");
                        }

                        break;
                    case "switch_center_open":
                        //1
                        if (status == "sourceRootNextNode") {
                            $(switchId).attr("class", "switch_roots_open");
                        }

                        //3
                        if (status == "sourcePrevNode") {
                            $(switchId).attr("class", "switch_bottom_open");
                            $(ulId).attr("class", "");
                        }

                        //5
                        if (status == "targetCurrentNode") {
                            $(switchId).attr("class", "switch_bottom_open");
                            $(ulId).attr("class", "");
                        }

                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_center_docu");
                        }
                        break;
                    case "switch_center_close":
                        //1
                        if (status == "sourceRootNextNode") {
                            $(switchId).attr("class", "switch_roots_close");
                        }

                        //2
                        if (status == "targetCurrentParentNode") {
                            //涉及触发事件展开的问题
                            HideShowTrigger(switchId);
                            $(ulId).attr("class", "line");
                        }
                        
                        //3
                        if (status == "sourcePrevNode") {
                            $(switchId).attr("class", "switch_bottom_close");
                            $(ulId).attr("class", "");
                        }

                        //5
                        if (status == "targetCurrentNode") {
                            $(switchId).attr("class", "switch_bottom_close");
                            $(ulId).attr("class", "");

                            //涉及触发事件展开的问题
                            CurrentNodeExpandContract(switchId);                            
                        }

                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_center_docu");
                        }
                        break;
                    case "switch_center_docu":
                        //1
                        if (status == "sourceRootNextNode") {
                            $(switchId).attr("class", "switch_roots_docu");
                        }

                        //2
                        if (status == "targetCurrentParentNode") {
                            $(switchId).attr("class", "switch_center_open");
                            $(ulId).attr("class", "line");
                        }
                        
                        //3
                        if (status == "sourcePrevNode") {
                            $(switchId).attr("class", "switch_bottom_docu");
                        }

                        //5
                        if (status == "targetCurrentNode") {
                            $(switchId).attr("class", "switch_bottom_docu");
                        }
                        break;
                    case "switch_bottom_open":
                        //1
                        if (status == "sourceRootNextNode") {
                            $(switchId).attr("class", "switch_root_open");
                            $(ulId).attr("class", "");
                        }
                        
                        //4
                        if (status == "targetPrevNode") {
                            $(switchId).attr("class", "switch_center_open");
                            $(ulId).attr("class", "line");
                        }

                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_bottom_docu");
                        }
                        break;
                    case "switch_bottom_close":
                        //1
                        if (status == "sourceRootNextNode") {
                            $($nextSourceSwitchId).attr("class", "switch_root_close");
                            $($nextSourceUlId).attr("class", "");
                        }
                        
                        //2
                        if (status == "targetCurrentParentNode") {
                            //涉及触发事件展开的问题 
                            HideShowTrigger(switchId);
                        }

                        //4
                        if (status == "targetPrevNode") {
                            $(switchId).attr("class", "switch_center_close");
                            $(ulId).attr("class", "line");
                        }

                        //5
                        if (status == "targetCurrentNode") {
                            //涉及触发事件展开的问题
                            CurrentNodeExpandContract(switchId);                            
                        }

                        //6
                        if (status == "sourceParentNode") {
                            $(switchId).attr("class", "switch_bottom_docu");
                        }

                        break;
                    case "switch_root_docu":
                        //2
                        if (status == "targetCurrentParentNode") {
                            $(switchId).attr("class", "switch_root_open");
                            $(ulId).attr("class", "");
                        }

                        break;
                    case "switch_bottom_docu":
                        //1
                        if (status == "sourceRootNextNode") {
                            $(switchId).attr("class", "switch_root_docu");
                        }


                        //2
                        if (status == "targetCurrentParentNode") {
                            $(switchId).attr("class", "switch_bottom_open");
                            $(ulId).attr("class", "");
                        }

                        //4
                        if (status == "targetPrevNode") {
                            $(switchId).attr("class", "switch_center_docu");
                        }

                        break;
                }                


            }

            //拖拽至顶级节点判断
            function DragingToRoot(rootUlId, event, sourceParentUlId) {
                var offset = $(rootUlId).offset();
                var ulWidth = $(rootUlId).width();
                var ulHeight = $(rootUlId).height();

                if ((((offset.left + ulWidth - 10) < event.pageX) && (event.pageX < (offset.left + ulWidth))) && ((offset.top < event.pageY) && (event.pageY < (offset.top + ulHeight))) && sourceParentUlId != "treeDemo") {
                    //为顶级目录拖拽至顶级不显示样式,【即顶级不能再拖拽至顶级】
                    $(rootUlId).css({ "background-color": "#D2E9FF" });
                    isDrageToRoot = true;
                } else {
                    $(rootUlId).css({ "background-color": "white" });
                    isDrageToRoot = false;
                }
            }


            //拖拽优化整合
            function DragingIconIntegrate(nodeId,nodeType) {
                var $nodeSwitchId = "#" + nodeId + "_switch";
                var $nodeUlId = "#" + nodeId + "_ul";
                if (nodeType == "sourceParentNode") {
                    $nodeUlId = "";
                }                
                var nodeClass = $($nodeSwitchId).attr("class");
                DragingInteractiveIcon(nodeClass, $nodeSwitchId, $nodeUlId, nodeType);
            }


            var InitTreeView = function (jsonList, isFirstNode) {
                $.each(jsonList, function (index, term) {

                    if (!jsonList) return;

                    if (term.Link) {
                        ///图标加载
                        //1.当有子节点时图标关闭状态
                        InitIcon(jsonList, index, "close", isFirstNode);
                        //2.首节点
                        if (isFirstNode == true) {
                            //加载同级首节点的判断
                            InitFirstIcon(jsonList, index);
                        }
                        //3.有子节点为文件夹图标
                        setting.fileClass = "ico_close";


                        setting.treeString += InitTreeHtml(term.code, term.title, term.href, term.img, setting.switchClass, setting.fileClass);


                        isFirstNode = false;
                        setting.isDisplay = "display:none;";
                        setting.treeString += '<ul class="' + setting.ulClass + '" id="treeDemo_' + term.code + '_ul" style="' + setting.isDisplay + '">';

                        //递归寻找子目录
                        InitTreeView(term.Link, isFirstNode);

                        setting.treeString += '</ul>';
                    } else {
                        ///图标加载
                        //1.无子节点为文件图标
                        setting.fileClass = "ico_docu";
                        //2.最后子节点时显示文件图标
                        InitIcon(jsonList, index, "docu", isFirstNode);

                        setting.treeString += InitTreeHtml(term.code, term.title, term.href, term.img, setting.switchClass, setting.fileClass);
                    }

                    setting.treeString += '</li>';
                });
                return setting.treeString;
            };

            //2.初始化Tree目录【Main】
            var TreeView = InitTreeView(Lists, setting.isRootNode);
            $("#treeDemo").append(TreeView);
            $("span").contextMenu('folderMenu',
                    {
                        bindings :
                            {
                                'addFolder' : function(t) {
                                    AddFolder(t);
                                },
                                'deleteFolder' : function(t) {
                                    DeleteFolder($($(t).next()).attr("id"));
                                },
                                'renameFolder' : function(t) {
                                    RenameFolder(t);
                                },
                                'uploadFile' : function(t) {
                                    $("#overlay").empty();
                                    var upload_div = document.createElement("div");
                                    $(upload_div).attr("id", "upload");
                                    $(upload_div).appendTo("#overlay");
                                    var post_params =
                                        {
                                            folder : $($(t).next()).attr("id"),
                                            username : userInfo.userName
                                        };
                                    var upload_property =
                                        {
                                            width : 300,
                                            height : 300,
                                            multiple : true,
                                            file_types : "*.pdf",
                                            // file_types_description: "Web
                                            // Image Files",
                                            post_params : post_params,
                                            btn_add_text : "添加",
                                            btn_up_text : "上传",
                                            btn_cancel_text : "放弃",
                                            btn_clean_text : "清空",
                                            op_del_text : "单项删除",
                                            op_up_text : "单项上传",
                                            op_fail_text : "上传失败",
                                            op_ok_text : "上传成功",
                                            op_no_text : "取消上传",
                                            upload_url : "upload",
                                            flash_url : "/CloudPaper/swfupload.swf"
                                        };
                                    var create_ret = $.createGooUploader($("#upload"), upload_property);

                                    var back_input = document.createElement("input");
                                    $(back_input).attr("type", "button");
                                    $(back_input).attr("value", "返回");
                                    $(back_input).click(function() {
                                        document.getElementById('overlay').style.display = 'none';
                                        InitSystemTree();
                                        InitUserTree();
                                    })
                                    $(back_input).appendTo("#overlay");
                                    document.getElementById('overlay').style.display = 'block';
                                }
                            }
                    });

            //3.事件模块【Event】
            //单击隐藏与显示列表
            $('input[title="switch"]').click(function () {
                var $this = $(this);
                //获取单击button中的Id
                var SwitchNodeId = $this.attr("id");

                HideShowNode(SwitchNodeId);
            });            

            //单击a标签Dragging
            //实现思想：1.单击<a>标签时将<li>追加至<div> 2.<div>实现移动  3.释放时remove<div>
            //实现方法:1.mousedown 2.mousemove 3.mouseover 4.mouseup
            var currentAId="";
            var ZTreeMask = "";
            var $currentAId = "";
            var curentParentAId = "";
            var currentDrageNodeId = "";
            var currentDrageLiId = "";
            var currentDrageSwitchId = "";            

            $("a").mousedown(function (event) {
                currentAId = $(this).attr("id");
                $currentAId = "#" + currentAId;
                curentParentAId = $($currentAId).parent().parent().prev().attr("id");  //获取当前节点的父节点
                currentDrageNodeId = currentAId.substring(0, currentAId.length - 2);
                currentDrageLiId = "#" + currentDrageNodeId + "_li";
                currentDrageSwitchId = "#" + currentDrageNodeId + "_switch";

                //当前拖拽节点存在返回,可不要以防程序出现bug
                if ($("#zTreeMask_" + currentDrageNodeId).length > 0) return;  

                setting.startAxisX = event.clientX;
                setting.startAxisY = event.clientY;                

                //追加拖拽div
                ZTreeMask = "<div id='zTreeMask_" + currentDrageNodeId + "' class='dragingNode' style='top:" + setting.startAxisY + "px; left:" + setting.startAxisX + "px; width:" + $(this).width() + "px; height:" + $(this).height() + "px;'></div>";

                //单击树节点选中
                $("a").removeClass("curSelectedNode");
                $(this).attr("class", "curSelectedNode");
                                
            }).mouseover(function (e) {
                if ($(this).attr("class") != "curSelectedNode") {
                    $(this).attr("class", "tmpTargetTree");
                } 
            }).mouseout(function (e) {
                $(this).removeClass("tmpTargetTree");
            });
            

            var Bool = false;
            var tmpDragingNode = "";
            //拖拽时判断当前节点是否展开状态
            $(document).mousemove(function (event) {
                //除掉默认事件，防止文本被选择
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

                //节点拖拽移动的距离
                setting.moveAxisX = event.pageX - setting.startAxisX;
                setting.moveAxisY = event.pageY - setting.startAxisY;

                //避免鼠标误操作，对于第一次移动小于MinMoveSize时，不开启拖拽功能
                if (setting.moveAxisX < setting.MinMoveSize && setting.moveAxisY < setting.MinMoveSize) {
                    return;
                }

                //判断鼠标是否按下event.which==1在ie中不兼容 右键不能拖动NOT DO【更改为Bool判断】
                if (Bool) {                   
                    if ($("#zTreeMask_" + currentDrageNodeId).length == 0 && currentDrageNodeId != "") {
                        $("body").append(ZTreeMask);
                        $("#zTreeMask_" + currentDrageNodeId).append($($currentAId).clone());

                        //判断当前拖拽的节点为展开文件夹则先把文件夹收缩再拖拽【触发器实现】
                        var currentDrageIcoId = "#" + currentDrageNodeId + "_ico";
                        currentDrageSwitchId = currentDrageNodeId + "_switch";
                        if ($(currentDrageIcoId).attr("class") == "ico_open") {
                            HideShowTrigger("#" + currentDrageSwitchId);

                            SwitchBool = true;
                        }

                    }

                    //拖拽移动的距离
                    $("#zTreeMask_" + currentDrageNodeId).css({ "left": setting.startAxisX + setting.moveAxisX + "px", "top": setting.startAxisY + setting.moveAxisY + "px" });

                    //拖拽的目标节点 
                    if ($("#zTreeMask_" + currentDrageNodeId).length > 0) {
                        //绑定mouseover事件，鼠标键mouseup时要unbind（mouseover）
                        $("a").mouseover(function (e) {
                                                        
                            tmpDragingNode = $(this).attr("id");
                            //判断当移动目标父节点为本身源节点则不显示样式,目标父节点置为空
                            $(this).addClass("tmpTargetNode");                        

                        }).mouseout(function (e) {
                            $(this).removeClass("tmpTargetNode");
                        });
                    }                    
                    

                    //目标拖动至顶级节点【顶级拖拽至顶级不显示】显示样式,判断下级拖动至上级成为顶级节点【******】
                    var currentParentUlId = $(currentDrageLiId).parent().attr("id");
                    DragingToRoot("#treeDemo", event, currentParentUlId);                    

                };                               

            }).mousedown(function (e) {
                Bool = true;                
            }).mouseup(function (e) {
                Bool = false;
                if ($("#zTreeMask_" + currentDrageNodeId).length > 0) {
                    //释放移除临时拖动的节点
                    $("#zTreeMask_" + currentDrageNodeId).fadeOut().remove();

                    //源节点拖拽至目标节点代码  
                    //移上的节点加子节点
                    var tmpDragingNodeString = tmpDragingNode.substring(0, tmpDragingNode.length - 2);
                    var tmpDragingNodeSwitchId = tmpDragingNodeString + "_switch";
                    var tmpDragingNodeIcoId = tmpDragingNodeString + "_ico";
                    var tmpDragingNodeAId = tmpDragingNodeString + "_a";
                    var tmpDragingNodeUlId = tmpDragingNodeString + "_ul";

                    //获取当前拖拽的Li的父目录Ul
                    var currentParentUlId = $(currentDrageLiId).parent().attr("id");

                    if ((tmpDragingNode == currentAId || tmpDragingNode == "") && isDrageToRoot==false ) {
                        //临时移动目标节点为自己Id或为空不移动,【释放后原来是展开的仍展开，收缩的仍收缩】
                        CurrentNodeExpandContract("#" + tmpDragingNodeSwitchId);

                    } else {                                                                                              
                        //移动前：同级->在源节点当前拖拽时的前个元素下的switch图标更改                        
                        var currentParentNodeId = currentParentUlId.substring(0, currentParentUlId.length - 3);                        
                        var currentDrageSwitchClass1 = $("#" + currentDrageSwitchId).attr("class");

                        //在此同级上增加属性，以供后面判断，以免last会把其下的所有相同元素都会算上
                        $(currentDrageLiId).siblings("li").attr("title", "sibling");

                        var prevSourceLiId = $(currentDrageLiId).prev().attr("id");
                        var nextSourceLiId = $(currentDrageLiId).next().attr("id");                        
                        
                        if (isDrageToRoot) {
                            //子节点移至根节点实现
                            tmpDragingNodeUlId = "treeDemo";
                            $("#" + tmpDragingNodeUlId).append($(currentDrageLiId));

                            //移动前：同级->在源节点当前拖拽时的前个元素变为最后元素图标切换
                            var currentMoveLastLiId = "";
                            if (currentParentUlId) {
                                //获取同级最后一个元素 【没有最后元素的话父节点图标变空】要节点为treeDemo
                                currentMoveLastLiId = $('#' + currentParentUlId + ' li[title="sibling"]:last').attr("id"); 
                            }
                            
                        } else {
                            //判断不存在则UL追加
                            if ($("#" + tmpDragingNodeUlId).length == 0) {
                                var tmpDragingNodeUl = '<ul class="tree-node" id="' + tmpDragingNodeUlId + '"></ul>';
                                $("body").append(tmpDragingNodeUl);
                            }

                            //追加移动节点至ul并追加至要移上的节点
                            $("#" + tmpDragingNodeUlId).append($(currentDrageLiId)).insertAfter($("#" + tmpDragingNodeAId));


                            //移动前：同级->在源节点当前拖拽时的前个元素变为最后元素图标切换
                            var currentMoveLastLiId = "";
                            if (currentParentUlId) {
                                //获取同级最后一个元素 【没有最后元素的话父节点图标变空】要节点为treeDemo
                                currentMoveLastLiId = $('#' + currentParentUlId + ' li[title="sibling"]:last').attr("id");

                                //根顶部图标移动后，下个元素变为顶部元素
                                if (currentParentUlId == "treeDemo" && (currentDrageSwitchClass1 == "switch_roots_open" || currentDrageSwitchClass1 == "switch_roots_close" || currentDrageSwitchClass1 == "switch_roots_docu") && nextSourceLiId) {
                                    var nextSourceNodeId = nextSourceLiId.substring(0, nextSourceLiId.length - 3);
                                    var $nextSourceLiId = "#" + nextSourceLiId;
                                    DragingIconIntegrate(nextSourceNodeId, "sourceRootNextNode");
                                }
                            }

                            //移动后:目标父节点切换图标、文件夹图标【不能移入自身的子节点Bug,移动时收起】                            
                            var $tmpDragingNodeIcoId = "#" + tmpDragingNodeIcoId;                            
                            var dragNodeAInput = $("#" + tmpDragingNodeIcoId).attr("class");
                            DragingIconIntegrate(tmpDragingNodeString, "targetCurrentParentNode");
                            if (dragNodeAInput == "ico_close" || dragNodeAInput == "ico_docu") {
                                $($tmpDragingNodeIcoId).attr("class", "ico_open");
                            }
                            

                            //3.[原来]

                        }

                        //3.[原来]     
                        //同：移动后前个元素为最后一个元素才判断
                        if (prevSourceLiId && prevSourceLiId == currentMoveLastLiId) {
                            var prevSourceNodeId = prevSourceLiId.substring(0, prevSourceLiId.length - 3);
                            var $prevSourceLiId = "#" + prevSourceLiId;                           
                            DragingIconIntegrate(prevSourceNodeId, "sourcePrevNode");

                        } else {
                            //当前拖拽节点后，判断当前目录下是否有子节点，没有则父节点变为文件图标【拖至本身父节点下不改变图标】
                            if (currentParentNodeId != tmpDragingNodeString) {
                                if (!currentMoveLastLiId) {
                                    var currentParentIcoId = "#" + currentParentNodeId + "_ico";
                                    var currentParentIcoClass = $(currentParentIcoId).attr("class");
                                    DragingIconIntegrate(currentParentNodeId, "sourceParentNode");

                                    if (currentParentIcoClass == "ico_open" || currentParentIcoClass == "ico_close") {
                                        $(currentParentIcoId).attr("class", "ico_docu");
                                    }

                                }
                            }                            

                        }

                        //同：移动后：同级->移动目标节点后前个元素下的switch图标更改
                        var prevTargetLiId = $(currentDrageLiId).prev().attr("id");
                        if (prevTargetLiId) {
                            var prevTargetNodeId = prevTargetLiId.substring(0, prevTargetLiId.length - 3);
                            var $prevTargetLiId = "#" + prevTargetLiId;                           
                            DragingIconIntegrate(prevTargetNodeId, "targetPrevNode");
                        }

                        //同：2.判断当前节点为打开状态移入时也为打开状态 
                        //当前的节点为文件最后切换图标【判断为文件夹要添加收缩展开图标 DONE】
                        DragingIconIntegrate(currentDrageNodeId, "targetCurrentNode");

                    }                    

                    //移除事件，不然鼠标移上节点又显示原来拖拽时的样式 【移动后(移除)再移上鼠标不能显示样式bug NOTDO】
                    $("a").unbind("mouseover").unbind("mouseout");

                    //更新XML文档  【判断当没有移动时不更新】
                    var sourceParentId = currentParentNodeId.substring(9);
                    var targetParentId = tmpDragingNodeString.substring(9);
                    var currentDrageId = currentDrageNodeId.substring(9);
                }


                //清除空白处拖拽再次显示
                  currentDrageNodeId = "";
                //移动文件夹的同时移除样式
                  $("a").removeClass();                //$("a").removeClass("tmpTargetNode");
                  $("li").removeAttr("title");         //清空判断更改图标时的属性
                  

            });

        });