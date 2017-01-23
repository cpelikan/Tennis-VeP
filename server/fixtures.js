/*if (Cups.find().count() === 0) {
  Cups.insert({
    title: 'Cup Winter',
    season: 'Febbraio 2017',
    players: [],
    matches : []
  });

  Cups.insert({
    title: 'Cup Spring',
    season: 'Aprile 2017',
    players: [],
    matches : []
  });

  Cups.insert({
    title: 'Cup Summer',
    season: 'Luglio 2017',
    players: [],
    matches : []
  });

  Cups.insert({
    title: 'Cup Autunno',
    season: 'Settembre 2017',
    players: [],
    matches : []
  });
}
*/

function initRank (ranking){
console.log(0);
 Meteor.call('ranking', ranking, function(error, id) {
      if (error)
        return console.log(error.reason);

    });
}

Accounts.onCreateUser(function(options, user) {
  //user._id = Meteor.users._makeNewID();
  user.profile                = {};
  user.profile.role           = "Player";
  /*user.profile.ranking        = "0";
  user.profile.cupsWon        = "0";
  user.profile.totalMatches   = "0";
  user.profile.matchesWon     = "0";
  */
  user.profile.avatar         = "";
  user.profile.name           = "";
  user.profile.surname        = "";
  user.profile.level          = "Beginner";

  initRank ({
    cupsWon : [],
    matchesWon : [],
    playerUserId : user._id,
    points : 0
  })


  return user;
});