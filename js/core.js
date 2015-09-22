function change_elems(elem) {
	$(".elem").removeClass("selected");
	$(elem).addClass("selected");
}

function edit_elem(elem) {
	$(".elem").removeClass("editing");
	$(elem).addClass("editing");
}

function add_elem(type) {
	count = type == "text" ? text_count++ : img_count++;
	editable = type == "text" ? "contenteditable='false'" : "";
	content = type == "text" ? "Edit Text <span>edit</span>" : "<button></button";

	elem = "<div "+editable+" class='elem "+type+"' id='"+type+"-"+count+"' unselectable='on'>"+content+"</div>";

	$containment.append(elem);
	activate_elem($("#"+type+"-"+count));
}

function activate_elem(elem) {
	change_elems(elem);
	
	elem.draggable({
		cursor: "move",
		containment: $containment,
		scroll: false,
		cancel: ".editing",
		stack: ".elem",
		snap: true,

		drag: function(event, ui){
			change_elems(this)
		}
	}).resizable({
		handles: "ne, se, sw, nw",
		containment: $containment
	});
}

var text_count = 0, img_count = 0;
var $containment = $("#constrained");

$(document).ready(function(){

	$(".add_elem").click(function(){
		type = $(this).data("type");
		add_elem(type);
	});

	$("#canvas").on("click", ".elem", function(){
		activate_elem($(this));
	});

	$("#canvas").on("click", ".edit", function(){
		activate_elem($(this));
		edit_elem($(this));
	});

});