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
    
    /**
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
    
    /**
     * 
     * @param {object} that, the component
     * @param {string} type, the ajax method (i.e. GET, POST, PUT)
     * @param {object} data, the data to send to the server, in the request
     * @param {object} urlTemplateValues, an optional object containing the key value pairs needed for string templating the url.
     * To use this, you need to pass in a string template as the URL in the components options.
     */
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
    
    /**
     * Renders out the thumbnails of page images, stored on the server, for the book
     */
    
    fluid.registerNamespace("decapod.renderThumbs");

    /**
     * Converts a jQuery event into the specified component event. 
     * It passes along the elPath to the portion of the model that triggered the event,
     * and the DOM event object.
     * 
     * @param {object} componentEvent, the component level event to be fired.
     * @param {object} modelElPath, the EL Path into the model related to the what triggered the event.
     * @param {object} DOMEvent, the DOM event that initially triggered the event.
     */
    decapod.renderThumbs.activateFn = function (componentEvent, modelELPath, DOMEvent) {
        componentEvent.fire(modelELPath, DOMEvent);
    };
    
    /**
     * The tree generation function to be used by the renderer.
     * 
     * TODO: Update to the new proto style. Couldn't at this moment
     * do to issues with the event bindings and alt text generation.
     * Couldn't make use of "that.renderer.boundPathForNode(item)" as
     * images in the renderer, do not produce a bound path. Also the
     * attrs decorator wouldn't respect the ${} syntax when setting values.
     */
    decapod.renderThumbs.generateTree = function (that) {
        var model = that.model.images;

        var treeMap = function (page, pageIndex) {
            return {
                ID: "thumbs:",
                children: [{
                    ID: "label",
                    messagekey: "index",
                    args: page
                }, {
                    ID: "image",
                    target: page.thumbnail,
                    decorators: [{
                        type: "attrs",
                        attributes: {alt: fluid.stringTemplate(that.options.strings.alt, page)}
                    }, {
                        type: "jQuery",
                        func: "click",
                        args: function (event) {
                            that.thumbActivateFn("images." + pageIndex, event);
                        }
                    }]
                }, {
                    ID: "delete",
                    messagekey: "delete",
                    decoratrs: [{
                        type: "jQuery",
                        func: "click",
                        args: function (event) {
                            that.deleteActivateFn("images." + pageIndex, event);
                        }
                    }]
                }]
            };
        };

        return {
            children: fluid.transform(model, treeMap)
        };
    };
    
    //TODO: Remove if not being used
    decapod.renderThumbs.finalInit = function (that) {};
    
    fluid.defaults("decapod.renderThumbs", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.renderThumbs.finalInit",
        produceTree: "decapod.renderThumbs.generateTree",
        selectors: {
            "thumbs": ".dc-renderThumbs-thumbs",
            "label": ".dc-renderThumbs-label",
            "image": ".dc-renderThumbs-image",
            "delete": ".dc-renderThumbs-delete"
        },
        repeatingSelectors: ["thumbs"],
        model: {}, // format "{images: [{index: 1, thumbnail: "path/to/thumbnail.png"}]}"
        strings: {
            "index": "%index",
            "alt": "Page %index",
            "delete": "Delete"
        },
        events: {
            deleteActivated: null,
            thumbActivated: null
        },
        invokers: {
            deleteActivateFn: {
                funcName: "decapod.renderThumbs.activateFn",
                args: ["{renderThumbs}.events.deleteActivated", "@0", "@1"]
            },
            thumbActivateFn: {
                funcName: "decapod.renderThumbs.activateFn",
                args: ["{renderThumbs}.events.thumbActivated", "@0", "@1"]
            }
        },
        renderOnInit: true,
        rendererFnOptions: {
            noexpand: true
        }
    });
    
    /*************************
     * decapod.renderPreview *
     *************************/
    
    /**
     * Renders out a preview of the selected page
     */
     
    fluid.registerNamespace("decapod.renderPreview");
    
    /**
     * The prototree used by the renderer to render out the preview image and it's label
     */
    decapod.renderPreview.produceTree = function (that) {
        var model = that.model;
        return {
            "label": {
                messagekey: "index",
                args: model
            },
            "image": {
                target: model.imagePath,
                decorators: [{
                    type: "attrs",
                     // the index property is changed to have an object {value: indexNum} instead of just a value of indexNum.
                    attributes: {alt: fluid.stringTemplate(that.options.strings.alt, {index: model.index.value})}
                }]
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
        strings: {
            "index": "%index",
            "alt": "Page %index"
        },
        events: {
            deleteTriggered: null
        },
        renderOnInit: true
    });
    
    /***************************
     * decapod.imageManagement *
     ***************************/
     
     /**
      * The page level component, handling the image management.
      * 
      * The model format is "{images: [{index: 1, originalName: "name.png", image: "path/to/image.png", thumbnail: "path/to/thumbnail.png"}]}" 
      */
    
    fluid.registerNamespace("decapod.imageManagement");

    decapod.imageManagement.preInit = function (that) {
        
        //TODO: remove fluid.setLogging and that.logEvent when proper even handlers have been defined.
        fluid.setLogging(true);
        that.logEvent = function (elPath) {
            var modelValue = fluid.get(that.model, elPath);
            fluid.log(modelValue);
        };
        
        /**
         * This is the callback function used to set the model.
         * It also binds the components modelChanged event to the change appliers
         * modelChanged event to broadcast it outside of the component.
         * Note that it does so after the model has been initially set.
         * 
         * Any further updates to the model should be done directly through the 
         * <code>updateModel</code> function.
         * 
         * @param {object} data, the data model that will be used by the componet
         */
        that.setup = function (data) {
            that.updateModel(data);
        
            that.applier.modelChanged.addListener("", that.events.modelChanged.fire);
        };
    };
    
    decapod.imageManagement.finalInit = function (that) {
        that.modelSource.get();
    };
    
    /**
     * Updates the components model through requests to the change applier
     * 
     * @param {object} newModel, the new model to update to
     * @param {object} applier, the applier to handle the model change request
     */
    decapod.imageManagement.updateModel = function (newModel, applier) {
        applier.requestChange("", newModel);
    };
    
    /**
     * Updates the preview's model and refreshes it's view.
     * 
     * @param {object} preview, The preview component to update
     * @param {object} model, the data model (likely the over all one from the top level component
     * @param {string} elPath, the EL Path into the model to set the preview's model to.
     */
    decapod.imageManagement.updatePreview = function (preview, model, elPath) {
        preview.model = fluid.get(model, elPath);
        preview.refreshView();
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
                    },
                    listeners: {
                        deleteActivated: "{imageManagement}.logEvent", // TODO: Change to real event handler
                        thumbActivated: "{imageManagement}.updatePreview"
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
            },
            updatePreview: {
                funcName: "decapod.imageManagement.updatePreview",
                args: ["{imageManagement}.renderPreview", "{imageManagement}.model", "@0"]
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

