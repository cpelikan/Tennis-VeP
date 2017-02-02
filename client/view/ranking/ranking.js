Template.stats.helpers({ 
   "offset": function(index){
        index += 1;
        return index;
    },
  rankinglist: function() {    
    return getRanking();
  }

});