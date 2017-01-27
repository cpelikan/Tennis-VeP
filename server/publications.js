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
