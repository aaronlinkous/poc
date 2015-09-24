function build() {
	$("#containment option").each(function(){
		pos = $(this).attr("data-pos").split(",");
		active = $(this).attr("selected") == "selected" ? "active" : "";
		id = $(this).val();

		container = "<div data-id='"+id+"' class='contained "+active+"' style='top:"+pos[0]+"px;right:"+pos[1]+"px;bottom:"+pos[2]+"px;left:"+pos[3]+"px;'></div>";
		$("#canvas").append(container)
	});
}