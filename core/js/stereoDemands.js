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
/*global decapod:true, fluid*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function () {

    "use strict";

    /*********************
     *  stereo Demands*
     *********************/

    fluid.demands("processSource", "decapod.dewarper", {});

    fluid.demands("processSource", "decapod.calibrator", {});

    fluid.demands("processSource", ["decapod.fileSystem", "decapod.dewarper"], {
        options: {
            url: "../../mock-data/dewarp/mockDewarpedArchive.json"
        }
    });

    fluid.demands("processSource", ["decapod.fileSystem", "decapod.calibrator"], {
        options: {
            url: "../../mock-data/calibrate/mockCalibrate.json"
        }
    });

    fluid.demands("status", "decapod.calibrator", {});

    fluid.demands("status", "decapod.dewarper", {
        options: {
            listeners: {
                "{decapod.stereo}.events.onCapturesFileSelected": {
                    listener: "{decapod.stereo.status}.events.hideInitial.fire",
                    priority: "first"
                }
            }
        }
    });

    fluid.demands("start", "decapod.calibrator", {});

    fluid.demands("start", "decapod.dewarper", {
        options: {
            listeners: {
                "{decapod.stereo}.events.onCalibrationSuccess": {
                    listener: "{start}.setState",
                    args: ["enabled"]
                },
                "{decapod.stereo}.events.onCapturesFileSelected": {
                    listener: "{start}.setState",
                    args: ["disabled"]
                },
                "{decapod.stereo}.events.onCalibrationFileSelected": {
                    listener: "{start}.setState",
                    args: ["disabled"]
                }
            }
        }
    });

})(jQuery);