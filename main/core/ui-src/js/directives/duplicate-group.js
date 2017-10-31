angular
    .module('nzbhydraApp')
    .directive('duplicateGroup', duplicateGroup);

function duplicateGroup() {
    return {
        templateUrl: 'static/html/directives/duplicate-group.html',
        scope: {
            duplicates: "<",
            selected: "=",
            isFirstRow: "<",
            rowIndex: "<",
            displayTitleToggle: "<",
            internalRowIndex: "@"
        },
        controller: titleRowController
    };

    function titleRowController($scope, localStorageService) {
        $scope.internalRowIndex = Number($scope.internalRowIndex);
        $scope.rowIndex = Number($scope.rowIndex);
        $scope.titlesExpanded = false;
        $scope.duplicatesExpanded = false;
        $scope.foo = {
            duplicatesDisplayed: localStorageService.get("duplicatesDisplayed") !== null ? localStorageService.get("duplicatesDisplayed") : false
        };
        $scope.duplicatesToShow = duplicatesToShow;

        function duplicatesToShow() {
            return $scope.duplicates.slice(1);
        }

        $scope.toggleTitleExpansion = function () {
            $scope.titlesExpanded = !$scope.titlesExpanded;
            $scope.$emit("toggleTitleExpansion", $scope.titlesExpanded);
        };

        $scope.toggleDuplicateExpansion = function () {
            $scope.duplicatesExpanded = !$scope.duplicatesExpanded;
        };

        $scope.$on("invertSelection", function () {
            for (var i = 0; i < $scope.duplicates.length; i++) {
                if ($scope.duplicatesExpanded) {
                    invertSelection($scope.selected, $scope.duplicates[i]);
                } else {
                    if (i > 0) {
                        //Always remove duplicates that aren't displayed
                        invertSelection($scope.selected, $scope.duplicates[i], true);
                    } else {
                        invertSelection($scope.selected, $scope.duplicates[i]);
                    }
                }
            }
        });
        $scope.$on("deselectAll", function () {
            $scope.selected.splice(0, $scope.selected.length);

        });
        $scope.$on("selectAll", function () {
            $scope.selected.push.apply($scope.selected, $scope.duplicates);
        });

        $scope.$on("duplicatesDisplayed", function (event, args) {
            $scope.foo.duplicatesDisplayed = args;
            if (!args) {
                $scope.duplicatesExpanded = false;
            }
        });

        $scope.clickCheckbox = function (event) {
            var globalCheckboxIndex = $scope.rowIndex * 1000 + $scope.internalRowIndex * 100 + Number(event.currentTarget.dataset.checkboxIndex);

            $scope.$emit("checkboxClicked", event, globalCheckboxIndex, event.currentTarget.checked);
        };

        function isBetween(num, betweena, betweenb) {
            return (betweena <= num && num <= betweenb) || (betweena >= num && num >= betweenb);
        }

        $scope.$on("shiftClick", function (event, startIndex, endIndex, newValue) {
            var globalDuplicateGroupIndex = $scope.rowIndex * 1000 + $scope.internalRowIndex * 100;
            if (isBetween(globalDuplicateGroupIndex, startIndex, endIndex)) {

                for (var i = 0; i < $scope.duplicates.length; i++) {
                    if (isBetween(globalDuplicateGroupIndex + i, startIndex, endIndex)) {
                        if (i === 0 || $scope.duplicatesExpanded) {
                            console.log("Indirectly clicked row with global index " + (globalDuplicateGroupIndex + i) + " setting new checkbox value to " + newValue);
                            var index = _.indexOf($scope.selected, $scope.duplicates[i]);
                            if (index === -1 && newValue) {
                                $scope.selected.push($scope.duplicates[i]);
                            } else if (index > -1 && !newValue) {
                                $scope.selected.splice(index, 1);

                            }
                        }
                    }
                }
            }
        });

        function invertSelection(a, b, dontPush) {
            var index = _.indexOf(a, b);
            if (index > -1) {
                a.splice(index, 1);
            } else {
                if (!dontPush)
                    a.push(b);
            }
        }
    }


}