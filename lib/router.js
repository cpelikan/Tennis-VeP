Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  //notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('cups'); }
});

Router.route('/', {name: 'home'});

Router.route('challenges', {
  name: 'cupsList'
});

Router.route('/challenge/:_id', {
  name: 'cupPage',
  data: function() {
      var data = {};
      data.cup = Cups.findOne(this.params._id);
      data.matches = Matches.find({cup: this.params._id});
      return data;
    }/*,
    subscriptions: function() {
        return Meteor.subscribe('tableCup', this.params.group);
    }*/
});

Router.route('/players', {
  name: 'playersList'
});

Router.route('/stats', {
  name: 'stats'
});

Router.route("/player/:_id",{
    name:"playerPage",
    data: function() { 
      return Meteor.users.findOne(this.params._id); 
    }
    //controller:"PlayerController",
});

Router.route('/cup', {name: 'cupSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

//Router.onBeforeAction('dataNotFound', {only: 'cupPage'});
Router.onBeforeAction(requireLogin);