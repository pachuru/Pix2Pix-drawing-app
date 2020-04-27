import pix2pix_model as model
import argparse
import os
import sys
from pathlib import Path
from numpy import load
from numpy import ones
from numpy import zeros
from numpy.random import randint
from matplotlib import pyplot
from keras.engine.saving import load_model


output_dir_path = os.path.dirname(os.path.realpath(__file__))
output_dir_path = output_dir_path.replace("scripts","output")
samples_dir_path = output_dir_path + "\\images\\"
models_dir_path = output_dir_path + "\\models\\"

def retrieve_real_samples(dataset, n_samples, patch_shape):
    source_imgs, target_imgs = dataset
    random_index = randint(0, source_imgs.shape[0], n_samples)
    source_imgs, target_imgs = source_imgs[random_index], target_imgs[random_index]
    real_img_labels = ones((n_samples, patch_shape, patch_shape, 1))
    return [source_imgs, target_imgs], real_img_labels

def generate_fake_samples(generator, samples, patch_shape):
    fake_instances = generator.predict(samples)
    fake_img_labels = zeros((len(fake_instances), patch_shape, patch_shape, 1))
    return fake_instances, fake_img_labels

def scale_img_pixels(img):
    return (img + 1) / 2.0

def load_dataset(file_path):
    if os.path.exists(file_path) == False:
        sys.exit("Error: No file with path: " + file_path + " exists.")

    dataset = load(file_path)
    source_imgs , target_imgs = dataset['arr_0'], dataset['arr_1']
    source_imgs = (source_imgs - 127.5) / 127.5
    target_imgs = (target_imgs - 127.5) / 127.5
    return [source_imgs, target_imgs]

# TODO: Deberían de salir 3 filas
def summarize_performance(step, generator, dataset, n_samples=3):
    
    [source_imgs, target_imgs], _ = retrieve_real_samples(dataset, n_samples, 1)
    fake_imgs, _ = generate_fake_samples(generator, source_imgs, 1)

    source_imgs = scale_img_pixels(source_imgs)
    target_imgs = scale_img_pixels(target_imgs)
    fake_imgs = scale_img_pixels(fake_imgs)
    
    for i in range(n_samples):
        pyplot.subplot(3, n_samples, 1 + i)
        pyplot.axis('off')
        pyplot.imshow(source_imgs[i])
    
    for i in range(n_samples):
        pyplot.subplot(3, n_samples, 1 + n_samples + i)
        pyplot.axis('off')
        pyplot.imshow(fake_imgs[i])
    
    for i in range(n_samples):
        pyplot.subplot(3, n_samples, 1 + n_samples*2 + i)
        pyplot.axis('off')
        pyplot.imshow(target_imgs[i])

    filename = samples_dir_path + 'training_sample_%06d.png' % (step)
    pyplot.savefig(filename)
    pyplot.close()
    
def save_models(step, generator, discriminator, gan, verbose=False):

    save_model(step, "gen", generator)
    save_model(step, "dis", discriminator)
    save_model(step, "gan", gan)

    if(verbose):
        print('Saved model')

# TODO: ¿Is all this code necessary?
def save_model(step, name, model):
    filename = models_dir_path + name + '_%06d' % step
    '''
    model_json = model.to_json()
    with open(filename + ".json", "w") as json_file:
        json_file.write(model_json)
    '''
    model.save_weights(filename + '.h5')

def train(discriminator, generator, gan, dataset, n_epochs=100, n_batch=1):
    
    discriminator_patch_shape = discriminator.output_shape[1]
    source_imgs, target_imgs = dataset
    iterations = int(len(source_imgs) / n_batch)
    n_steps = iterations * n_epochs
    
    for i in range(n_steps):
        [source_imgs, target_imgs], real_labels = retrieve_real_samples(dataset, n_batch, discriminator_patch_shape)
        fake_imgs, fake_labels = generate_fake_samples(generator, source_imgs, discriminator_patch_shape)
        disc_loss_real = discriminator.train_on_batch([source_imgs, target_imgs], real_labels)
        disc_loss_fake = discriminator.train_on_batch([source_imgs, fake_imgs], fake_labels)
        gan_loss, _, _ = gan.train_on_batch(source_imgs, [real_labels, target_imgs])
        
        print('>%d, disc_loss_real[%.3f] disc_loss_fake[%.3f] gan_loss[%.3f]' % (i+1, disc_loss_real, disc_loss_fake, gan_loss))
        if (i % 100) == 0:
            save_models(i, generator, discriminator, gan)
            summarize_performance(i, generator, dataset)
    save_models(n_steps, generator, discriminator, gan)

parser = argparse.ArgumentParser(prog="network_trainer", description="Trains a model based on a compressed dataset (.npz)")
parser.add_argument('input_file_path', help="The compressed file path")
parser.add_argument('number_of_epochs', help="Number of epochs you expect the model to be trained")
parser.add_argument('-m', help="Indicates you're using a pretrained model", action='store_true')

parser.add_argument('--gen_path', help="The path of the generator model")
parser.add_argument('--dis_path', help="The path of the discriminator model")
parser.add_argument('--gan_path', help="The path of the gan model")

args = parser.parse_args()

input_file_path = args.input_file_path
number_of_epochs = int(args.number_of_epochs)
dataset = load_dataset(input_file_path)

image_shape = dataset[0].shape[1:]


discriminator = model.discriminator(image_shape)
generator = model.generator(image_shape)
gan = model.gan(generator, discriminator, image_shape)

# If a path is provided to load weights, load them.
if args.gen_path != None:
    generator.load_weights(args.gen_path)

if args.dis_path != None:
    discriminator.load_weights(args.dis_path)

if args.gan_path != None:
    gan.load_weights(args.gan_path)

summarize_performance(85454, generator, dataset)


#train(discriminator, generator, gan, dataset, number_of_epochs, 1)
