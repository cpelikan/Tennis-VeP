Template.registerHelper('currentRouteIs', function (route) { 
  return Router.current().route.getName() === route; 
});

getRanking = function(){
var collect = Rankingset.find({}, {
      sort: {points: -1}
    }).fetch();
        
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
          
      /*var subFilter = players.sort(
        function(a, b) {
            if(a.points == b.points )
            return a.matchesWon - b.matchesWon
        });  

      console.log('SuB filter' , subFilter);
      */
     
      /*var sort = players.sort(
        function(a, b) {
            return a.points - b.points
        });
          
      var output = sort.reverse(); 
     
      return  output;
       */
    
      return players;
    }