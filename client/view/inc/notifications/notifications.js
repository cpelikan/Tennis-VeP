Template.notifications.helpers({
  notifications: function() {
   
     return  Notifications.find({
                userId : {$ne: Meteor.userId()},
                recipients: {
                    $elemMatch: {
                        player:  Meteor.userId(),
                        read : false
                    }
                }
            });
            /*var uID =  Meteor.userId();

            return  Notifications.find({
                userId : {$ne: Meteor.userId()},
                recipients: {
                    $elemMatch: {
                        uID:  false
                    }
                }
            });*/

  },
  notificationCount: function(){
    
     return Notifications.find({
                userId : {$ne: Meteor.userId()},
                recipients: {
                    $elemMatch: {
                        player:  Meteor.userId(),
                        read : false
                    }
                }
            }).count();
  }
});

Template.notification.helpers({
  notificationCupPath: function() {
    return Router.routes.cupPage.path({_id: this.cupId});
  },
  notificationAuthor: function() {
    return Meteor.users.findOne(this.userId).username;
  },
  actionToNotify : function(){
    var dictionary = {
      "cup_created" : "ha creato",
      "cup_closed" : "ha terminato"
      }
     
     return dictionary[this.type];
  }
});

Template.notification.events({
  'click a': function() {
    //Notifications.update(this._id, {$set: {read: true}});
    
    var tmpRecip = this.recipients;
    var recipients = []; 
    
    for (r in tmpRecip ){
      var i = {};
      i.player = tmpRecip[r].player; 
      if (tmpRecip[r].player == Meteor.userId()){
          i.read   = true; 
      }
      else{
        i.read   = tmpRecip[r].read; 
      } 
       recipients.push(i);  
    }

    Notifications.update(this._id, {
         recipients
    });
  }
});
