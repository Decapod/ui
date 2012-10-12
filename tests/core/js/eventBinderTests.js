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
    // Tests
    $(document).ready(function () {
        
        /********************
         * eventBinderTests *
         ********************/
         
        var eventBinderTests = jqUnit.testCase("decapod.eventBinder");
        
        eventBinderTests.test("Init tests", function () {
            var that = decapod.eventBinder();
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        eventBinderTests.asyncTest("onReady", function () {
            jqUnit.expect(1);
            decapod.eventBinder({
                listeners: {
                    onReady: function () {
                        jqUnit.assertTrue("The onReady event should have fired", true);
                        start();
                    }
                }
            });
        });
    });
})(jQuery);
