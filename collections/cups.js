Cups = new Meteor.Collection("cups");

Meteor.methods({
  cup: function(cupAttributes) {
  
    var user = Meteor.user(),
      cupWithSameTitle = Cups.findOne({title: cupAttributes.title}),
      knockoutAllowed = [4,8,16,32],
      playersIsAppropriate = (cupAttributes.players) ? knockoutAllowed.indexOf(cupAttributes.players.length) === -1 : false;
      console.log(playersIsAppropriate);
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "Devi essere registrato per creare un torneo");

    // ensure the cup has a title
    if (!cupAttributes.title)
      throw new Meteor.Error(422, 'inserire un nome del torneo');

    // check that there are no previous cup with the same link
    if (cupAttributes.title && cupWithSameTitle) {
      throw new Meteor.Error(302,
        'Esiste già un torneo con questo nome',
        cupWithSameTitle._id);
    }

    if (cupAttributes.type == 0) {
      throw new Meteor.Error(422,
        'Scegli un tipo di torneo');
    }

    if (cupAttributes.players == null || cupAttributes.players.length < 2) {
      throw new Meteor.Error(422,
        'Sono necessari almeno 2 giocatori');
    }

    if (cupAttributes.type == 3 && playersIsAppropriate) {
      throw new Meteor.Error(422,
        'Il numero di giocatori non è compatibile con il torneo selezionato');
    }

    // pick out the whitelisted keys
    var cup = _.extend(_.pick(cupAttributes, 'title', 'season', 'players', 'type', 'winner', 'bonus', 'done'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    var cupId = Cups.insert(cup);
    cup.id = cupId;
   
    createCupNotification(cup);
    return cupId;
  }
});