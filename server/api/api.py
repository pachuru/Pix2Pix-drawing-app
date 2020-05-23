from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS

import numpy as np
from PIL import Image
import base64
import re
import io

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

class HelloWorld(Resource):
    def post(self):
        image_b64 = request.get_json()['data']
        image_data = re.sub('^data:image/.+;base64,', '', image_b64)
        image_data = base64.b64decode(image_data)
        buf = io.BytesIO(image_data)
        image_PIL = Image.open(buf)
        image_PIL.save('./image.png', quality=100)
        return jsonify({"status":"200 OK"})

api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)