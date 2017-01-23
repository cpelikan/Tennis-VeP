Template.playerPage.helpers({
 	email : function(){
 		var e = this.emails[0].address;
 		console.log(this.emails)
 		return e;
 	}
});