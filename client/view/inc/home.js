
Template.lastCups.helpers({

	cups : function(){ 

		return Cups.find({}, {sort: {submitted: -1}, limit : 5});
	}

});

Template.welcome.helpers({

	winnerRatio : function(){ 
				
	    var allMatches = Matches.find({'players.id': Meteor.userId(), done : true}).count();

		var matchWins = Matches.find({'winner': Meteor.userId()}).count();

		var ratio = (matchWins/allMatches)*100;

		var roundedRatio = Math.round(ratio)+"%";
		
		if (matchWins)
		return roundedRatio;

		return false;	
	},

	points : function(){
		var points = Rankingset.findOne({'playerUserId' : Meteor.userId()}).points;
		
		
		if (points)
		return points;

		return false;
	}

});