function LiSort(id) {
    var select = "#" + id + " > li";
    var lis = $(select);
    lis.sort(function(a, b) {
	var text_a = $(a).find("span:first").html();
	var text_b = $(b).find("span:first").html();
	return text_a < text_b ? -1 : 1;
    });
    $("#" + id).empty();
    for (var i = 0; i < lis.length; i++) {
	$("#" + id).append(lis[i]);
    }
    for (var i = 0; i < lis.length; i++) {
	LiSort($($(lis[i]).find("ul:first")).attr("id"));
	LiSort($($(lis[i]).find("ul:last")).attr("id"));
    }
}

function InitMenu() {
    $.ajax({
	url : "menutree_initTree",
	data : {
	    "userName" : "usertree"
	},
	dataType : 'json',
	type : 'post',
	async : false,
	success : function(data) {
	    var d = eval("(" + data + ")");
	    var root = document.createElement("ul");
	    $(root).attr("id", "root");
	    var container = new Object();
	    var pathes = d["pathes"];
	    $.each(
	    pathes,
	    function(i, record) {
		var path = record["path"];
		var nodes = path.split('>');
		var last_node = (nodes[nodes.length - 1]
			.split('*'))[0];
		var pdf_or_url = (nodes[nodes.length - 1]
			.split('*'))[1];
		nodes[nodes.length - 1] = last_node;
		var pre_node_name = "";
		var cur_node_name = "";
		for (var j = 0; j < nodes.length; j++) {
		    if (j == 0) {
			cur_node_name = nodes[j];
		    } else {
			cur_node_name = pre_node_name + ">"
				+ nodes[j];
		    }
		    if (container[cur_node_name + "folders"] == undefined
			    && j == 0) {
			var li = document.createElement("li");
			var span = document.createElement("span");
			var text = document.createTextNode(nodes[j]);
			container[cur_node_name + "folders"] = document.createElement("ul");
			container[cur_node_name + "files"] = document.createElement("ul");
			$(container[cur_node_name + "folders"]).attr("id",cur_node_name + "folders");
			$(container[cur_node_name + "files"]).attr("id",cur_node_name + "files");
			span.appendChild(text);
			$(span).attr("class", "folder");
			li.appendChild(span);
			//$(li).attr("class", "closed");
			li.appendChild(container[cur_node_name + "folders"]);
			li.appendChild(container[cur_node_name + "files"]);
			$(root).prepend(li);
			pre_node_name = cur_node_name;
		    } else if (container[cur_node_name
			    + "folders"] == undefined) {
			var li = document.createElement("li");
			var span = document.createElement("span");
			var text = document.createTextNode(nodes[j]);
			container[cur_node_name + "folders"] = document.createElement("ul");
			container[cur_node_name + "files"] = document.createElement("ul");
			$(container[cur_node_name + "folders"])
				.attr("id",
					cur_node_name + "folders");
			$(container[cur_node_name + "files"]).attr("id",cur_node_name + "files");
			span.appendChild(text);
			$(span).attr("class", "folder");
			li.appendChild(span);
			$(li).attr("class", "closed");
			li.appendChild(container[cur_node_name+ "folders"]);
			li.appendChild(container[cur_node_name+ "files"]);
			$(container[pre_node_name + "folders"]).prepend(li);
			pre_node_name = cur_node_name;
		    } else {
			pre_node_name = cur_node_name;
		    }
		}
		if (pdf_or_url != undefined) {
		    var li = document.createElement("li");
		    var span = document.createElement("span");
		    var text = document
			    .createTextNode(pdf_or_url);
		    span.appendChild(text);
		    $(span).attr("class", "file");
		    li.appendChild(span);
		    container[pre_node_name + "files"]
			    .appendChild(li);
		}
	    })
	    $("#tree").empty();
	    $(root).appendTo("#tree");
	    LiSort("root");
	    $.cookie('menuState');
	    $("#tree").treeview({
		persist : "cookie",
		cookieId: "menuState",
		cookieOptions : {
		    path : '/'
		},
		collapsed:"true",
		add : root
	    });
	    $("span.folder").contextMenu('folderMenu', {
		bindings : {
		    'addFolder' : function(t) {
			AddFolder(t);
		    },
		    'deleteFolder' : function(t) {
			DeleteFolder($($(t).next()).attr("id"));
		    },
		    'changeFolderName' : function(t) {
			ChangeFolderName(t);
		    },
		    'close' : function(t) {
			alert('Trigger was ' + t.id + '\nAction was close');
		    }
		}
	    });
	},
	error : function() {
	    alert("error");
	}
    });
}

function AddFolder(t) {
    //$($(t).next()).slideToggle(500);
    var input = document.createElement("input");
    $($(t).next()).prepend(input);
    $(input).keydown(function(e) {
	if (e.keyCode == 13) {
	    var addFolderName = $(input).val();
	    $.ajax({
		url : "menutree_addFolder",
		data : {
		    "addFolderName" : addFolderName,
		    "addParentName" : $($(t).next()).attr("id")
		},
		dataType : 'json',
		type : 'post',
		async : false,
		success : function(data) {
		    if (data == "complete") {
			InitMenu();
		    } else if (data == "exist") {
			alert("exist");
		    }
		},
		error : function() {
		    alert("error");
		}
	    });
	}
    })
}

function DeleteFolder(deleteFolderName) {
    $.ajax({
	url : "menutree_deleteFolder",
	data : {
	    "deleteFolderName" : deleteFolderName
	},
	dataType : 'json',
	type : 'post',
	async : false,
	success : function(data) {
	    InitMenu();
	},
	error : function() {
	    alert("error");
	}
    });
}

function ChangeFolderName(t) {
    //$($(t).next()).slideToggle(500);
    var input = document.createElement("input");
    $($(t).next()).prepend(input);
    $(input).keydown(function(e) {
	if (e.keyCode == 13) {
	    var renameNewFolderName = $(input).val();
	    $.ajax({
		url : "menutree_renameFolderName",
		data : {
		    "renameNewFolderName" : renameNewFolderName,
		    "renameOldFolderName" : $($(t).next()).attr("id")
		},
		dataType : 'json',
		type : 'post',
		async : false,
		success : function(data) {
		    if (data == "complete") {
			InitMenu();
		    } else if (data == "exist") {
			alert("exist");
		    }
		},
		error : function() {
		    alert("error");
		}
	    });
	}
    })
}

$(document).ready(function() {
    InitMenu();
});