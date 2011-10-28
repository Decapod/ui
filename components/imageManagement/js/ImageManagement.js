/*
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    /**********************
     * decapod.dataSource *
     **********************/
    
    /*
     * The dataSource should be used to communicate to the server.
     * 
     * A new dataSource should be specified for each url, or cases where the options to the ajax call vastly differ.
     * However, since there can be an infinite number of urls, you can speficy a string templat for the url and pass 
     * in optional template values to each of the REST methods.
     * This is useful in cases where you are making requests to specific resources that differ only slightly.
     * e.g. url: server/book/images/1.png, url: server/book/images/2.png
     * you would then specify your url string template as url: "server/book/images/%image" and pass in {image: 1.png}
     * as the urlTemplateValues
     */
    fluid.registerNamespace("decapod.dataSource");
    
    decapod.dataSource.method = function (that, type, data, urlTemplateValues) {
        var url = urlTemplateValues ? fluid.stringTemplate(that.options.url, urlTemplateValues) : that.options.url;
        var ajaxOpts = {
            type: type,
            url: url,
            data: data,
            success: function (data, textStatus, jqXHR) {
                that.events.success.fire(data, textStatus, jqXHR);
            },
            error: function (xhr, textStatus, errorThrown) {
                fluid.log("Error Status: " + textStatus);
                fluid.log("For url: " + url);
                fluid.log("ErrorThrown: " + errorThrown);
                that.events.error.fire(xhr, textStatus, errorThrown, url);
            }
        };
        
        var mergedOpts = fluid.merge("replace", that.options.ajaxOpts || {}, ajaxOpts);
        $.ajax(mergedOpts);
    };
    
    fluid.defaults("decapod.dataSource", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        invokers: {
            get: {
                funcName: "decapod.dataSource.method",
                args: ["{dataSource}", "GET", "@0", "@1"]
            },
            post: {
                funcName: "decapod.dataSource.method",
                args: ["{dataSource}", "POST", "@0", "@1"]
            },
            put: {
                funcName: "decapod.dataSource.method",
                args: ["{dataSource}", "PUT", "@0", "@1"]
            }
        },
        // Can pass in any options available to jQuery.ajax(), except for url, type, success, and error.
        // For these, you should make use of the components options and functions
        ajaxOpts: {
            dataType: "json"
        }, 
        events: {
            success: null,
            error: null
        },
        url: "" // can be a string template for the url, with template values being supplied to the various REST methods
        
    });
    
    /************************
     * decapod.renderThumbs *
     ************************/
    
    /*
     * Renders out the thumbnails of page images, stored on the server, for the book
     */
    
    fluid.registerNamespace("decapod.renderThumbs");
    
    decapod.renderThumbs.produceTree = function (that) {
        return {
            expander: {
                type: "fluid.renderer.repeat",
                repeatID: "repeateContainer:",
                controlledBy: "images", // the property in the model that sets the repeat
                pathAs: "thumbInfo",
                tree: {
                    "label": "${{thumbInfo}.index}",
                    "image": {
                        target: "${{thumbInfo}.thumbnail}"
                    },
                    "delete": {
                        decorators: {
                            type: "jQuery",
                            func: "click",
                            args: function () {that.events.deleteTriggered.fire();}  //TODO: Need to pass along info about which item triggered the event.
                        }
                    }
                }
            }
        };
    };
    
    fluid.defaults("decapod.renderThumbs", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        produceTree: "decapod.renderThumbs.produceTree",
        selectors: {
            "repeateContainer": ".dc-renderThumbs-item",
            "label": ".dc-renderThumbs-label",
            "image": ".dc-renderThumbs-image",
            "delete": ".dc-renderThumbs-delete"
        },
        repeatingSelectors: ["repeateContainer"],
        model: {}, // format "{images: [{index: 1, thumbnail: "path/to/thumbnail.png"}]}"
        events: {
            deleteTriggered: null
        },
        renderOnInit: true
    });
    
    /*************************
     * decapod.renderPreview *
     *************************/
     
    fluid.registerNamespace("decapod.renderPreview");
     
    decapod.renderPreview.produceTree = function (that) {
        return {
            "label": that.model.index,
            "image": {
                target: that.model.imagePath
            }
        };
    };
    
    fluid.defaults("decapod.renderPreview", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        produceTree: "decapod.renderPreview.produceTree",
        selectors: {
            "label": ".dc-renderPreview-label",
            "image": ".dc-renderPreview-image"
        },
        repeatingSelectors: ["repeateContainer"],
        model: {}, // format "{index: 1, imagePath: "path/to/thumbnail.png"}"
        events: {
            deleteTriggered: null
        },
        renderOnInit: true
    });
    
    /***************************
     * decapod.imageManagement *
     ***************************/
     
     /*
      * The model format is "{images: [{index: 1, originalName: "name.png", image: "path/to/image.png", thumbnail: "path/to/thumbnail.png"}]}" 
      */
    
    fluid.registerNamespace("decapod.imageManagement");

    decapod.imageManagement.preInit = function (that) {
        that.setup = function (data) {
            if (that.model) {
                that.updateModel(data);
            } else {
                that.model = data || {};
            }
        
            that.applier.modelChanged.addListener("", that.events.modelChanged.fire);
        };
    };
    
    decapod.imageManagement.finalInit = function (that) {
        that.modelSource.get();
    };
    
    decapod.imageManagement.updateModel = function (newModel, applier) {
        applier.requestChange("", newModel);
    };
    
    fluid.defaults("decapod.imageManagement", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.imageManagement.preInit",
        finalInitFunction: "decapod.imageManagement.finalInit",
        components: {
            renderThumbs: {
                type: "decapod.renderThumbs",
                container: "{imageManagement}.dom.thumbnails",
                options: {
                    model: "{imageManagement}.model",
                    events: {
                        afterRender: "{imageManagement}.events.afterThumbsRendered"
                    }
                },
                createOnEvent: "afterModelLoaded"
            },
            renderPreview: {
                type: "decapod.renderPreview",
                container: "{imageManagement}.dom.preview",
                options: {
                    model: "{imageManagement}.model.images.0"
                },
                createOnEvent: "afterModelLoaded"
            },
//            reorderer: {
//                type: "fluid.reorderList",
//                options: {
//                    selectors: {
//                        movables: ".dc-imageManagement-thumbItem"
//                    }
//                },
//                createOnEvent: "afterThumbsRendered"
//            },
            modelSource: {
                type: "decapod.dataSource",
                options: {
                    events: {
                        success: "{imageManagement}.events.afterModelLoaded"
                    }
                }
            }
        },
        invokers: {
            updateModel: {
                funcName: "decapod.imageManagement.updateModel",
                args: ["@0", "{imageManagement}.applier"]
            }
        },
        modelDataSource: "",
        selectors: {
            thumbnails: ".dc-imageManagement-thumbnails",
            preview: ".dc-imageManagement-preview"
        },
        events: {
            afterThumbsRendered: null,
            afterModelLoaded: null,
            modelChanged: null 
        },
        listeners: {
            afterModelLoaded: "{imageManagement}.setup"
        }
    });
    
})(jQuery);

