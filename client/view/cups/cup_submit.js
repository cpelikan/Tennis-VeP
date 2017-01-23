Template.cupSubmit.helpers({
  myOptions : function(){
    var opt =  Meteor.users.find({"profile.role" : 'Player' });
    return opt;
  },
  caption : function(){
    var a = this.username;
    return a
  }
});

Template.cupSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var playersList = $(e.target).find('[name=players]').val();
    var title =   $(e.target).find('[name=title]').val();
    var tournType = $('#tournType').val();

      //ANDATA e RITORNO
      function createMatchList(cupID, playersList) { 
        if (playersList.length < 2) { return []; }

        var teams = playersList;
        var res = [];
       
        for (var x in teams) {
         for (var y in teams) {
           if (x!=y) {
              var r = matchBuilder({cupID : cupID, teams : teams, x : x, y : y, runoff : false});
             res.push(r);
            }
          }
        }
        return res;
      }


       //SOLO ANDATA
      function createMatchListOne(cupID, playersList) { 
         if (playersList.length < 2) { return []; }

          var teams = playersList;
          var res = [];
          
          for (var x = 0; x<teams.length; x++) {
           for (var y = x+1; y<teams.length; y++) {
             if (x!=y) {
               var r = matchBuilder({cupID : cupID, teams : teams, x : x, y : y, runoff : false});
               res.push(r);
              }
            }
          }
          return res;
      }

  //KNOCKOUT
   function createMatchListKnockout(cupID, playersList){
      if (playersList.length < 2) { return []; }
      var teams = playersList;
      var res = [];  
      
      function shuffle(a) {
          var j, x, i;
          for (i = a.length; i; i--) {
              j = Math.floor(Math.random() * i);
              x = a[i - 1];
              a[i - 1] = a[j];
              a[j] = x;
          }
          return a;
      }
  
      var shuffled = shuffle(teams);

      for (var x = 0; x<shuffled.length; x += 2) {
        var y = x+1;
      
        var r = matchBuilder({cupID : cupID, teams : shuffled, x : x, y : y, runoff : false});
        res.push(r);
      }
      
       return res;
   } 
   
     
   function setBonus(playersList, tournType) {
      
      var st = tournType ? tournType : 1;
       
      switch (st){

        case '1':
          
          if(playersList.length == 2)
          var spread = 0.5;
          
          else
          var spread = 1;  
        
        break;

        case '2':
        var spread = 2;
        break;

        case '3':
        var spread = 1;
        break;

        default:
        var spread = 1;
      }

      console.log("SPREAD" + spread);
     
      var pl = (playersList) ? playersList.length : 0;
      
      var bonus =  pl*spread;

      console.log("Bonus ->"+bonus)
      return bonus;
   }


      var cup = {
        title: title,
        season: $(e.target).find('[name=season]').val(),
        players: playersList,
        type : tournType,
        //matches : createMatchList(title, playersList)
        winner: "",
        bonus : setBonus(playersList,tournType)
      }


 

    Meteor.call('cup', cup, function(error, id) {
      if (error)
        return alert(error.reason);


        if(tournType == 1){
          var matches = createMatchListOne(id, playersList);
         
        }
        
        else if(tournType == 2){
          var matches = createMatchList(id, playersList);
        }

         else if(tournType == 3){
         
          var matches = createMatchListKnockout(id, playersList)
         
        }

        else{
          alert("Scegli un tipo di torneo")
        }
       
        for (var m in matches) {
            //console.log(matches[m]);
            Meteor.call('match', matches[m], function(error, id) {
              if (error)
                return alert(error.reason);
                
            });        
          }

          Router.go('cupPage', {_id: id});  

       
    });
  }/*,

  'change #tournType': function(e) {
    var type = $('#tournType').val();
  
    if(type==0){
      
    }
    else{
      
    }
  }*/


});
