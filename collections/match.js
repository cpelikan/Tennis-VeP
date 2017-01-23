Matches = new Meteor.Collection("matches");


Meteor.methods({
  match: function(matchAttributes) {
    var user = Meteor.user();

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to cup new stories");


    // pick out the whitelisted keys
    var match = _.extend(_.pick(matchAttributes, 'cup', 'players', 'winner', 'runoff', 'done'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    var matchId = Matches.insert(match);

    return matchId;
  }
});