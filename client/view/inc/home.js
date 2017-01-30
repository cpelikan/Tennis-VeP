Template.lastCups.helpers({

	cups : function(){ 

		return Cups.find({}, {sort: {submitted: -1}, limit : 5});
	}

});

Template.welcome.helpers({

	winnerRatio : function(){ 
		console.log(Meteor.userId())
		var allMatches = Matches.find(
			{ 
	    		players: { $in: [ {id : Meteor.userId()} ] } 
	    	}).fetch();

		console.log(allMatches)	
	}

});