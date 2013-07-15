/*global inject: false, describe: false, beforeEach: false, it: false, expect: false*/
'use strict';

describe('Directive: card', function () {
  var element;

  beforeEach(module('planningPokerApp'));

  beforeEach(module('views/directives/card.html'));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<card value="1">card body</card>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
  }));

  it('should keep body passed from directive', inject(function ($rootScope, $compile) {
    expect(element.text()).toBe('card body');
  }));
});
