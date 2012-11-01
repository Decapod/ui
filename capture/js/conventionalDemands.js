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
     
    fluid.demands("cameraStatusSource", ["decapod.capturer"], {
        options: {
            url: "http://localhost:8081/conventional/cameras/"
        }
    });
    
    fluid.demands("captureStatusSource", ["decapod.capturer"], {
        options: {
            url: "http://localhost:8081/conventional/"
        }
    });
    
    fluid.demands("deleteStatusSource", ["decapod.capturer"], {
        options: {
            url: "http://localhost:8081/conventional/"
        }
    });
    
    fluid.demands("imageSource", ["decapod.capturer"], {
        options: {
            url: "http://localhost:8081/conventional/capture/images/%captureIndex"
        }
    });
    
    fluid.demands("captureSource", ["decapod.capturer"], {
        options: {
            url: "http://localhost:8081/conventional/capture/"
        }
    });
    
    // local filesystem
    fluid.demands("cameraStatusSource", ["decapod.fileSystem", "decapod.capturer"], {
        options: {
            url: "../../mock-data/capture/mockCameraStatus.json"
        }
    });
    
    fluid.demands("captureStatusSource", ["decapod.fileSystem", "decapod.capturer"], {
        options: {
            url: "../../mock-data/capture/mockCaptureStatus.json"
        }
    });
    
    fluid.demands("deleteStatusSource", ["decapod.fileSystem", "decapod.capturer"], {
        options: {
            url: "../../mock-data/capture/mockCaptureStatus.json"
        }
    });
    
    fluid.demands("imageSource", ["decapod.fileSystem", "decapod.capturer"], {
        options: {
            url: "../../mock-data/capture/mockImagesByIndex.json"
        }
    });
    
    fluid.demands("captureSource", ["decapod.fileSystem", "decapod.capturer"], {
        options: {
            url: "../../mock-data/capture/mockCaptureResponse.json"
        }
    });
    
})(jQuery);
