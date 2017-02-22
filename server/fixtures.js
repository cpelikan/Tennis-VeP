/*if (Cups.find().count() === 0) {
  Cups.insert({
    title: 'Cup Autunno',
    season: 'Settembre 2017',
    players: [],
    matches : []
  });
}
*/

function initRank (ranking){

    Meteor.call('ranking', ranking, function(error, id) {
      if (error)
        return console.log(error.reason);

    });
}

Accounts.onCreateUser(function(options, user) {
  //user._id = Meteor.users._makeNewID();
  user.profile                  = {};
  user.profile.role             = "Player";
  user.profile.avatar           = "";
  user.profile.name             = "";
  user.profile.surname          = "";
  user.profile.claim            = "";
  user.profile.phone            = "";
  user.profile.address          = {};
  user.profile.address.building  = "";
  user.profile.address.floor    = "";
  user.profile.address.int      = "";
  user.profile.favoriteEmail    = user.emails[0].address;

  initRank ({
    cupsWon : [],
    matchesWon : [],
    playerUserId : user._id,
    points : 0
  });


  return user;
});




Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    //check([to, from, subject, text], [String]);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});