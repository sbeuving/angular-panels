
'use strict';

angular.module('angular-panels', ['ngResource'])

	.controller("PanelsController", ["$scope","$resource", function($scope,$resource) {

		var models = $resource('stubs/:modelId.json', {modelId:'@id'});

		$scope.currentModel = models.get({modelId: 1});

			$scope.currentModel.$promise.then(function(data) {
				$scope.currentModel = data;

					$scope.$watch('currentModel', function() {
						$scope.currentModelJson = angular.toJson($scope.currentModel.layout, true);
					});

					$scope.$watch('currentModelJson', function() {
						$scope.currentModel.layout = angular.fromJson($scope.currentModelJson, false);
					});
			});
	}])

	.directive('uiPanels', function () {

		function getPanelContent(panel) {
			return panel.hasOwnProperty('content')
					? panel.content
					: (panel.hasOwnProperty('url') ? panel.url : '');
		}

		function buildPanels(scope, linkElement, model)
		{
			if (angular.isDefined(model) && angular.isDefined(model.layout)) {
				var layout = model.layout;
				linkElement.empty();

				for(var i=0, cols=model.layout.length; i<cols; i++) {
					var columnElement = angular.element('<div class="ui-column ui-sortable"></div>');

					for(var j=0, panels=model.layout[i].length; j<panels; j++) {
						var panelElement = angular.element('<div class="dragbox"></div>');

						panelElement.append('<h6>' +  model.layout[i][j].header + '</h6>');
						panelElement.append('<div>' + getPanelContent( model.layout[i][j]) + '</div>');
						panelElement.attr('ui-column-id', i);
						panelElement.attr('ui-panel-id', j);
						columnElement.append(panelElement);
					}

					columnElement.sortable({
						opacity: 0.8,
						connectWith: ".ui-column",
						receive: function(event, ui) {
							var newLayout = [];

							var columnsDom = ui.item.context.parentElement.parentElement.children;
							for(var i=0, cols=columnsDom.length; i<cols; i++) {
								newLayout[i] = [];
								var panelsDom = columnsDom[i].children;
								for(var j=0, panels=panelsDom.length; j<panels; j++) {
									var oldColumnId = $(panelsDom[j]).attr('ui-column-id');
									var oldPanelId = $(panelsDom[j]).attr('ui-panel-id');
									model.layout[oldColumnId][oldPanelId] = layout[oldColumnId][oldPanelId];
									newLayout[i][j] = layout[oldColumnId][oldPanelId];
								}
							}

							buildPanels(linkElement, model);
							model.layout = newLayout;
							scope.$digest();
						}
					});

					linkElement.append(columnElement);
				}
			}
		}

		return {
			controller: 'PanelsController',
			link: function (scope, element) {

				//scope.$watch(	element.attr('model'), function(model) {
				scope.$watch("currentModel", function(model) {
					console.log("update panels");
					buildPanels(scope, element, model);
				});
			}
		};

	});
