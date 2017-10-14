function li_sort(ul){
	var arr = $(ul).children();
	alert(arr.length);
	for(var i=0;i<arr.length;i++){
		alert($(arr[i]).text());
	}
}

$(document).ready(function(){
	$.getJSON("config/usertree.json", function (data){
	      var tree=document.createElement("ul");
	      var container = new Object();
	      $.each(data, function (i, record){
		       var path = record["path"];
		       var nodes = path.split('/');
		       var last_node = (nodes[nodes.length-1].split('*'))[0];
		       var pdf_or_url = (nodes[nodes.length-1].split('*'))[1];
		       nodes[nodes.length-1] = last_node;
		       var pre_node_name = "";
		       var cur_node_name = "";
		       for(var j=0;j<nodes.length;j++){
		    	   if(j==0){
		    		   cur_node_name=nodes[j];
		    	   }else{
		    		   cur_node_name=pre_node_name + "_" + nodes[j];
		    	   }
		    	   if(container[cur_node_name]==undefined && j==0){
		    		   var li = document.createElement("li");
		    		   var span = document.createElement("span");
		    		   var text = document.createTextNode(nodes[j]);
		    		   container[cur_node_name]=document.createElement("ul");
		    		   span.appendChild(text);
		    		   $(span).attr("class","folder");
		    		   li.appendChild(span);
		    		   $(li).attr("class","closed");
		    		   li.appendChild(container[cur_node_name]);
		    		   $(tree).prepend(li);
		    		   pre_node_name=cur_node_name;
		    	   }else if(container[cur_node_name]==undefined){
		    		   var li = document.createElement("li");
		    		   var span = document.createElement("span");
		    		   var text = document.createTextNode(nodes[j]);
		    		   container[cur_node_name]=document.createElement("ul");
		    		   span.appendChild(text);
		    		   $(span).attr("class","folder");
		    		   li.appendChild(span);
		    		   $(li).attr("class","closed");
		    		   li.appendChild(container[cur_node_name]);
		    		   $(container[pre_node_name]).prepend(li);
		    		   pre_node_name=cur_node_name;
		    	   }else{
		    		   pre_node_name=cur_node_name;
		    	   }
		       }
		       var li = document.createElement("li");
		       var span = document.createElement("span");
		       var text = document.createTextNode(pdf_or_url);
		       span.appendChild(text);
		       $(span).attr("class","file");
		       li.appendChild(span);
		       container[pre_node_name].appendChild(li);
	      	})
	        $(tree).appendTo("#tree");
	        $("#tree").treeview({
		    	 add: tree
		    });
	    });
});