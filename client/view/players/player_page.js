Template.playerPage.helpers({
 	email : function(){
 	
		var e = this.emails[0].address;
		console.log(this.emails)
		return e;
 		
 		
 	},

 	isCurrentUser : function(){
 		if (Meteor.userId()==this._id){
 			return true;
 		}
 		return false;
 	},
 	level : function(){
 		

 		function checkRange(average, from, to) {
			 if (average >= from && average <= to) { return average; }
			 else { return !average; }
			}

	

 		var rs = Rankingset.findOne({playerUserId : this._id});
 		var points = rs.points;
 		
 		switch(points){
 			case checkRange(points, 0, 5):
 			return "Principiante";
 			
 			break;

 			case checkRange(points, 6, 25):
 			return "Dilettante";
 			
 			break;

 			case checkRange(points, 26, 50):
 			return "Esperto";
 			break;

 			case checkRange(points, 51, 99):
 			return "Professionista";
 			
 			break;

 			case checkRange(points, 100, 150):
 			return "Campione";
 			
 			break;

			case (points > 150):
 			return "Master";
 			
 			break; 			

 			default :
 			return "Principiente";
 			
 		}

 		
 	}
});