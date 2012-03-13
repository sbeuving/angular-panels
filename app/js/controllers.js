var PanelsController = function($resource) {
  var scope = this;

  scope.models = $resource('app/models/:modelId.json', {modelId:'@id'});

  scope.currentModel = scope.models.get({modelId: 1});


  return scope.$watch('models', function() { 
    scope.currentModelJson = angular.toJson(scope.currentModel.layout, true); 
  });
  

  scope.saveModel = function() {
    scope.currentModel.layout = angular.fromJson(scope.currentModelJson, false);
  }
};

PanelsController.$inject = ['$resource'];