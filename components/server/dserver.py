"""Module contains a fully operable stand-alone Decapod server.

It provides a resource-oriented approach to working with images (capturing,
deleting, generating thumbnails). It can be used with any client using the
provided uniform interface for accessing and modifying images.
"""

import cherrypy
import glob
import os
import simplejson as json
import sys
from PIL import Image

class ImageController(object):
    """Main class for manipulating images.

    Exposes operations such as capturing, post-processing and deleting pictures
    and sets of pictures. All URLs are considered a path to an image or to a set
    of images represented by a JSON file of their attributes."""

    images = []
    ind = 0

    @cherrypy.expose
    def index(self, *args, **kwargs):
        """Handles the /images/ URL - a collection of sets of images.

        Supports getting the list of images (GET) and adding a new image to the
        collection (POST). An option telling whether to use a camera can be
        passed."""

        method = cherrypy.request.method.upper()
        if method == "GET":
            cherrypy.response.headers["Content-Type"] = "application/json"
            cherrypy.response.headers["Content-Disposition"] = "attachment; filename='Captured images.json'"
            return json.dumps(self.images)

        elif method == "POST":
            params = cherrypy.request.params
            testingMode = params["testingMode"]
            ports, models = [None, None], [None, None]
            if "ports" in params and "models" in params:
                ports, models = params["ports"], params["models"]

            assert len(ports) >= 2
            assert len(models) >= 2

            first_image = self.take_picture(testingMode, ports[0], models[0])
            second_image = self.take_picture(testingMode, ports[1], models[1])

            cherrypy.response.headers["Content-type"] = "application/json"
            cherrypy.response.headers["Content-Disposition"] = "attachment; filename=Image%d.json" % len(self.images)
            model_entry = {"left": first_image, "right": second_image}
            self.images.append(model_entry)
            return json.dumps(model_entry)
        else:
            cherrypy.response.headers["Allow"] = "GET, POST"
            raise cherrypy.HTTPError(405)

    @cherrypy.expose
    def default(self, id, state=None):
        """Handles the /images/:id/ and /images/:id/:state URLs.

        Supports getting (GET) and deleting (DELETE) sets of images by their id.
        The first operation returns a JSON text with the paths to the images. If
        state is provided, GET returns a jpeg image with the specified state.
        POST is supported together with state, performing some operation(s) on
        the image."""

        index = int(id)
        if index < 0 or index >= len(self.images):
            raise cherrypy.HTTPError(404, "The specified resource is not currently available.")

        method = cherrypy.request.method.upper()
        if not state:
            if method == "GET":
                cherrypy.response.headers["Content-Type"] = "application/json"
                cherrypy.response.headers["Content-Disposition"] = "attachment; filename=Image%d.json" % index
                return json.dumps(self.images[index])

            elif method == "DELETE":
                return self.delete(index)

            else:
                cherrypy.response.headers["Allow"] = "GET, DELETE"
                raise cherrypy.HTTPError(405)

        else:
            if method == "GET":
                if not state in self.images[index]:
                    raise cherrypy.HTTPError(404, "The specified resource is not currently available.")

                path = self.images[index][state]
                cherrypy.response.headers["Content-type"] = "image/jpeg"
                file = open(path)
                content = file.read()
                file.close()
                return content

            elif method == "POST":
                if state.lower() == "processed":
                    #TODO Run crop & stitch process here instead of generating a thumbnail
                    size = 150, 100
                    filename = self.images[index]["left"]
                    im = Image.open(filename)
                    im.thumbnail(size, Image.ANTIALIAS)
                    thumbname = filename + "-thumb.jpg"
                    im.save(thumbname)
                    self.images[index]["thumb"] = thumbname
                    cherrypy.response.headers["Content-Type"] = "application/json"
                    return json.dumps(self.images[index])

            else:
                cherrypy.response.headers["Allow"] = "GET, POST"
                raise cherrypy.HTTPError(405)

    def take_picture(self, testingMode=True, port=None, model=None):
        """Capture an image and save it to disk.

        If the application is in testing mode, do not use a camera. Instead, get
        an image from the local filesytem."""

        path, filename = "testData/capturedImages/", ""
        if testingMode.lower() != "true":
            status = os.system("gphoto2 --capture-image --port=%s --camera='%s' 2>>capture.log" % (port, model))
            if status != 0:
                raise cherrypy.HTTPError(500, "Camera could not capture.")

            os.system("gphoto2 --list-files --port=%s --camera='%s' 2>>capture.log | tail -1 | grep '#[0-9]\{1,\}' -o >/tmp/output.tmp" % (port, model))
            file = open("/tmp/output.tmp", "r")
            content = file.read()
            file_index = content.lstrip("#")
            file.close()
            os.chdir(path)
            status = os.system("gphoto2 --get-file %d --force-overwrite --port=%s --camera='%s' 2>>../../capture.log | tail -1 >/tmp/output.tmp" % (int(file_index), port, model))
            os.chdir("../..")
            if status != 0:
                raise cherrypy.HTTPError(500, "Could not transfer file.")

            file = open("/tmp/output.tmp", "r")
            content = file.read()
            filename = path + content[content.rfind(" ") + 1 : len(content)].rstrip("\n")
            file.close()
        else:
            filename = path + "Image" + `self.ind` + ".jpg"
            self.ind = self.ind + 1
            
            files = glob.glob("testData/imageFeed/*")
            files.sort()
            file_count = len(files)

            name_to_open = files[self.ind % file_count]
            im = Image.open(name_to_open)
            im.save(filename);
        
        return filename

    def delete(self, index=None):
        """Delete an image from the list of images and from the file system."""

        for filename in self.images[index].values():
            os.unlink(filename)
        self.images.pop(index)
        return

class DecapodServer(object):
    """Main class for the Decapod server.

    Exposes the index and capture pages as a starting point for working with the
    application. Does not expose any image-related functionality."""

    @cherrypy.expose
    def index(self):
        raise cherrypy.HTTPRedirect("/capture")

    @cherrypy.expose
    def capture(self):
        html_path = "../capture/html/Capture.html"
        file = open(html_path)
        content = file.read()
        file.close()
        return content

    @cherrypy.expose
    def cameras(self):
        """Detects the cameras locally attached to the PC.

        Returns a JSON document, describing the camera and its capabilities:
        model, port, download support, and capture support."""

        cameras = []
        status = os.system("gphoto2 --auto-detect | grep '^Model\|^-' -v >/tmp/output.tmp")
        if status != 0:
            return json.dumps(cameras)

        file = open("/tmp/output.tmp")
        for line in file:
            info = line.split()
            port = info.pop().rstrip("\n")
            if port.endswith(":"):
                continue
            model = " ".join(info)

            status = os.system("gphoto2 --summary --camera='%s' --port=%s" % (model, port))
            if status != 0:
                capture = False
                download = False
            else:
                status = os.system("gphoto2 --summary --camera='%s' --port=%s | grep 'Generic Image Capture'" % (model, port))
                capture = (status == 0)
                
                status = os.system("gphoto2 --summary --camera='%s' --port=%s | grep 'No File Download'" % (model, port))
                download = (status != 0)

            camera = {"model": model, "port": port, "capture": capture, "download": download}
            cameras.append(camera)
        file.close()

        cherrypy.response.headers["Content-type"] = "application/json"
        cherrypy.response.headers["Content-Disposition"] = "attachment; filename=Cameras.json"
        return json.dumps(cameras)

if __name__ == "__main__":
    root = DecapodServer()
    root.images = ImageController()
    cherrypy.quickstart(root, "/", "dserver.conf")
