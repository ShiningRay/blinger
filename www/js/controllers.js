angular.module('blinger.controllers', [])

.controller('ArticlesCtrl', function($scope, $state, $ionicModal, Articles) {

  $scope.currentPage = 1;
  $scope.articles = Articles.query();

  $ionicModal.fromTemplateUrl('templates/articles-new.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newArticleModal = modal;
  });
  $scope.newArticle = function () {
    $scope.newArticleModal.show();
  };
  $scope.closeNewArticle = function() {
    $scope.newArticleModal.hide();
  };
  $scope.postArticle = function () {
    var article = new Articles($scope.newArticle);
    article.$save().then(function (data) {
      $scope.newArticleModal.hide();
      $state.go('tab.article-detail', {articleId: data.id});
    });
  };

  $scope.$on('$destroy', function() {
    $scope.newArticleModal.remove();
  });
  $scope.gotoArticle = function (articleId) {
    $state.go('tab.article-detail', {articleId: articleId});
  };
  $scope.doRefresh = function() {
    Articles.query().$promise.then(function (articles) {
      $scope.currentPage = 1;
      $scope.articles = articles;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
    });
  };

  $scope.loadMore = function () {
    Articles.query({page: $scope.currentPage+1}).$promise.then(function(data){
      $scope.articles = $scope.articles.concat(data);
      $scope.currentPage++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      // $scope.$apply();
    });
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });
})

.controller('ArticleDetailCtrl', function ($scope, $stateParams, $ionicLoading, Articles, Comments) {
  $ionicLoading.show();
  $scope.base_url = BASE_URL;
  $scope.articleId = $stateParams.articleId;
  Articles.get({id: $stateParams.articleId }).$promise.then(function (data) {
    $scope.article = data;
    $ionicLoading.hide();
  });
})

.controller('NewArticleCtrl', function ($scope, Articles) {
  $scope.article = {};
  $scope.submit = function () {
    console.log($scope.article);
    Articles.save($scope.article, function (data) {
      $state.go('tab.article-detail', {articleId: articleId});
    });
  };
})

.controller('ArticleCommentsCtrl', function ($scope, Comments) {
  // $scope.init = function (articleId) {
  // console.log(articleId);
  $scope.comments = Comments.query({articleId: $scope.articleId});
  // };

})

.controller('NewCommentCtrl', function ($scope, Comments) {
  $scope.comment = {article_id: $scope.articleId};
  $scope.submit = function () {
    console.log($scope.comment);
    Comments.save($scope.comment, function(data){
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
      $state.go('tab.articles');
    });
  };
});
