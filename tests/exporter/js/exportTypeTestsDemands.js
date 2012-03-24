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

    fluid.demands("decapod.exportType", ["decapod.test", "decapod.pdfExporter"], {
        options: {
            events: {
                afterRender: "{pdfExporter}.events.afterExportTypeRendered"
            },
            resources: {
                template: {
                    url: "../../../components/exporter/html/exportTypeTemplate.html"
                }
            }
        }
    });
    
    fluid.demands("decapod.exportType.controls", ["decapod.test", "decapod.pdfExporter"], {
        options: {
            events: {
                afterRender: "{pdfExporter}.events.afterControlsRendered",
                onExportTrigger: "{pdfExporter}.events.onExportStart"
            },
            listeners: {
                "{pdfExporter}.events.onExportStart": {
                    listener: "{controls}.showProgressControls",
                    priority: "last"
                }
            },
            resources: {
                template: {
                    url: "../../../components/exporter/html/exportControlsTemplate.html"
                }
            }
        }
    });
    fluid.demands("decapod.exportType.pdfOptions", ["decapod.test", "decapod.pdfExporter"], {
        options: {
            events: {
                afterRender: "{pdfExporter}.events.afterOptionsRendered"
            },
            resources: {
                template: {
                    url: "../../../components/exporter/html/pdfOptionsTemplate.html"
                }
            }
        }
    });
    fluid.demands("decapod.pdfExporter", ["decapod.test"], {
        options: {
            resources: {
                template: {
                    url: "../../../components/exporter/html/pdfExporterTemplate.html"
                }
            }
        }
    });
    fluid.demands("decapod.exportType.controls.trigger", ["decapod.test"], {
        options: {
            resources: {
                template: {
                    url: "../../../components/exporter/html/exportControlsTriggerTemplate.html"
                }
            },
            events: {
                afterTriggered: "{controls}.events.onExportTrigger"
            }
        }
    });
    fluid.demands("decapod.exportType.controls.progress", ["decapod.test"], {
        options: {
            resources: {
                template: {
                    url: "../../../components/exporter/html/exportControlsProgressTemplate.html"
                }
            }
        }
    });
    fluid.demands("decapod.exportType.controls.download", ["decapod.test"], {
        options: {
            resources: {
                template: {
                    url: "../../../components/exporter/html/exportControlsDownloadTemplate.html"
                }
            }
        }
    });
    
    /*****************
     * Event Demands *
     *****************/
    fluid.setLogging(true);
    fluid.demands("testModel", ["decapod.test", "decapod.exportType.pdfOptions"], [
        "{arguments}.0",
        "{pdfOptions}"
    ]);
    fluid.demands("testClick", ["decapod.test", "decapod.exportType.controls"], ["{controls}"]);
    fluid.demands("triggered", ["decapod.test", "decapod.exportType.controls.trigger"], ["{trigger}"]);
})(jQuery);
