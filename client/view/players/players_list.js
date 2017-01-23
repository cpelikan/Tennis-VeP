//Meteor.subscribe('allPlayers');

Template.playersList.helpers({
  //allUsers(){ return Meteor.users.find(); },
  allUsers(){ return Meteor.users.find({"profile.role": "Player"}); },
  username(){ return this.username; }
});