var PanelsController = function($resource) {
  var scope = this;

  scope.currentModel = $resource('app/models/:model', {model:'default.json'}).get({});

  scope.$watch('currentModel', function() { 
    scope.currentModelJson = angular.toJson(scope.currentModel.layout, true);
  });

  scope.$watch('currentModelJson', function() { 
    scope.currentModel.layout = angular.fromJson(scope.currentModelJson, false);
  });
};

PanelsController.$inject = ['$resource'];