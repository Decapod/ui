/*
Copyright 2011-2012 OCAD University 

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
    
    /************************
     * decapod.renderSelect *
     ************************/
    
    fluid.registerNamespace("decapod.renderSelect");
    
    decapod.renderSelect.produceTree = function (that) {
        return {
            "label": {
                messagekey: "label"
            },
            choices: {
                selection: "${selection}",
                optionlist: "${choices}",
                optionnames: "${names}"
            }
        };
    };
    
    fluid.defaults("decapod.renderSelect", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        produceTree: "decapod.renderSelect.produceTree",
        selectors: {
            "label": ".dc-renderSelect-label",
            choices: ".dc-renderSelect-choices"
        },
        strings: {
            "label": "PDF Output Options:"
        },
        renderOnInit: true
    });
    
    /**********************
     * decapod.exportView *
     **********************/
    
    fluid.registerNamespace("decapod.exportView");
    
    decapod.exportView.preInit = function (that) {
        that.setStartState = function () {
            that.locate("status").show();
            that.updateStatus(that.model.status);
            that.poll = true;
            that.pollExport();
        };
        
        that.setFinishedState = function () {
            that.cancelPolling();
            that.updateStatus(that.model.status);
            that.showExport();
        };
        
        that.reset = function () {
            that.exporter.deleteExport();
            that.exporter.resetModel();
            that.updateStatus(that.model.status);
            that.locate("download").hide();
        };
    };
    
    decapod.exportView.finalInit = function (that) {
        that.locate("downloadLink").text(that.options.strings.download);
        that.locate("restartLink").text(that.options.strings.restart);
        
        that.locate("download").hide();
        
        that.locate("restartLink").click(that.events.reset.fire);
        
        that.applier.modelChanged.addListener("downloadSRC", function (newModel) {
            if (newModel.downloadSRC) {
                that.events.afterExportFinished.fire();
            }
        });
    };
    
    decapod.exportView.updateStatus = function (that, statusMessage) {
        that.locate("status").text(statusMessage || "");
    };
    
    decapod.exportView.showExport = function (that, downloadURL) {
        that.locate("downloadLink").attr({href: downloadURL || ""});
        that.locate("download").show();
    };
    
    decapod.exportView.pollExport = function (that) {
        that.timeout = setTimeout(function () {
            that.exporter.fetchExport();
            if (that.poll) {
                that.pollExport();
            }
        }, that.options.delay);
    };
    
    decapod.exportView.cancelPolling = function (that) {
        that.poll = false;
        if (that.timeout) {
            clearTimeout(that.timeout);
        }
    };
    
    fluid.defaults("decapod.exportView", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.exportView.preInit",
        finalInitFunction: "decapod.exportView.finalInit",
        components: {
            exporter: {
                type: "decapod.exporter",
                options: {
                    model: "{exportView}.model",
                    applier: "{exportView}.applier",
                    events: {
                        afterExportStarted: "{exportView}.events.afterExportStarted"
                    }
                }
            },
            select: {
                type: "decapod.renderSelect",
                container: "{exportView}.dom.select",
                options: {
                    model: "{exportView}.model",
                    applier: "{exportView}.applier"
                }
            }
        },
        invokers: {
            showExport: "decapod.exportView.showExport",
            updateStatus: "decapod.exportView.updateStatus",
            pollExport: "decapod.exportView.pollExport",
            cancelPolling: "decapod.exportView.cancelPolling"
        },
        events: {
            afterExportStarted: null,
            afterExportFinished: null,
            reset: null
        },
        listeners: {
            "afterExportStarted.internal": "{decapod.exportView}.setStartState",
            "afterExportFinished.internal": "{decapod.exportView}.setFinishedState",
            "reset.internal": {
                listener: "{decapod.exportView}.reset",
                priority: "first"
            }
        },
        selectors: {
            select: ".dc-exportView-select",
            status: ".dc-exportView-status",
            download: ".dc-exportView-download",
            downloadLink: ".dc-exportView-downloadLink",
            restartLink: ".dc-exportView-restartLink"
        },
        strings: {
            download: "Download PDF",
            restart: "Start Over"
        },
        delay: 5000
    });
})(jQuery);
