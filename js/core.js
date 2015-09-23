function change_elems(elem) {
	$(".elem").removeClass("selected");
	$(elem).addClass("selected");
}

function edit_elem(elem) {
	elem_id = elem.attr("id").replace("edit-","");

	$(".elem").removeClass("editing").attr("contenteditable", "false");
	$canvas.toggleClass("locked");

	if(editing == 0) {
		editing = 1;
	
		$(elem).html("Apply");
	
		$("#"+elem_id).addClass("editing").attr("contenteditable", "true");
	
	} else {
		editing = 0;

		$(elem).html("Edit");
	}
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
		cancel: ".locked .elem",
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

var editing = 0;
var text_count = 0, img_count = 0;
var $containment = $("#constrained");
var $canvas = $("#canvas");

$(document).ready(function(){

	$(".add_elem").click(function(){
		type = $(this).data("type");
		add_elem(type);
	});

	$containment.on("click", ".elem", function(){
		if(editing == 0) {
			activate_elem($(this));
		} else if(!$(this).hasClass("selected")) {
			//launch modal to say ye or ne
			alert("change elements? save?")
		}
	});

	$containment.on("click", ".elem_edit", function(){
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