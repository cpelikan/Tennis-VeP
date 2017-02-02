Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  //notFoundTemplate: 'notFound',
  onAfterAction: function() {
    if (this.ready() && $('.vegas-container').length > 0 ) {
      
          $('body').vegas('destroy');
          $('body').removeAttr('class');
    }
  }
});

Router.route('/', {
  name: 'home',
  waitOn: function() { return Meteor.subscribe('rankingset'); }
});

Router.route('challenges', {
  name: 'cupsList',
  waitOn: function() { return Meteor.subscribe('cups'); }
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

Router.route('/ranking', {
  name: 'stats',
  waitOn: function() { return Meteor.subscribe('rankingset'); }
});

Router.route("/player/:_id",{
    name:"playerPage",
    data: function() { 
      return Meteor.users.findOne(this.params._id); 
    }
    //controller:"PlayerController",
});

Router.route('/create', {
  name: 'cupSubmit'/*,
  waitOn: function() { return Meteor.subscribe('users'); }*/
});

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