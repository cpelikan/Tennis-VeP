Rankingset = new Meteor.Collection("rankingset");


Meteor.methods({
  ranking: function(rankingAttributes) {
   

    // ensure the user is logged in
    /*if (!user)
      throw new Meteor.Error(401, "You need to login");
    */

    // pick out the whitelisted keys
    var ranking = _.extend(_.pick(rankingAttributes, 'cupsWon', 'matchesWon', 'playerUserId', 'points'), {
      submitted: new Date().getTime()
    });

    var rankingId = Rankingset.insert(ranking);

    return rankingId;
  }
});



