Reservations = new Meteor.Collection('reservations');

Meteor.methods({
   addBooking: function(booking) {
  var user = Meteor.user(); 
    try {
      return Reservations.insert( booking );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});

Meteor.methods({
  editBooking( booking ) {
    
    try {
      var idBooking = booking._id; 
      delete booking._id;
      return Reservations.update( idBooking, {
        $set: booking
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});

Meteor.methods({
  removeBooking( booking ) {
    try {
      return Reservations.remove( booking );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});

/*Meteor.methods({
  booking: function(bookingAttributes) {
    var user = Meteor.user();

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login");


    // pick out the whitelisted keys
    var booking = _.extend(_.pick(bookingAttributes, 'cup', 'from', 'to'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    var bookingId = Reservations.insert(booking);

    return bookingId;
  }
});*/

/*var ReservSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event.'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'end': {
    type: String,
    label: 'When this event will end.'
  },
  'type': {
    type: String,
    label: 'What type of event is this?',
    allowedValues: [ 'Birthday', 'Corporate', 'Wedding', 'Miscellaneous' ]
  },
  'players': {
    type: Number,
    label: 'The number of players expected at this event.'
  }
});

Reservations.attachSchema( ReservSchema );*/