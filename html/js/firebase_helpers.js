function getTagID(value, callback) {
	var ref = new Firebase("https://team-hack.firebaseio.com/tags");

	ref.orderByValue().equalTo(value).once("value", function(id){callback(id)});
}

function addTag(value, callback) {
	var lookup = new Firebase("https://team-hack.firebaseio.com/tags/");
	ref.push(value);
	getTagID(value, callback);
}

function getOrAddTag(value, callback){
	getTagID(value, function(id){
		if (id){
			callback(id);
		}else{
			addTag(value, callback)
		}
	});
}

function autoCompleteTag(value, callback) {
	var ref = new Firebase("https://team-hack.firebaseio.com/tags");
	ref.orderByValue().startAt(value).endAt(value + "~").once("value", function(snapshot) {
		callback(snapshot.val());
	});
}

function updateUserLogin(authData){
	var user = new Firebase("https://team-hack.firebaseio.com/user/" + authData.uid);
	user.update({"image-link" : authData.github.profileImageURL});
	user.once("value", function(snapshot){
		if (!snapshot.child("email").exists()){
			user.update({"email" : authData.github.email})
		}
		if (!snapshot.child("name").exists()){
			user.update({"name" : authData.github.displayName});
			$('.loggedinuser').text("Welcome " + authData.github.displayName);
		}else{
			$('.loggedinuser').text("Welcome " + snapshot.child("name"));
		}
		$('.loggedinuser').show();
	});
	console.log("Authenticated successfully with payload:", authData);
}