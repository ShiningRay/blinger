window.BASE_URL = 'http://www.bling0.com';
// window.BASE_URL = 'http://localhost:3000';
angular.module('blinger.services', ['ngResource'])
.constant('ApiEndpoint', {
  url: 'http://www.bling0.com'
})
.factory('Groups', function ($resource) {
  return $resource(BASE_URL + '/groups/:id.json');
})
.factory('Topics', function ($resource) {
  return $resource(BASE_URL+'/topics/:id.json');
})
.factory('Posts', function ($resource) {
  return $resource(BASE_URL+'/groups/:groupId/topics/:topicId/posts/:id.json');
})
.factory('UserSession', function ($http) {
  var currentUser =  window.localStorage.currentUser;
  if (currentUser) {
    currentUser = JSON.parse(currentUser);
    $http.defaults.headers.common.Authorization = 'Basic '+ btoa(currentUser.login + ":"+ currentUser.password );
  }
  return {
    get: function () {
      return currentUser;
    },
    set: function (user) {
      window.localStorage.currentUser = JSON.stringify(user);
      $http.defaults.headers.common.Authorization = 'Basic '+ btoa(user.login + ":" + user.password );
    },
    login: function (user) {
      var self = this;
      return $http.post(BASE_URL+'/session.json', {user_session: user}).success(function (data) {
        data.password = user.password;
        self.set(data);
      });
    },
    logout: function () {
      $http.defaults.headers.common.Authorization = null;
    }
  };
})
.factory('Chats', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  };
});
