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

    var EXPORT_INFO_TEMPLATE = "../../../components/exporter/html/exportInfoTemplate.html";
    var PDF_EXPORT_OPTIONS_TEMPLATE = "../../../components/exporter/html/pdfExportOptionsTemplate.html";
    var SELECT_TEMPLATE = "../../../components/select/html/selectTemplate.html";
    var CONTROLS_TEMPLATE = "../../../components/exporter/html/exportControlsTemplate.html";
    var TRIGGER_TEMPLATE = "../../../components/exporter/html/exportControlsTriggerTemplate.html";
    var PROGRESS_TEMPLATE = "../../../components/exporter/html/exportControlsProgressTemplate.html";
    var COMPLETE_TEMPLATE = "../../../components/exporter/html/exportControlsCompleteTemplate.html";
    var PDF_EXPORTER_TEMPLATE = "../../../components/exporter/html/pdfExporterTemplate.html";

    fluid.demands("decapod.pdfExporter", ["decapod.test", "decapod.exporter"], {
        options: {
            resources: {
                pdfExportTemplate: {
                    url: PDF_EXPORTER_TEMPLATE,
                    forceCache: true
                },
                exportInfo: {
                    url: EXPORT_INFO_TEMPLATE,
                    forceCache: true
                },
                pdfExportOptions: {
                    url: PDF_EXPORT_OPTIONS_TEMPLATE,
                    forceCache: true
                },
                select: {
                    url: SELECT_TEMPLATE,
                    forceCache: true
                },
                controls: {
                    url: CONTROLS_TEMPLATE,
                    forceCache: true
                },
                trigger: {
                    url: TRIGGER_TEMPLATE,
                    forceCache: true
                },
                progress: {
                    url: PROGRESS_TEMPLATE,
                    forceCache: true
                },
                complete: {
                    url: COMPLETE_TEMPLATE,
                    forceCache: true
                }
            }
        }
    });

})(jQuery);
