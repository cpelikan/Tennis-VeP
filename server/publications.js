Meteor.publish('cups', function() {
  return Cups.find();
});

Meteor.publish('matches', function() {
  return Matches.find();
});

Meteor.publish('rankingset', function() {
  return Rankingset.find();
});

Meteor.publish('notifications', function() {
  return Notifications.find();
});

/*
Meteor.publish('allPlayers',function(){
  // you should restrict this publication to only be available to admin users
  //return Meteor.users.find({},{fields: { emails: 1 }});
  return Meteor.users.find();
});*/