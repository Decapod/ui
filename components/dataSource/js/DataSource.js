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
     * e.g. url: server/library/book/images/1.png, url: server/library/book/images/2.png
     * you would then specify your url string template as url: "server/library/book/images/%image" and pass in {image: 1.png}
     * as the urlTemplateValues
     */
    fluid.registerNamespace("decapod.dataSource");
    
    /**
     * Performs the ajax operation.
     * 
     * It will merge the generated options ontop of those set in the components 
     * <code>ajaxOpts</code> option.
     * 
     * @param {object} that, the component
     * @param {string} type, the ajax method (i.e. GET, POST, PUT)
     * @param {object} data, the data to send to the server, in the request
     * @param {object} urlTemplateValues, an optional object containing the key value pairs needed for string templating the url.
     * To use this, you need to pass in a string template as the URL in the components options.
     */
    decapod.dataSource.method = function (that, type, data, urlTemplateValues) {
        var url = that.assembleURL(that.options.url, urlTemplateValues);
        var ajaxOpts = {
            type: type,
            url: url,
            data: data,
            success: function (data, textStatus, jqXHR) {
                that.events.success.fire(data, textStatus, jqXHR, type);
            },
            error: function (xhr, textStatus, errorThrown, type) {
                fluid.log("Error Status: " + textStatus);
                fluid.log("For url: " + url);
                fluid.log("ErrorThrown: " + errorThrown);
                that.events.error.fire(xhr, textStatus, errorThrown, url);
            }
        };
        
        var mergedOpts = fluid.merge("replace", that.options.ajaxOpts || {}, ajaxOpts);
        $.ajax(mergedOpts);
    };
    
    /**
     * Assembles a url template into a full url and encodes special characters
     * 
     * @param {string} urlTemplate, the url template
     * @param {object} urlTemplateValues, the key value pairs representing the values to insert into the url template
     */
    decapod.dataSource.assembleURL = function (urlTemplate, urlTemplateValues) {
        var url = fluid.stringTemplate(urlTemplate, urlTemplateValues || {});
        return encodeURI(url);
    };
    
    fluid.defaults("decapod.dataSource", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        invokers: {
            "delete": "decapod.dataSource.delete",
            get: "decapod.dataSource.get",
            post: "decapod.dataSource.post",
            put: "decapod.dataSource.put",
            assembleURL: "decapod.dataSource.assembleURL"
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
    
})(jQuery);


    