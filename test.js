$(document).ready(function(){
	console.log("加载完成");

	$(document).click(function(e){
		 // window.nzEditorInspector.start(e.target);
		 var path = OptimalSelect.getSingleSelector(e.target,{root:document});
		 console.log(path);
	})
})