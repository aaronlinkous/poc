function change_elems(elem) {
	$(".elem").removeClass("selected");
	$(elem).addClass("selected");
}

function edit_elem(elem) {
	$(".elem").removeClass("editing").attr("contenteditable", "false");
	$(elem).addClass("editing").attr("contenteditable", "true")

	$("#canvas").addClass("locked");
}

function elem_properties(elem) {
	properties = [elem.position(), elem.width(), elem.height()];

	return properties;
}

function add_elem(type) {
	count = type == "text" ? text_count++ : img_count++;
	editable = type == "text" ? "contenteditable='false'" : "";
	edit = "<div class='elem_edit' id='edit-"+type+"-"+count+"'>edit</div>";
	content = type == "text" ? "Edit Text" : "<img src='https://goo.gl/1mJdyp' />";

	elem = "<div "+editable+" class='elem "+type+"' id='"+type+"-"+count+"' unselectable='on'>"+content+"</div>"+edit;

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
		drag: function(event, ui) {
			change_elems(this)
		},
		stop: function(event, ui) {
			prop = elem_properties(elem);

			elem_t = prop[0].top - 20 +"px";
			elem_l = prop[0].left+"px";
			elem_w = prop[1]+"px";
			elem_h = prop[2]+"px";

			$("#edit-"+elem.attr("id")).css("left", elem_l).css("top", elem_t);
		}
	});

	if(elem.hasClass("img")) {
		elem.resizable({
			handles: "ne, se, sw, nw",
			containment: $containment,
			minWidth: 28,
			minHeight: 28
		});
	}
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

	//styling
	$("#text_size").on("input",function(){
		size = this.value;
		$(".selected").css("font-size", size+"px");
	});

	$("input[name='color']").click(function(){
		color = this.value;
		$(".selected").css("color", color);
	});

});