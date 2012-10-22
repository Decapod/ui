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
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.test"], {
        options: {
            url: "../../../../mock-data/book/mockResponse.json"
        }
    });
    
    fluid.demands("decapod.exportControls.detailedProgress", ["decapod.test", "decapod.pdfExporter", "decapod.exportControls"], {
        options: {
            model: {
                stages: ["books2pages", "ocro2pdf.py"],
                currentStage: "ocro2pdf.py"
            },
            listeners: {
                "{pdfExporter}.events.onExportStatusUpdate": {
                    listener: "{detailedProgress}.update",
                    args: ["{arguments}.0.stage"]
                },
                "{pdfExporter}.events.afterPollComplete": {
                    listener: "{detailedProgress}.finish",
                    args: [true]
                }
            },
            resources: {
                template: "{exportControls}.options.resources.progress"
            }
        }
    });
})(jQuery);
