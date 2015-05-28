(function(){
  'use strict';

  // return dasherized from  underscored/camelcased string
  var dasherize = function(string) {
    return string.replace(/_/g, '-').
      replace(/([a-z])([A-Z])/g, function(_,$1, $2) {
        return $1+'-'+$2.toLowerCase();
      });
  };

  // accepted attributes
  var autoCompleteAttrs = [
    'ngModel', 'valueChanged', 'source', 'pathToData', 'minChars',
    'defaultStyle', 'valueProperty', 'displayProperty'
  ];

  // build autocomplet-div tag with input and select
  var buildACDiv = function(controlEl, attrs) {
    var acDiv = document.createElement('auto-complete-div');
    var controlBCR = controlEl.getBoundingClientRect();
    acDiv.controlEl = controlEl;

    var inputEl = document.createElement('input');
    attrs.ngDisabled && 
      inputEl.setAttribute('ng-disabled', attrs.ngDisabled);
    acDiv.appendChild(inputEl);

    var ulEl = document.createElement('ul');
    acDiv.appendChild(ulEl);

    autoCompleteAttrs.map(function(attr) {
      attrs[attr] && acDiv.setAttribute(dasherize(attr), attrs[attr]);
    });
    acDiv.style.position = 'absolute';
    acDiv.style.top = 0;
    acDiv.style.left = 0;
    acDiv.style.display = 'none';
    return acDiv;
  };

  var compileFunc = function(tElement, tAttrs)  {
    tElement[0].style.position = 'relative';

    var controlEl = tElement[0].querySelector('input, select');

    tAttrs.valueProperty = tAttrs.valueProperty || 'id';
    tAttrs.displayProperty = tAttrs.displayProperty || 'value';
    tAttrs.ngModel = controlEl.getAttribute('ng-model');

    // 1. build <auto-complete-div>
    var acDiv = buildACDiv(controlEl, tAttrs);
    tElement[0].appendChild(acDiv);

    // 2. respond to click by hiding option tags
    controlEl.addEventListener('mouseover', function() {
      controlEl.firstChild && (controlEl.firstChild.style.display = 'none');
    });
    controlEl.addEventListener('mouseout', function() {
      controlEl.firstChild && (controlEl.firstChild.style.display = '');
    });
    controlEl.addEventListener('click', function() {
      if (!controlEl.disabled) {
        acDiv.style.display = 'block';
        var controlBCR = controlEl.getBoundingClientRect();
        var acDivInput = acDiv.querySelector('input');
        acDiv.style.width = controlBCR.width + 'px';
        acDivInput.style.width = (controlBCR.width - 30) + 'px';
        acDivInput.style.height = controlBCR.height + 'px';
        acDivInput.focus();
      }
    });


  }; // compileFunc

  angular.module('angularjs-autocomplete',[]);
  angular.module('angularjs-autocomplete').
    directive('autoComplete', function() {
      return { compile: compileFunc };
    });
})();
