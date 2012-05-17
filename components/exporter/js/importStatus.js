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
    
    /**
     * Add the number of valid files
     * @param that, the component
     * @param numValidFiles, an integer representing the number of valid files
     */
    decapod.importStatus.addValid = function (that, numValidFiles) {
        that.model.valid += numValidFiles;
    };
    
    /**
     * Add the number of files that resulted in an error
     * @param that, the component
     * @param errorName, the name of the error
     * @param numErrors, optionally specify the number of files that had this error, will default to 1
     */
    decapod.importStatus.addError = function (that, errorName, numErrors) {
        numErrors = numErrors || 1;
        var origNumErrors = fluid.get(that.model.errors, errorName) || 0;
        fluid.set(that.model.errors, errorName, origNumErrors + numErrors);
    };
    
    /**
     * Calculates and returns the total number of files that resulted in an error
     * @param that, the component
     * @return An integer representing the total number of errors
     */
    decapod.importStatus.totalNumErrors = function (that) {
        var total = 0;
        $.each(that.model.errors, function (errorName, numFiles) {
            total += numFiles;
        });
        return total;
    };
    
    /**
     * Calculates and returns the total number of files both valid and errors
     * @param that, the component
     * @return An integer representing the total number of valid and error files
     */
    decapod.importStatus.totalNumFiles = function (that) {
        var total = that.model.valid || 0;
        total += that.totalNumErrors();
        return total;
    };
    
    /**
     * Assembles and returns a status message for the total number of files
     * @param that, the component
     * @return A string status message for the total number of files
     */
    decapod.importStatus.totalMessage = function (that) {
        var values = {
            totalNumFiles: that.totalNumFiles
        };
        return fluid.stringTemplate(that.options.strings.total, values);
    };
    
    /**
     * Assembles and returns a status message for the specified error
     * @param that, the component
     * @param errorName, the error to generate the message for
     * @return A string status message for the specified error
     */
    decapod.importStatus.errorMessage = function (that, errorName) {
        var values = {
            errorName: errorName,
            numErrors: that.model.errors[errorName]
        };
        return fluid.stringTemplate(that.options.strings[errorName], values);
    };
    
    /**
     * Returns an array of all the status messages.
     * The first message is for the total files, the rest for each of the errors.
     * @param that, the component
     * @return An aray of strings representing each of the status messges
     */
    decapod.importStatus.messages = function (that) {
        var messages = [];
        
        messages.push(that.totalMessage());
        $.each(that.model.errors, function (errorName) {
            messages.push(that.errorMessage(errorName));
        });
        
        return messages;
    };
    
    /**
     * Passes the status messages to the renderer subcomponent
     * for rendering them out to the UI.
     * @param that, the component
     */
    decapod.importStatus.renderStatuses = function (that) {
        that.renderer.model.statuses = that.messages();
        that.renderer.refreshView();
    };
    
    fluid.defaults("decapod.importStatus", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
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
            addValid: "decapod.importStatus.addValid",
            addError: "decapod.importStatus.addError",
            totalNumErrors: "decapod.importStatus.totalNumErrors",
            totalNumFiles: "decapod.importStatus.totalNumFiles",
            totalMessage: "decapod.importStatus.totalMessage",
            errorMessage: "decapod.importStatus.errorMessage",
            messages: "decapod.importStatus.messages",
            renderStatuses: "decapod.importStatus.renderStatuses"
        },
        model: {
            valid: 0,
            errors: {}
        },
        strings: {
            "total": "%totalNumFiles files found."
            // error messages take use %errorName and %numErrors for the template
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
