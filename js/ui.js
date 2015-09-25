function containment(elem) {
	$("#fake_containment").html("");

	$("#containment_boxes option").each(function(){
		pos = $(this).attr("data-pos").split(",");
		
		if(elem) {
			active = $(this).attr("value") == elem ? "active" : "";
		} else {
			active = $(this).attr("selected") == "selected" ? "active" : "";
		}

		id = $(this).val();

		container = "<div data-id='"+id+"' class='contained "+active+"' style='top:"+pos[0]+"px;right:"+pos[1]+"px;bottom:"+pos[2]+"px;left:"+pos[3]+"px;'></div>";
		$("#fake_containment").append(container);

		if(active) $("#containment").attr("style", "top:"+pos[0]+"px;right:"+pos[1]+"px;bottom:"+pos[2]+"px;left:"+pos[3]+"px;");
	});
}