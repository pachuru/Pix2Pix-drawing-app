from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS

import pix2pix_model as model
from keras_preprocessing.image import load_img
from keras.preprocessing.image import img_to_array

from matplotlib import pyplot
import numpy as np
from PIL import Image
import base64
import re
import io
import png

app = Flask(__name__)
cors = CORS(app)
api = Api(app)




class RestApi(Resource):

    def __init__ (self):
        image_shape = (256,256,3)
        self.generator = model.generator(image_shape)
        model_path = './generator_model.h5'
        self.generator.load_weights(model_path)

    def saveImage(self, fake_image):
        sizes = np.shape(fake_image)
        fig = pyplot.figure()
        fig.set_size_inches(1. * sizes[0] / sizes[1], 1, forward = False)
        ax = pyplot.Axes(fig, [0., 0., 1., 1.])
        ax.set_axis_off()
        fig.add_axes(ax)
        ax.imshow(fake_image)
        pyplot.savefig('./prediction.png', dpi = sizes[0], cmap='hot') 
        pyplot.close()


    def processImage(self):
        image = load_img('./image.png', target_size=(256,256))
        image = img_to_array(image)
        image = (image - 127.5) / 127.5
        image_shape = image.shape
        image = np.expand_dims(image, axis=0)
        fake_image = self.generator.predict(image)[0]
        fake_image = (fake_image + 1) / 2.0
        self.saveImage(fake_image)



    def post(self):
        image_b64 = request.get_json()['data']
        image_data = re.sub('^data:image/.+;base64,', '', image_b64)
        image_data = base64.b64decode(image_data)
        buf = io.BytesIO(image_data)
        image_PIL = Image.open(buf)
        image_PIL.save('./image.png', quality=100)
        self.processImage()
        encoded_prediction = base64.b64encode(open("./prediction.png", "rb").read())
        encoded_prediction = re.sub('b\'', '', str(encoded_prediction))
        return jsonify({"encoded_prediction": str(encoded_prediction)})

api.add_resource(RestApi, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=False)