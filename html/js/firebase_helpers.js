function getTagID(value, callback) {
	var ref = new Firebase("https://team-hack.firebaseio.com/tags");

	ref.orderByValue().equalTo(value).once("value", function(snapshot) {
		callback(snapshot.val());
	});
}

function addTag(value, callback) {
	var lookup = new Firebase("https://team-hack.firebaseio.com/tags/");
	lookup.orderByKey().limitToLast(1).once("value", function(snapshot) {
		snapshot.forEach(function(childSnapshot){
			var ref = new Firebase("https://team-hack.firebaseio.com/tags/" + (parseInt(childSnapshot.key()) + 1));
			ref.set(value);
			callback(parseInt(childSnapshot.key()) + 1);
		})
	});
}

function getOrAddTag(value, callback){
	if (getTagID(value)){
		return getTagID(value, callback);
	}else{
		return addTag(value, callback);
	}
}

function autoCompleteTag(value, callback) {
	var ref = new Firebase("https://team-hack.firebaseio.com/tags");
	ref.orderByValue().startAt(value).endAt(value + "z").once("value", function(snapshot) {
		callback(snapshot.val());
	});
}