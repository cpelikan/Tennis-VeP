Template.cupsList.created = function(){
	Session.set("filter", 0);
};

Template.cupsList.helpers({ 
  cups: function() {    
    //return Cups.find({}, {sort: {submitted: -1}}); 
    var filter = Session.get("filter");
    if (filter == 0){
	    return Cups.find({ 
	    		players: { $in: [ Meteor.userId()] } 
			}, {sort: {submitted: -1}});
		}
		
	else{
		return Cups.find({}, {sort: {submitted: -1}}); 
	}		 
  }
});


Template.cupsList.events({
	 'change #listFilter': function(event){

	 	var filter = $(event.currentTarget).val();
	 	Session.set("filter", filter);

	 }

});