/*
Copyright 2012 OCAD University 

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
*/

// Declare dependencies
/*global decapod:true, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    // Container Selectors
    var CONTAINER = ".dc-viewComponentCustomMerge";
    
    // Tests
    $(document).ready(function () {

        /********************
         * customMergeTests *
         ********************/
        
        var customMergeTests = jqUnit.testCase("customMerge");
        
        customMergeTests.test("decapod.customMerge.extend", function () {
            
            var tests = [
                {name: "Two empty arrays", target: [], source: [], expected: []},
                {name: "Two empty objects", target: {}, source: {}, expected: {}},
                {name: "Target empty array, source empty object", target: [], source: {}, expected: {}},
                {name: "Target empty object, source empty array", target: {}, source: [], expected: {}},
                {name: "Target array, source object", target: ["a"], source: {a: "a"}, expected: {a: "a"}},
                {name: "Target object, source array", target: {a: "a"}, source: ["a"], expected: {a: "a", 0: "a"}},
                {name: "Merge arrays", target: ["a", "b"], source: ["c", "d"], expected: ["c", "d"]},
                {name: "Merge objects", target: {a: "a", b: "b"}, source: {b: "B", c: "c"}, expected: {a: "a", b: "B", c: "c"}},
                {name: "Merge multilevel objects", target: {a: {b: "b", c: "c"}}, source: {a: {b: {d: "d"}}}, expected: {a: {b: {d: "d"}, c: "c"}}},
                {name: "Merge nested arrays", target: {a: ["a", "b"]}, source: {a: ["c", "d"]}, expected: {a: ["c", "d"]}},
                {name: "Merge object into nested array", target: {a: ["a"]}, source: {a: {b: "b"}}, expected: {a: {b: "b"}}},
                {name: "Merge array into nested object", target: {a: {b: "b"}}, source: {a: ["a"]}, expected: {a: {b: "b", 0: "a"}}},
                {name: "Merge undefined", target: {a: "a"}, source: {a: undefined, b: undefined}, expected: {a: "a"}},
                {name: "Target is undefined", target: undefined, source: {a: "a"}, expected: {a: "a"}},
                {name: "Source is undefined", target: {a: "a"}, source: undefined, expected: {a: "a"}},
                {name: "Target and source are undefined", target: undefined, source: undefined, expected: {}},
                {name: "Target is a string", target: "string", source: {a: "a"}, expected: {a: "a"}},
                {name: "Source is a string", target: {a: "a"}, source: "string", expected: {a: "a"}},
                {name: "Target is an array, source is a string", target: ["a"], source: "string", expected: "string"},
                {name: "Target is a number", target: 5, source: {a: "a"}, expected: {a: "a"}},
                {name: "Source is a number", target: {a: "a"}, source: 5, expected: {a: "a"}},
                {name: "Target is an array, source is a number", target: ["a"], source: 5, expected: 5},
                {name: "Target is null", target: null, source: {a: "a"}, expected: {a: "a"}},
                {name: "Source is null", target: {a: "a"}, source: null, expected: {a: "a"}},
                {name: "Target and source are null", target: null, source: null, expected: {}},
                {name: "Target is a boolean - true", target: true, source: {a: "a"}, expected: {a: "a"}},
                {name: "Target is a boolean - false", target: false, source: {a: "a"}, expected: {a: "a"}},
                {name: "Source is a boolean - true", target: {a: "a"}, source: true, expected: {a: "a"}},
                {name: "Source is a boolean - false", target: {a: "a"}, source: false, expected: {a: "a"}},
                {name: "Target is an array, source is a boolean - true", target: ["a"], source: true, expected: true},
                {name: "Target is an array, source is a boolean - false", target: "[a]", source: false, expected: false}
            ];
            
            $.each(tests, function (idx, test) {
                var merged = decapod.customMerge.extend(test.target, test.source);
                jqUnit.assertDeepEq(test.name, test.expected, merged);
            });
            
        });
        
        var assertModelOverride = function (grade) {
            var newModel = {a: "A", b: ["B"]};
            var originalModel = {a: "a", b: ["c", "d"], e: "e"};
            var expectedModel = {a: "A", b: ["B"], e: "e"};
            fluid.defaults("decapod.test.overideModel", {
                gradeNames: [grade, "autoInit"],
                model: originalModel
            });
            
            var that = decapod.test.overideModel(CONTAINER, {
                model: fluid.copy(newModel)
            });
            
            jqUnit.assertDeepEq("The model should be overridden.", expectedModel, that.model);
        };
        
        customMergeTests.test("Override view's default model", function () {
            assertModelOverride("decapod.viewComponentCustomMerge");
        });
        
        customMergeTests.test("Override renderer's default model", function () {
            assertModelOverride("decapod.rendererComponentCustomMerge");
        });
    });
})(jQuery);
