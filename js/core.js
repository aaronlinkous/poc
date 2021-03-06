function change_elems(elem) {
	$(".elem").removeClass("selected");
	elem.addClass("selected");
}

function edit_elem(elem) {
	elem_id = elem.attr("id").replace("edit-","");

	$(".elem").removeClass("editing").attr("contenteditable", "false");
	$canvas.toggleClass("locked");

	if(editing == 0) {
		editing = 1;
	
		$(elem).html("Apply");
		$("#"+elem_id).css("height", "").css("width", "");
		$("#"+elem_id).clone().prependTo($containment).attr("id", "cloned-"+elem_id).attr("contenteditable", "true").addClass("cloned");
		$("#"+elem_id).clone().prependTo($containment).attr("id", "cancel-"+elem_id).addClass("for_cancel");
		$("#"+elem_id).addClass("editing").attr("contenteditable", "true").draggable("destroy").resizable("destroy");

		$("#"+elem_id+", .cloned").draggable({
			disabled: true
		}).resizable({
			handles: "ne, se, sw, nw",
			containment: $containment,
			minWidth: 18,
			minHeight: 18,
			aspectRatio: false,
			alsoResize: ".cloned",
			resize: function(){
				prop = elem_properties($("#"+elem_id));
				$("#cloned-"+elem_id).css("left", prop[0].left).css("top",prop[0].top);
			},
			stop: function () {
				repos_edit($("#"+elem_id));
				prop = elem_properties($("#"+elem_id));
				$("#cloned-"+elem_id).css("left", prop[0].left).css("top",prop[0].top);
			}
		});
	
	} else {
		editing = 0;

		$(elem).html("Edit");

		$("#cloned-"+elem_id).remove();
		$("#cancel"+elem_id).remove();
		activate_elem($("#"+elem_id));
	}
}

function elem_properties(elem) {
	properties = [elem.position(), elem.width(), elem.height(), elem.css("font-size").replace("px","")];

	return properties;
}

function add_elem(type) {
	count = type == "text" ? text_count++ : img_count++;
	editable = type == "text" ? "contenteditable='false'" : "";
	edit = "<div class='elem_edit' id='edit-"+type+"-"+count+"'>edit</div>";
	content = type == "text" ? "Edit Text" : "<img src='https://goo.gl/1mJdyp' />";

	elem = "<div "+editable+" class='elem "+type+"' id='"+type+"-"+count+"' unselectable='on'>"+content+"</div>"+edit;

	$containment.append(elem);
	activate_elem($("#"+type+"-"+count), true);
}

function activate_elem(elem, newly_created) {
	change_elems(elem);

	if(!newly_created) elem.draggable("destroy").resizable("destroy");

	elem.draggable({
		cursor: "move",
		containment: $containment,
		scroll: false,
		stack: ".elem",
		snap: true,
		snapTolerance: 10,
		drag: function(event, ui) {
			change_elems(elem);
		},
		stop: function(event, ui) {
			repos_edit(elem);
		}
	}).resizable({
		handles: "ne, se, sw, nw",
		containment: $containment,
		minWidth: 18,
		minHeight: 18,
		aspectRatio: true,
		create: function() {
			prop = elem_properties(elem);
			$(this).attr("data-orig_w", prop[1]).attr("data-orig_fs", prop[3]);
		},
		resize: function() {
			prop = elem_properties(elem);
			orig = $(this).attr("data-orig_w");
			orig_fs = $(this).attr("data-orig_fs");
			scale = prop[1] / orig;

			$(this).css("font-size", orig_fs*scale);
		},
		stop: function() {
			prop = elem_properties(elem);
			$(this).attr("data-orig_w",  prop[1]);
			$(this).attr("data-orig_fs",  prop[3]);

			repos_edit(elem);
			
		}
	});
}

function repos_edit(elem) {
	prop = elem_properties(elem);

	elem_t = prop[0].top - 20 +"px";
	elem_l = prop[0].left+"px";
	elem_w = prop[1]+"px";
	elem_h = prop[2]+"px";

	$("#edit-"+elem.attr("id")).css("left", elem_l).css("top", elem_t);
}

var editing = 0, text_count = 0, img_count = 0;
var $containment = $("#containment");
var $canvas = $("#canvas");

$(document).ready(function(){
	containment();

	$(".add_elem").click(function(){
		type = $(this).attr("data-type");
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
	$("input[name='color']").click(function(){
		color = this.value;
		$(".selected").css("color", color);
	});

	$("#containment_boxes").change(function(){
		elem = $(this).val();
		containment(elem);
	});

	$containment.on("keypress", "div[contenteditable='true']", function(event) {
		if (event.which != 13) return true;
	
		var docFragment = document.createDocumentFragment();
	
		var new_elem = document.createTextNode("\n");
		docFragment.appendChild(new_elem);
	
		new_elem = document.createElement("br");
		docFragment.appendChild(new_elem);
	
		var range = window.getSelection().getRangeAt(0);
		range.deleteContents();
		range.insertNode(docFragment);
	
		range = document.createRange();
		range.setStartAfter(new_elem);
		range.collapse(true);
	
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);

		return false;
	});

	$containment.on("change keyup keydown change keypress", ".editing", function() {
		content = $(this).html();
		elem = $(this).attr("id");
		
		$("#cloned-"+elem).html(content);
	});

});