/*
Copyright 2011 OCAD University 

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
/*global window, decapod:true, fluid, jQuery, jqUnit*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    $(document).ready(function () {
        
        /*******************
         * dataSourceTests *
         *******************/
        
        var dataSourceTests = jqUnit.testCase("Decapod dataSource");
        
        //TODO: Test the decapod.dataSource.method
        //TODO: Test the calls to the invokers
        
        dataSourceTests.test("assembleURL tests", function () {
            jqUnit.assertEquals("Simple url", "http://testURL.com", decapod.dataSource.assembleURL("http://testURL.com"));
            jqUnit.assertEquals("Simple url with encoding", "http://testURL.com/test%20encoding", decapod.dataSource.assembleURL("http://testURL.com/test encoding"));
            jqUnit.assertEquals("URL template", "http://testURL.com/templatePage", decapod.dataSource.assembleURL("http://testURL.com/%page", {page: "templatePage"}));
            jqUnit.assertEquals("URL template with encoding", "http://testURL.com/template%20page", decapod.dataSource.assembleURL("http://testURL.com/%page", {page: "template page"}))
        });
    });
})(jQuery);
