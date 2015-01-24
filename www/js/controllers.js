angular.module('blinger.controllers', [])

.controller('ArticlesCtrl', function($scope, $state, Articles) {
  $scope.articles = Articles.query();
  $scope.gotoArticle = function (articleId) {
    $state.go('tab.article-detail', {articleId: articleId});
  };
  $scope.doRefresh = function() {
    Articles.query().$promise.then(function (articles) {
      $scope.articles = articles;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    });
  };
})

.controller('ArticleDetailCtrl', function ($scope, $stateParams, Articles) {
  $scope.article = Articles.get({id: $stateParams.articleId });
  console.log($scope.article);
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
});
