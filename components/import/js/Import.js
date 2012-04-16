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
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    //TODO: "import" is a reserved word
    fluid.defaults("decapod.import", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.import.finalInit",  //for decapod 0.5a
        preInitFunction: "decapod.import.preInit",  //for decapod 0.5a
        components: {
            progressiveEnhancementChecker: {
                type: "fluid.progressiveCheckerForComponent",
                options: {
                    componentName: "fluid.uploader"
                }
            },
            uploader: {
                type: "fluid.uploader",
                container: ".flc-uploader",
                options: {
                    queueSettings: {
                        fileTypes: ["image/jpeg", "image/png", "image/tiff"]
                    }
                }
            },
            //for decapod 0.5a
            exportView: {
                type: "decapod.exportView",
                container: "{decapod.import}.container",
                priority: "2"
            },
            server: {
                type: "decapod.dataSource",
                priority: "1"
            }
        },
        //for decapod 0.5a
        invokers: {
            importReset: "decapod.import.resetImport"
        }
    });
    
    //for decapod 0.5a
    decapod["import"].finalInit = function (that) {
        that.exportView.locate("status").hide();
        that.importReset();
    };
    
    decapod["import"].preInit = function (that) {
		that.importResetWrapper = function () {
            that.importReset();
		};
    };
    
})(jQuery);

