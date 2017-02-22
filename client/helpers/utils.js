Template.registerHelper('currentRouteIs', function (route) { 
  return Router.current().route.getName() === route; 
});

getRanking = function(){
var collect = Rankingset.find({}, {sort: {submitted: -1}}).fetch();
        
    var players = [];
     
     for (var i in collect) {
            // GEnerale classifica var w = Matches.find({winner : pList[i]}).count();
          
          var p =  {
              username    :  Meteor.users.findOne({ _id: collect[i].playerUserId}).username,
              matchesWon  :  collect[i].matchesWon.length,
              cupsWon     :  collect[i].cupsWon.length,
              points      :  collect[i].points,
              userId      :  collect[i].playerUserId
            }
          

          players.push(p) ;          

      }   
 

      var byPoints = players.sort(
        function(a, b) {
            return a.points - b.points;
      });


      var byCups = byPoints.sort(
        function(a, b) {
          if (a.points == b.points){
            return a.cupsWon - b.cupsWon;
          }
      });

      var byMatches = byCups.sort(
        function(a, b) {
          if (a.cupsWon == b.cupsWon){
            return a.matchesWon - b.matchesWon;   
          }
      });

      var output = byMatches.reverse(); 

      return  output;
    
    }