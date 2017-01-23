Template.stats.helpers({ 
   "offset": function(index){
        index += 1;
        return index;
    },
  rankinglist: function() {    
    var collect = Rankingset.find({}, {sort: {submitted: -1}}).fetch();
        
    var players = [];
     
     for (var i in collect) {
            // GEnerale classifica var w = Matches.find({winner : pList[i]}).count();
          
          var p =  {
              username   : Meteor.users.findOne({ _id: collect[i].playerUserId}).username,
              matchesWon : collect[i].matchesWon.length,
              cupsWon : collect[i].cupsWon.length,
              points :  collect[i].points
            }
          

          players.push(p) ;          

      }   

     
      /*
       var byPoints = players.sort(
        function(a, b) {
            return a.matchesWon - b.matchesWon
        });
          
      var tmpPoints = byPoints.reverse(); 


      var sortTmp = tmpPoints.sort(
        function(a, b) {
            return a.cupsWon - b.cupsWon
        });
          
      var tmp = sortTmp.reverse(); 
       */

      var sort = players.sort(
        function(a, b) {
            return a.points - b.points
        });
          
      var output = sort.reverse(); 



    return  output;
  }

});