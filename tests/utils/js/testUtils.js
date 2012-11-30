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
/*global decapod:true, fluid, jQuery, jqUnit*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    fluid.registerNamespace("decapod.testUtils.exportType");
    
    // functions
    decapod.testUtils.componentFromDecorator = function (comp, decorators) {
        for (var decorator in decorators) {
            if (decorator.indexOf(comp) > -1) {
                return decorators[decorator];
            }
        }
    };
    
    // assertions
    decapod.testUtils.exportType.assertSelectRender = function (that) {
        var selected = $(":selected", that.locate("choices"));
        jqUnit.assertEquals("The text for the label should be set", decapod.globalMessages.exporter_select_label, that.locate("label").text());
        $("option", that.locate("choices")).each(function (idx, elm) {
            var opt = $(elm);
            jqUnit.assertEquals("The text for the " + idx + " option should be set", that.model.names[idx], opt.text());
            if (idx === that.model.choices.indexOf(that.model.selection)) {
                jqUnit.assertTrue("The option should be selected", opt.is(":selected"));
            } else {
                jqUnit.assertFalse("The option should not be selected", opt.is(":selected"));
            }
        });
        jqUnit.assertEquals("The correct value for the selection should be set", that.model.selection, selected.val());
    };
    
    decapod.testUtils.exportType.assertOutputSettingsRender = function (that) {
        var labelElms = that.locate("label");
        var valueElms = that.locate("val");
        var unitElms = that.locate("unit");
        var errorElms = that.locate("errorMessage");
        $.each(that.model.settings, function (idx, setting) {
            var valueElm = valueElms.eq(idx);
            jqUnit.assertEquals("The label should be set", setting.name, labelElms.eq(idx).text());
            jqUnit.assertEquals("The value should be set", setting.value, valueElm.val());
            jqUnit.assertEquals("The unit should be set", setting.unit, unitElms.eq(idx).text());
            // due to a work around for FLUID-4737, have to adjust the templating to use the array style.
            jqUnit.assertEquals("The errorMessage should be set", fluid.stringTemplate(decapod.globalMessages.exporter_outputSettings_errorMessage, [setting.attrs.min, setting.attrs.max]), errorElms.eq(idx).text());
            $.each(setting.attrs, function (attr, val) {
                jqUnit.assertEquals("The " + attr + " should be set", val, valueElm.attr(attr));
            }); 
        });
    };
    
    decapod.testUtils.exportType.assertExportOptionsState = function (that, state) {
        var filter = ":" + state;
        jqUnit.assertTrue("The output select box should be " + state, that.output.locate("choices").is(filter));
        that.outputSettings.locate("val").each(function (idx, elm) {
            jqUnit.assertTrue("The outputSettings " + that.model.outputSettings.settings[idx].name + " form field should be " + state, $(elm).is(filter));
        });
    };
    
    decapod.testUtils.exportType.assertexportInfoRender = function (that, expectedName, expectedDesc) {
        jqUnit.assertEquals("The format name should have been rendered", expectedName, that.locate("name").text());
        jqUnit.assertEquals("The description should be rendered", expectedDesc, that.locate("description").text());
    };
    
    decapod.testUtils.exportType.assertPDFOptionsRender = function (that) {
        decapod.testUtils.exportType.assertSelectRender(that.output);
        decapod.testUtils.exportType.assertOutputSettingsRender(that.outputSettings);
    };
    
    decapod.testUtils.exportType.assertTriggerRender = function (that) {
        var trigger = that.locate("trigger");
        jqUnit.assertEquals("The export button should be rendered", decapod.globalMessages.exporter_exportControls_trigger_trigger, trigger.text());
        jqUnit.isVisible("The export control should be visible", trigger);
    };
    
    decapod.testUtils.exportType.assertProgressRender = function (that) {
        jqUnit.assertEquals("The progress text should be rendered", decapod.globalMessages.exporter_exportControls_progress_message, that.locate("message").text());
        jqUnit.assertEquals("The warning text should be rendered", decapod.globalMessages.exporter_exportControls_progress_warning, that.locate("warning").text());
    };
    
    decapod.testUtils.exportType.assertFluidProgressState = function (that, percent, label) {
        jqUnit.assertEquals("The initial progress should be at zero", percent, that.storedPercent);
        jqUnit.assertEquals("The initial progress label should be", label, that.locate("label").text());
    };
    
    decapod.testUtils.exportType.assertCompleteRender = function (that) {
        var downloadHREF = that.locate("download").attr("href").replace($(location).attr('href'), '');
        jqUnit.assertEquals("The download text should be rendered", decapod.globalMessages.exporter_exportControls_complete_download, that.locate("download").text());
        jqUnit.assertEquals("The download url should be set", that.model.downloadURL, downloadHREF);
        jqUnit.assertEquals("The restart text should be set", decapod.globalMessages.exporter_exportControls_complete_restart, that.locate("restart").text());
    };
    
    decapod.testUtils.exportType.assertShowTriggerControls = function (that) {
        jqUnit.assertFalse("The progress shouldn't have initialized", that["**-renderer-progress-0"]);
        jqUnit.assertFalse("The complete controls shouldn't have initialized", that["**-renderer-complete-0"]);
        decapod.testUtils.exportType.assertTriggerRender(that["**-renderer-trigger-0"]);
    };
    
    decapod.testUtils.exportType.assertShowProgressControls = function (that) {
        jqUnit.assertFalse("The trigger shouldn't have initialized", that["**-renderer-trigger-0"]);
        jqUnit.assertFalse("The complete controls shouldn't have initialized", that["**-renderer-complete-0"]);
        decapod.testUtils.exportType.assertProgressRender(that["**-renderer-progress-0"]);
    };
    
    decapod.testUtils.exportType.assertShowDetailedProgressControls = function (that) {
        jqUnit.assertFalse("The trigger shouldn't have initialized", that["**-renderer-trigger-0"]);
        jqUnit.assertFalse("The complete controls shouldn't have initialized", that["**-renderer-complete-0"]);
        decapod.testUtils.exportType.assertFluidProgressState(that["**-renderer-progress-0"].progress, 0, that["**-renderer-progress-0"].options.strings.initialProgressMessage);
    };
    
    decapod.testUtils.exportType.assertShowCompleteControls = function (that) {
        jqUnit.assertFalse("The trigger shouldn't have initialized", that["**-renderer-trigger-0"]);
        jqUnit.assertFalse("The progress shouldn't have initialized", that["**-renderer-progress-0"]);
        decapod.testUtils.exportType.assertCompleteRender(that["**-renderer-complete-0"]);
    };
})(jQuery);
