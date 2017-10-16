function LiSort(id){
	var select="#"+id+" > li";
	var lis=$(select);
	lis.sort(function(a,b){
		var text_a=$(a).find("span:first").html();
		var text_b=$(b).find("span:first").html();
		return text_a<text_b?-1:1;
	});
	$("#"+id).empty();
	for(var i=0;i<lis.length;i++){
		$("#"+id).append(lis[i]);
	}
	for(var i=0;i<lis.length;i++){
		LiSort($($(lis[i]).find("ul:first")).attr("id"));
		LiSort($($(lis[i]).find("ul:last")).attr("id"));
	}
}

function InitMenu(){
	$.ajax({
        url:"menutree_initTree",
        data:{
        	"userName":"usertree"
        },
        dataType:'json',
        type:'post',  
        async: false,  
        success:function(data){
          var d = eval("("+data+")");
          var root=document.createElement("ul");
  	      $(root).attr("id","root");
  	      var container = new Object();
  	      var pathes=d["pathes"];
  	      $.each(pathes, function (i, record){
  		       var path = record["path"];
  		       var nodes = path.split('>');
  		       var last_node = (nodes[nodes.length-1].split('*'))[0];
  		       var pdf_or_url = (nodes[nodes.length-1].split('*'))[1];
  		       nodes[nodes.length-1] = last_node;
  		       var pre_node_name = "";
  		       var cur_node_name = "";
  		       for(var j=0;j<nodes.length;j++){
  		    	   if(j==0){
  		    		   cur_node_name=nodes[j];
  		    	   }else{
  		    		   cur_node_name=pre_node_name + ">" + nodes[j];
  		    	   }
  		    	   if(container[cur_node_name + "folders"]==undefined && j==0){
  		    		   var li = document.createElement("li");
  		    		   var span = document.createElement("span");
  		    		   var text = document.createTextNode(nodes[j]);
  		    		   container[cur_node_name + "folders"]=document.createElement("ul");
  		    		   container[cur_node_name + "files"]=document.createElement("ul");
  		    		   $(container[cur_node_name + "folders"]).attr("id",cur_node_name + "folders");
  		    		   $(container[cur_node_name + "files"]).attr("id",cur_node_name + "files");
  		    		   span.appendChild(text);
  		    		   $(span).attr("class","folder");
  		    		   li.appendChild(span);
  		    		   $(li).attr("class","closed");
  		    		   li.appendChild(container[cur_node_name + "folders"]);
  		    		   li.appendChild(container[cur_node_name + "files"]);
  		    		   $(root).prepend(li);
  		    		   pre_node_name=cur_node_name;
  		    	   }else if(container[cur_node_name + "folders"]==undefined){
  		    		   var li = document.createElement("li");
  		    		   var span = document.createElement("span");
  		    		   var text = document.createTextNode(nodes[j]);
  		    		   container[cur_node_name + "folders"]=document.createElement("ul");
  		    		   container[cur_node_name + "files"]=document.createElement("ul");
  		    		   $(container[cur_node_name + "folders"]).attr("id",cur_node_name + "folders");
  		    		   $(container[cur_node_name + "files"]).attr("id",cur_node_name + "files");
  		    		   span.appendChild(text);
  		    		   $(span).attr("class","folder");
  		    		   li.appendChild(span);
  		    		   $(li).attr("class","closed");
  		    		   li.appendChild(container[cur_node_name + "folders"]);
  		    		   li.appendChild(container[cur_node_name + "files"]);
  		    		   $(container[pre_node_name + "folders"]).prepend(li);
  		    		   pre_node_name=cur_node_name;
  		    	   }else{
  		    		   pre_node_name=cur_node_name;
  		    	   }
  		       }
  		       if(pdf_or_url!=undefined){
  			       var li = document.createElement("li");
  			       var span = document.createElement("span");
  			       var text = document.createTextNode(pdf_or_url);
  			       span.appendChild(text);
  			       $(span).attr("class","file");
  			       li.appendChild(span);
  			       container[pre_node_name + "files"].appendChild(li);
  		       }
  	      	})
  	      	$("#tree").empty();
  	        $(root).appendTo("#tree");
  	        LiSort("root");
  	        $("#tree").treeview({
  	        	 persist: "location",
  		    	 add: root
  		    });
  	        $("span.folder").contextMenu('folderMenu', 
    	        {
  	          bindings: 
  	          {
  	            'addFolder': function(t) {
  	            	alert($($(t).next()).attr("id"));
  	            },
  	            'deleteFolder': function(t) {
  	            	DeleteFolder($($(t).next()).attr("id"));
  	            },
  	            'package': function(t) {
  	              alert('Trigger was '+t.id+'\nAction was package');
  	            },
  	            'close': function(t) {
  	              alert('Trigger was '+t.id+'\nAction was close');
  	            }
    	      }
  	    });
        },
       error:function () {alert("error");}
     });
}

function AddFolder(){
	
}

function DeleteFolder(folderName){
	$.ajax({
        url:"menutree_deleteFolder",
        data:{
        	"folderName":folderName
        },
        dataType:'json',
        type:'post',  
        async: false,  
        success:function(data){
           InitMenu();
        },
       error:function () {alert("error");}
     });
}

$(document).ready(function(){
	InitMenu();
});