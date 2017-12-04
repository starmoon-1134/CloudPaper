<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>  
<head lang="en">  
    <meta charset="UTF-8">  
    <title>JTopo 教程</title>  
    <script src="http://libs.baidu.com/jquery/1.5.2/jquery.min.js"></script>
    <script src="js/jtopo-0.4.8.js" type="text/javascript"></script>  
    <script type="text/javascript">
    $(document).ready(function(){					
			var canvas = document.getElementById('canvas');
			var stage = new JTopo.Stage(canvas);

			var scene = new JTopo.Scene();
			stage.add(scene);
			
			var cloudNode = new JTopo.Node('root');
			cloudNode.setSize(30, 26);
			cloudNode.setLocation(460, 280);			
			cloudNode.layout = {type: 'circle', radius: 160};
			
			scene.add(cloudNode);
			
			for(var i=0; i<3; i++){
				var node = new JTopo.CircleNode('host' + i);
				node.fillStyle = '200,255,0';
				node.radius = 15;
				node.setLocation(scene.width * Math.random(), scene.height * Math.random());
				if(i == 2){
					node.layout = {type: 'tree', direction: 'top', width: 50, height: 90};
				}else if(i == 1){
					node.layout = {type: 'tree', direction: 'left', width: 50, height: 90};
				}else{
					node.layout = {type: 'circle', radius: 60};
				}
				
				
				scene.add(node);								
				var link = new JTopo.Link(cloudNode, node);
				scene.add(link);
				
				for(var j=0; j<6; j++){
					var vmNode = new JTopo.CircleNode('vm-' + i + '-' + j);
					vmNode.radius = 10;
					vmNode.fillStyle = '255,255,0';
					vmNode.setLocation(scene.width * Math.random(), scene.height * Math.random());
					scene.add(vmNode);								
					scene.add(new JTopo.Link(node, vmNode));							
				}
			}

			JTopo.layout.layoutNode(scene, cloudNode, true);
			
			scene.addEventListener('mouseup', function(e){
				if(e.target && e.target.layout){
					JTopo.layout.layoutNode(scene, e.target, true);	
				}				
			});
		});  
    </script>  
</head>  
<body>  
     <canvas id="canvas" width="300" height="200"></canvas>  
</body>  
</html> 