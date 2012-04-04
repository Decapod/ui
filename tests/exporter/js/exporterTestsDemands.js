/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    var EXPORT_INFO_TEMPLATE = "../../../components/exporter/html/exportInfoTemplate.html";
    var PDF_EXPORT_OPTIONS_TEMPLATE = "../../../components/exporter/html/pdfExportOptionsTemplate.html";
    var CONTROLS_TEMPLATE = "../../../components/exporter/html/exportControlsTemplate.html";
    var TRIGGER_TEMPLATE = "../../../components/exporter/html/exportControlsTriggerTemplate.html";
    var PROGRESS_TEMPLATE = "../../../components/exporter/html/exportControlsProgressTemplate.html";
    var DOWNLOAD_TEMPLATE = "../../../components/exporter/html/exportControlsDownloadTemplate.html";
    var PDF_EXPORTER_TEMPLATE = "../../../components/exporter/html/pdfExporterTemplate.html";

    fluid.demands("decapod.pdfExporter", ["decapod.test", "decapod.exporter"], {
        options: {
            listeners: {
                "onExportStart.triggerExporter": "{exporter}.events.onExportStart.fire"
            },
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
                download: {
                    url: DOWNLOAD_TEMPLATE,
                    forceCache: true
                }
            }
        }
    });

})(jQuery);
