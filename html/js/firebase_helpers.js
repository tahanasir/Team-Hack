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

	$('.avatar').attr("src", authData.github.profileImageURL);

	user.once("value", function(snapshot){
		if (!snapshot.child("email").exists()){
			user.update({"email" : authData.github.email})
		}
		if (!snapshot.child("name").exists()){
			if (authData.github.displayName){
				user.update({"name" : authData.github.displayName});
				$('.loggedinuser').text("Welcome " + authData.github.displayName);
			}else{
				user.update({"name" : authData.github.username});
				$('.loggedinuser').text("Welcome " + authData.github.username);
			}
		}else{
			$('.loggedinuser').text("Welcome " + snapshot.child("name").val());
		}
		$('.loggedin').show();
	});
	console.log("Authenticated successfully with payload:", authData);
}


$(document).ready(function() {
	var ref = new Firebase("https://team-hack.firebaseio.com");
	var authData = ref.getAuth();
	if (authData){
		$('.loginwith').hide();
		$('.logingithub').hide();
		var user = new Firebase("https://team-hack.firebaseio.com/user/" + authData.uid);
		user.once("value", function(snapshot){
			$('.loggedinuser').text("Welcome " + snapshot.child("name").val());
			$('.avatar').attr("src", snapshot.child("image-link").val());
		});
	}else{
		$('.logout').hide();
		$('.loggedin').hide();
	}
	$('.bt-social').click(function() {
		ref.authWithOAuthPopup("github", function(error, authData) {
			if (error){
				console.log("Login Failed!", error);
			} else {
				$('.loginwith').hide();
				$('.logingithub').hide();
				$('.logout').show();
				updateUserLogin(authData);
			}
		});
	});
	$('#logout-button').click(function() {
		ref.unauth();
		$('.loginwith').show();
		$('.logingithub').show();
		$('.logout').hide();
		$('.loggedin').hide();
	});
});
