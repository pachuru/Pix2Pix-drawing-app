import pix2pix_model as model
import tensorflow as tf
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from tensorflow.keras import regularizers
from keras.engine.saving import load_model
import argparse
from matplotlib import pyplot
import image_handler
import routes

def summarize_performance(iteration, source_img, target_img, fake_img, n_samples=1):

    source_img = image_handler.scale_img_pixels(source_img)
    target_img = image_handler.scale_img_pixels(target_img)
    fake_img = image_handler.scale_img_pixels(fake_img)
    
    pyplot.subplot(131)
    pyplot.axis('off')
    pyplot.imshow(source_img)
    
    pyplot.subplot(132)
    pyplot.axis('off')
    pyplot.imshow(fake_img)
    
    pyplot.subplot(133)
    pyplot.axis('off')
    pyplot.imshow(target_img)

    filename = routes.pred_dir_path + 'prediction_%03d.png' % (iteration)
    pyplot.savefig(filename)
    pyplot.close()



parser = argparse.ArgumentParser(prog="network_trainer", description="Generates samples for a test set and stores the results in output/predictions")
parser.add_argument('input_dataset_path', help="The compressed dataset file path (.npz)")
parser.add_argument('input_model_path', help="The compressed generator model (.h5)")

args = parser.parse_args()

input_dataset_path = args.input_dataset_path
input_model_path = args.input_model_path

dataset = image_handler.load_dataset(input_dataset_path)

image_shape = dataset[0].shape[1:]

discriminator = model.discriminator(image_shape)
generator = model.generator(image_shape)
gan = model.gan(generator, discriminator, image_shape)

generator.load_weights(input_model_path)

source_images, target_images = dataset[0], dataset[1]
fake_images = generator.predict(source_images)

for i in range(len(dataset[0])):
    summarize_performance(i, source_images[i], target_images[i], fake_images[i])
