Notifications = new Meteor.Collection('notifications');

/*
Notifications.allow({
  update: ownsDocument
});*/

createCupNotification = function(cup, type) {
 
  //var notification = Notifications.findOne(cup.Id);
  //if (cup.userId !== Meteor.user()._id) {
  var recipients = [];
      
  for (p in cup.players){
    if(cup.players[p] != cup.userId){
      var r = {};
      r.player = cup.players[p];
      r.read = false;
      //r[cup.players[p]] = false;
      recipients.push(r);
     } 
  }

 Notifications.insert({
    userId: cup.userId,
    cupId: (cup._id) ? cup._id : cup.id,
    cupTitle : cup.title,
    //cupPlayers : cup.players,
    recipients : recipients,
    type : type
  });
  //}
};
