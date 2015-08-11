angular.module('blinger.controllers', [])

.controller('TopicsCtrl', function($scope, $state, $ionicModal, Topics) {

  $scope.currentPage = 1;
  $scope.topics = Topics.query();

  $ionicModal.fromTemplateUrl('templates/topic-new.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newTopicModal = modal;
  });
  $scope.newTopic = function () {
    $scope.newTopicModal.show();
  };
  $scope.closeNewTopic = function() {
    $scope.newArticleModal.hide();
  };
  $scope.postTopic = function () {
    var topic = new Articles($scope.newTopic);
    topic.$save().then(function (data) {
      $scope.newTopicModal.hide();
      $state.go('tab.topic-detail', {topicId: data.id});
    });
  };

  $scope.$on('$destroy', function() {
    $scope.newTopicModal.remove();
  });
  $scope.gotoTopic = function (topicId) {
    $state.go('tab.topic-detail', {topicId: topicId});
  };
  $scope.doRefresh = function() {
    Topics.query().$promise.then(function (topics) {
      $scope.currentPage = 1;
      $scope.topics = topics;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    });
  };

  $scope.loadMore = function () {
    Topics.query({page: $scope.currentPage+1}).$promise.then(function(data){
      $scope.topics = $scope.topics.concat(data);
      $scope.currentPage++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      // $scope.$apply();
    });
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });
})

.controller('TopicDetailCtrl', function ($scope, $stateParams, $ionicLoading, Topics, Posts) {
  $ionicLoading.show();
  $scope.base_url = BASE_URL;
  $scope.topicId = $stateParams.topicId;

  Topics.get({id: $stateParams.topicId }).$promise.then(function (data) {
    $scope.topic = data;
    console.log(data);
    $scope.posts = Posts.query({groupId: data.group.id, topicId: $scope.topicId});
    $ionicLoading.hide();
  });
})

.controller('NewTopicCtrl', function ($scope, Topics) {
  $scope.topic = {};
  $scope.submit = function () {
    console.log($scope.topic);
    Topics.save($scope.topic, function (data) {
      $state.go('tab.topic-detail', {topicId: topicId});
    });
  };
})

.controller('NewCommentCtrl', function ($scope, Posts) {
  $scope.comment = {topic_id: $scope.topicId};
  $scope.submit = function () {
    console.log($scope.comment);
    Posts.save($scope.comment, function(data){
      $scope.comments.push(data);
      $scope.comment = {};
    });
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();

  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('SignInCtrl', function ($scope, $http, $state, UserSession) {
  $scope.signIn = function (user) {
    UserSession.login(user).then(function () {
      $state.go('tab.topics');
    });
  };
});
