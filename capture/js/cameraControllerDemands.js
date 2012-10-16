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
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    
    /************************
     * Sub-componet Demands *
     ************************/
     
    // Uncomment the code below when then top capture component is in place 
    // and adjust the context to use that component.
//    fluid.demands("decapod.cameraController", ["decapod.capture"], {
//        funcName: "decapod.dataSource",
//        options: {
//            url: "http://localhost:8081/stereo/capture"
//        }
//    });
    
//    fluid.demands("decapod.cameraController", ["decapod.capture", "decapod.filesystem"], {
    fluid.demands("decapod.cameraController", ["decapod.filesystem"], {
        funcName: "decapod.dataSource",
        options: {
            
        }
    });
    
    fluid.demands("decapod.dataSource", ["decapod.fileSystem"], {
        options: {
            url: "../../../mock-data/capture/mockCaptureResponse.json"
        }
    });
})(jQuery);