/*�ļ��ϴ��ؼ�--GooUploader��*/
//Div :Ҫ���󶨵��ѱ�JQUERY��װ��DOM���󣬱���Ҫ����ID
//property  :JSON������Progress����ϸ��������
function GooUploader(Div,property){
    this.$multiple=false;
    if(property.multiple) this.$multiple=property.multiple;	// �ؼ��Ƿ�֧�������ļ��ϴ���Ĭ��Ϊֻ֧���ϴ�����
	this.$div=Div;								// �ؼ���DIV���
	this.$width=property.width||300;			// �ؼ��Ŀ�ȣ�Ĭ��Ϊ300
	this.$height=property.height||36;			// �ؼ��ĸ߶ȣ�Ĭ��Ϊ30
	// ��Ⱦthis.$div
	this.$div.addClass("Uploader").css({width:this.$width-4+"px",height:this.$height-4+"px"});
	this.$div.append("<div class='total_bg'><div class='oper' style='width:"+(this.$width-14)+"px;'></div>"+
					"<div class='content' style='height:"+(this.$height>36?(this.$height-40):30)+"px;width:"+
					(this.$multiple?(this.$width-16):(this.$width-6))+"px;"+(this.$multiple?"":"margin:0px;")+"'></div></div>");
	this.$btn_add=$("<div class='upload_btn' style='margin-right:4px;'><div class='left'></div><div><b class='add'>"+(property.btn_add_text||"Add")+"</b></div><div class='right'></div><div id='"+this.$div.attr("id")+"_addFile'></div></div>");
	this.$div_btn=this.$div.children("div").children(".oper");
    this.$div_btn.append(this.$btn_add);
    this.$content=this.$div.children("div").children(".content");
    this.$goon=null;// �������Ϊ�գ����ʾҪ�����ϴ����б��������ļ���
	// ��ʼ��swf���
	this.$swfUpload=new SWFUpload({
		upload_url : property.upload_url||"",// upload_url��·���ȱ����������SWF������ڵ�·���������Ǿ���·��
		flash_url : property.flash_url||"swfupload.swf",// SWF�������·��
		file_size_limit : property.file_size_limit||0,// �ļ���С���ƣ���λΪKB��0��ʾ��С������
		file_upload_limit: property.file_upload_limit||0,// �����ϴ�������ļ�����,0��ʾ��С������
		post_params:property.post_params||null,// ������AJAX���������õĴ��Σ���ʽһ��
		file_types:property.file_types||"*.*",// ���ϴ����ļ����ͣ�����*.jpg,*.gif�����÷ֺŸ���
        file_types_description: property.file_types_description||"All Files",// ���ϴ����ļ�������������
        file_queue_limit:property.file_queue_limit||0,
		button_width: "68",
		button_height: "20",
		button_placeholder_id : this.$div.attr("id")+"_addFile",
        button_cursor : SWFUpload.CURSOR.HAND,
        button_action : (this.$multiple? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE),
        button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT
	});
	if(this.$multiple){// �����֧�������ϴ�����Ҫ�ඨ����������ť
		this.$btn_upload=$("<div class='upload_btn'><div class='left'></div><div><b class='upload'>"+(property.btn_up_text||"Upload")+"</b></div><div class='right'></div></div>");
        this.$btn_cancel=$("<div class='upload_btn' style='display:none'><div class='left'></div><div><b class='cancel'>"+(property.btn_cancel_text||"Cancel")+"</b></div><div class='right'></div></div>");
		this.$btn_clean=$("<div class='upload_btn' style='float:right'><div class='left'></div><div><b class='clean'>"+(property.btn_clean_text||"Clean")+"</b></div><div class='right'></div></div>");
		this.$btn_back=$("<div class='upload_btn' style='float:right'><div class='left'></div><div><b class='clean'>"+"返回"+"</b></div><div class='right'></div></div>");
		this.$div_btn.append(this.$btn_upload).append(this.$btn_cancel).append(this.$btn_clean).append(this.$btn_back);
	}
    // this.$maxQueueNum=property.file_queue_limit||0;//������ļ���������ȣ�������ͬʱ�ϴ����ٸ��ļ���
    // �����ļ����ͣ��ж�Ӧ����������ʽ
    this.fixFileTypeIcon=function(type){
       var tmp = type.split(".");
       if(tmp[1])   tmp[1]=tmp[1].substring(0,3).toLowerCase();
       else return "";
       switch(tmp[1]){
           case "doc": return "doc";   case "wps": return "doc";
           case "zip": return "zip";   case "rar": return "zip";   case "ace": return "zip";   case "7z": return "zip";
           case "swf": return "swf";   case "fla": return "swf";
           case "rmv": return "dvd";   case "rm": return "dvd";   case "wmv": return "dvd";   case "avi": return "dvd";   case "mpg": return "dvd";
           case "chm": return "book";   case "pdf": return "book";
           case "ppt": return "ppt";   case "xls": return "xls";
           case "exe": return "exe";   case "bat": return "exe";
           case "cpp": return "scr";   case "js": return "scr";   case "jav": return "scr";   case "css": return "scr";
           case "cs": return "scr";   case "h": return "scr";   case "cgi": return "scr";
           case "jpg": return "img";   case "gif": return "img";   case "png": return "img";   case "psd": return "img";   case "bmp": return "img";
           case "htm": return "htm";   case "xml": return "htm";   case "xht": return "htm";   case "sht": return "htm";
           case "asp": return "htm";   case "jsp": return "htm";   case "php": return "htm";   case "txt": return "txt";
           case "cfg": return "cfg";   case "dll": return "cfg";   case "ini": return "cfg";
           case "mp3": return "mp3";   case "wma": return "mp3";   case "ape": return "mp3";   case "wav": return "mp3";   case "mid": return "mp3";
           default: return "oth";
       }
    };
    // ���ݴ�����ļ��ֽڴ�С,�Զ�ת��ΪKB,MB,GB�ȵ�λ
    this.getFileSize=function(bytes){
        var size=(bytes/1024).toFixed(1);// ��תΪKB
        if(size>1200){
            size=(size/1024).toFixed(1);// ��תΪMB
            if(size>1200){
                size=(size/1024).toFixed(1);// ��תΪGB
                return size+"g";
            }
            return size+"m";
        }
        return size+"k";
    }
    this.$fileList=[];// �����ļ���Ϣ���б�
    var inthis=this;
    // ��ȡ�ϴ��б��е������ļ������ö��Ÿ���
    this.getFileNames=function(){
        var str="";
        for(var key in this.$fileList){
            str+=this.$fileList[key].name+",";
        }
        if(str.indexOf(",")>-1) return str.substring(0,str.length-1);
        else return str;
    }
    this.$swfUpload.fileQueued=function(file){
       if(!inthis.$multiple){
          inthis.$div_btn.css({height:"0px","padding-top":"0px"});
           inthis.$content.css("display","block");
       }
        // var max=inthis.$fileList.length;
        var id=file.id;
        inthis.$fileList[id]={
            id:file.id,
            name:file.name,
            size:inthis.getFileSize(file.size),// ��λĬ��ΪKB��С�����һλ
            filestatus:file.filestatus
        }
       inthis.$content.append("<li id="+file.id+" style='width;"+(inthis.$content.attr("offsetWidth")-18)+"px'><b class='"+inthis.fixFileTypeIcon(file.type)+"'></b><div class='labe' title='"
           +file.name+" ("+inthis.$fileList[id].size+")'><div class='file' style='width:"+(inthis.$content.attr("offsetWidth")-85)+"px'>"
           +(inthis.$fileList[id].name.length>16? inthis.$fileList[id].name.substring(0,13)+"..." : inthis.$fileList[id].name)
           +" ("+inthis.$fileList[id].size+")"
           +"</div><div class='unbar'><div></div></div></div><span></span><b class='op_del' title='"+(property.op_del_text||"Del Item")+"' style='display:block'></b>"
           +"<b class='op_up' title='"+(property.op_up_text||"Upload Item")+"' style='display:block'></b><b class='op_ok' title='"+(property.op_ok_text||"Upload Success")+"'></b>"
           +"<b class='op_no' title='"+(property.op_no_text||"Cancel Item")+"'></b><b class='op_fail' title='"+(property.op_fail_text||"Cancel Item")+"'></b></li>");
       inthis.$fileList[id].bar=inthis.$content.children("#"+file.id).children("div").children(".unbar");
       inthis.$fileList[id].span=inthis.$content.children("#"+file.id).children("span");
    };
    this.$swfUpload.uploadSuccess=function(file,msg){
        var id=file.id;
        inthis.$fileList[id].span.html("100%");
        var li=inthis.$content.children("#"+id);
        li.children(".op_no").css("display","none");
        li.children(".op_ok").css("display","block");
    };
    this.$swfUpload.uploadError=function(file,code,msg){
        var li=inthis.$content.children("#"+file.id);
        li.children(".op_no").css("display","none");
        li.children(".op_fail").css("display","block");
    };
    this.$swfUpload.uploadComplete=function(file){
        while(inthis.$goon){
            var li=inthis.$content.children("#"+file.id).next("li");
            inthis.$goon=li.attr("id");
            if(li.children(".op_up").css("display")=="block"){
                li.children(".op_up").click();
                break;
            }
        }
        if((!inthis.$goon)&&inthis.$multiple){
            inthis.$btn_upload.css({display:"block"});
            inthis.$btn_cancel.css({display:"none"});
        }
    };
    this.$swfUpload.uploadProgress=function(file,complete,total){
        var per=Math.floor((complete/total)*100);
        inthis.$fileList[file.id].span.html(per+"%");
        inthis.$fileList[file.id].bar.children("div").width(140*((100-per)/100));// BARΪ���������ܳ���
    };
    
    if(this.$multiple){
      this.$btn_upload.bind("click",{content:this.$content,fileList:this.$fileList,cancel:this.$btn_cancel},function(e){
        for(var key in e.data.fileList){
            var li=e.data.content.children("#"+key);
            if(li.children(".op_up").css("display")=="block"){
                inthis.$goon=li.attr("id");
                li.children(".op_up").click();
                this.style.display="none";
                e.data.cancel.css({display:"block"});
                break;
            }
        }
      });
      this.$btn_cancel.bind("click",{content:this.$content,fileList:this.$fileList},function(e){
        for(var key in e.data.fileList){
            var li=e.data.content.children("#"+key);
            if(li.children(".op_up").css("display")=="block"){
                li.children(".op_up").css("display","none");
                li.children(".op_del").css("display","none");
                li.children(".op_no").click();
            }
            else if(li.children(".op_no").css("display")=="block"){// ����������ϴ��е�
                li.children(".op_no").click();
            }
        }
      });
      this.$btn_clean.bind("click",{swfUpload:this.$swfUpload,content:this.$content,fileList:this.$fileList},function(e){
        if(e.data.swfUpload.getStats().in_progress==0){// �����ǰû���ļ����ϴ�
            for(var key in e.data.fileList){
                e.data.content.children("#"+key).remove();
                e.data.fileList[key]=null;
            }
        }
      });
      this.$btn_back.bind("click",function(e){
        document.getElementById('overlay').style.display = 'none';
        InitSystemTree();
        InitUserTree();
      });
    }
    // ���ļ��б��У�ÿһ�еİ�ť
    this.$content.bind("click",{swfUpload:this.$swfUpload,oper:this.$div_btn,multi:this.$multiple,fileList:this.$fileList},function(e){
        if(!e)	e=window.event;
        if(e.target.tagName=="B"){
            var tar=$(e.target);
            var li=li=tar.parent();
            var cls=tar.attr("className");
            var id=li.attr("id");
            switch(cls){
                case "op_up":
                    if(e.data.swfUpload.getStats().in_progress==0){// �����ǰû���ļ����ϴ�
                    var fileList=e.data.fileList;
                    fileList[id].bar.removeClass("unbar");
                    fileList[id].bar.addClass("bar");
                    fileList[id].span.html("0%");
                    try{
                    e.data.swfUpload.startUpload(id);
                    }catch(ex){alert(ex)}
                    tar.css("display","none");
                    li.children(".op_del").css("display","none");
                    li.children(".op_no").css("display","block");
                    }
                    break;// �ϴ�
                case "op_del":
                    try{
                    e.data.swfUpload.cancelUpload(id);
                    }catch(ex){alert(ex)}
                    if(!e.data.multi){
                        e.data.oper.css({height:"20px","padding-top":"5px"});
                        this.style.display="none";
                    }
                    li.remove();
                    e.data.fileList[id]=null;
                    break;// ���б���ɾ��
                case "op_ok":
                    if(!e.data.multi){
                        e.data.oper.css({height:"20px","padding-top":"5px"});
                        this.style.display="none";
                    }
                    e.data.swfUpload.cancelUpload(id);
                    e.data.fileList[id]=null;
                    li.remove();
                    break;// �ϴ��ɹ�
                case "op_no":
                    e.data.swfUpload.cancelUpload(id);
                    tar.css("display","none");
                    li.children(".op_fail").css("display","block");
                  break;// �û�ȡ��
                case "op_fail":
                    if(!e.data.multi){
                        e.data.oper.css({height:"20px","padding-top":"5px"});
                        this.style.display="none";
                    }
                    li.remove();
                    e.data.fileList[id]=null;
                    break;// �ϴ�ʧ��
            }
        }
    });
    if(!this.$multiple)	this.$content.css("display","none");
}

// ������Ĺ��캯��������JQUERY������
jQuery.extend({
	createGooUploader: function(Div,property) {
		return new GooUploader(Div,property);
  }
});