Reservations = new Meteor.Collection('reservations');

Meteor.methods({
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
});