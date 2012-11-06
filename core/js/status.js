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
/*global setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /******************
     * decapod.status *
     ******************/
    
    fluid.registerNamespace("decapod.status");

    decapod.status.updateStatus = function (that, status) {
        that.applier.requestChange("currentStatus", status);
    };
    
    decapod.status.updateStatusStyle = function (that) {
        var status = that.model[that.model.currentStatus];
        if (status.style) {
            that.container.addClass(status.style);
        }
    };
    
    decapod.status.validateStatusChange = function (that, model, changeRequest) {
        var accept = true;
        if (changeRequest.type === "ADD" && changeRequest.path === "currentStatus") {
            accept = !!model[changeRequest.value];
        }
        
        if (!accept) {
            that.events.onStatusChangeError.fire(changeRequest);
        }
        
        return accept;
    };

    decapod.status.produceTree = function (that) {
        var status = that.model[that.model.currentStatus];
        return {
            refresh: {
                messagekey: "refresh"
            },
            name: status.name,
            description: {
                markup: status.description
            }
        };
    };
    
    decapod.status.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        // Similar to the comment above but specifically a work around for FLUID-4334
        that.refreshView = function () {
            that.renderer.refreshView();
        };
        
        that.updateStatus = function (newStatus) {
            that.updateModel(newStatus);
        };
        
        that.updateStatusStyle = function () {
            that.updateStatusStyle();
        };
    };

    decapod.status.finalInit = function (that) {
        that.applier.modelChanged.addListener("currentStatus", function (newModel, oldModel) {
            that.events.afterStatusChanged.fire(newModel.currentStatus, oldModel.currentStatus);
        });
        
        that.applier.guards.addListener("", that.validateStatusChange);
        
        that.refreshView();
        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.status", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.status.preInit",
        finalInitFunction: "decapod.status.finalInit",
        produceTree: "decapod.status.produceTree",
        strings: {
            refresh: "Refresh"
        },
        selectors: {
            name: ".dc-status-name",
            description: ".dc-status-description",
            refresh: ".dc-status-refresh"
        },
        model: {}, // in the form {currentStatus: "statusKey", statusKey: {name: "status name", description: "status description", style: "classes to add"}}
        events: {
            onReady: null,
            afterStatusChanged: null,
            onStatusChangeError: null
        },
        listeners: {
            "afterStatusChanged.refreshView": "{status}.refreshView",
            "afterRender.updateStatusStyle": "{status}.updateStatusStyle"
        },
        invokers: {
            updateStatus: "decapod.status.updateStatus",
            updateStatusStyle: "decapod.status.updateStatusStyle",
            validateStatusChange: "decapod.status.validateStatusChange"
        }
    });
})(jQuery);
