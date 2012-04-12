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
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    fluid.registerNamespace("decapod.importStatus");
    
    decapod.importStatus.setNumValidFiles = function (that, numValidFiles) {
        that.totalNumFiles -= that.numValidFiles;
        that.numValidFiles = numValidFiles;
        that.totalNumFiles += numValidFiles;
    };
    
    decapod.importStatus.addError = function (that, error) {
        that.numInvalidFiles += 1;
        that.errors[error] += 1;
        that.totalNumFiles += 1;
    };
    
    decapod.importStatus.reset = function (that) {
        var errorNums = that.options.errorNums;
        that.totalNumFiles = 0;
        that.numValidFiles = 0;
        that.numInvalidFiles = 0;
        
        for (var i = 0; i < errorNums.length; i++) {
            that.errors[errorNums[i]] = 0;
        }
    };
    
    decapod.importStatus.statusMessages = function (that, values) {
        var strings = that.options.strings;
        var messages = [];
        values = values || {};
        values.totalNumFiles = that.totalNumFiles;
        values.numValidFiles = that.numValidFiles;
        values.numInvalidFiles = that.numInvalidFiles;
        fluid.merge("replace", values, that.errors);
        
        messages.push(fluid.stringTemplate(strings.total, values));
        for (var error in that.errors) {
            var numErrors = that.errors[error];
            if (numErrors > 0) {
                messages.push(fluid.stringTemplate(strings[error], values));
            }
        }
        
        return messages;
    };
    
    decapod.importStatus.renderStatuses = function (that) {
        that.renderer.model.statuses = that.statusMessages();
        that.renderer.refreshView();
    };
    
    decapod.importStatus.finalInit = function (that) {
        that.errors = {};
        that.reset();
    };
    
    fluid.defaults("decapod.importStatus", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.importStatus.finalInit",
        components: {
            renderer: {
                type: "decapod.importStatus.renderer",
                container: "{importStatus}.container",
                options: {
                    renderOnInit: false
                }
            }
        },
        invokers: {
            setNumValidFiles: "decapod.importStatus.setNumValidFiles",
            addError: "decapod.importStatus.addError",
            reset: "decapod.importStatus.reset",
            statusMessages: "decapod.importStatus.statusMessages",
            renderStatuses: "decapod.importStatus.renderStatuses"
        },
        errorNums: [-100, -110, -120, -130],
        strings: {
            "total": "%totalNumFiles files found.",
            "-100": "%-100 files exceeded the queue limit",
            "-110": "%-110 files exceeded the size limit",
            "-120": "%-120 files were empty (0 bytes)",
            "-130": "%-130 files had an invalid file type"
        }
    });
    
    fluid.registerNamespace("decapod.importStatus.renderer");
    
    decapod.importStatus.renderer.produceTree = function (that) {
        return {
            expander: {
                type: "fluid.renderer.repeat",
                repeatID: "statusMessages:",
                controlledBy: "statuses",
                pathAs: "statusPath",
                tree: {
                    value: "${{statusPath}}"
                }
            }
        };
    };
    
    fluid.defaults("decapod.importStatus.renderer", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            statusMessages: ".dc-importStatus-renderer-statusMessage" 
        },
        repeatingSelectors: ["statusMessages"],
        model: {
            statuses: []
        },
        produceTree: "decapod.importStatus.renderer.produceTree",
        renderOnInit: true
    });
    
})(jQuery);
