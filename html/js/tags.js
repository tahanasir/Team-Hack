
var ref = new Firebase("https://team-hack.firebaseio.com/tags");

ref.once("value", function(snapshot) {
	var tag_data = $.map(snapshot.val(), function(elem) { return elem; });
	console.log(tag_data);

	var tags = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: tag_data
	});
	tags.initialize();

	$('input[data-role="tagsinput"]').tagsinput({
		typeaheadjs: {
			name: 'tags',
			displayKey: 'name',
			valueKey: 'name',
			source: tags.ttAdapter()
		}
	});
});