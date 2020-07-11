import pix2pix_model as model
import argparse
from matplotlib import pyplot
import image_handler
import routes


##print(model.discriminator([256,256,3]).summary())
print(model.generator([256,256,3]).summary())