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
import tensorflow as tf
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from tensorflow.keras import regularizers
import datetime

import routes
import image_handler

#   Given an input compressed dataset and a number of epochs this script
#   trains a model. It also can (optionally) receive a pretrained model
#   for the discriminator, generator and/or GAN.

#   Generates and returns fake instances given some samples and also the same number of 
#   fake labels (patch_shape objects full of ones)

def generate_fake_samples(generator, samples, patch_shape):
    fake_instances = generator.predict(samples)
    fake_img_labels = zeros((len(fake_instances), patch_shape, patch_shape, 1))
    return fake_instances, fake_img_labels

#   Summarizes the performance by creating an image exposing source, target and 
#   generated images in some step of the training and saving that image.
 
def summarize_performance(step, generator, dataset, n_samples=3):
    
    [source_imgs, target_imgs], _ = image_handler.retrieve_real_samples(dataset, n_samples, 1)
    fake_imgs, _ = generate_fake_samples(generator, source_imgs, 1)

    source_imgs = image_handler.scale_img_pixels(source_imgs)
    target_imgs = image_handler.scale_img_pixels(target_imgs)
    fake_imgs = image_handler.scale_img_pixels(fake_imgs)
    
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

    filename = routes.samples_dir_path + 'training_sample_%03d.png' % (step)
    pyplot.savefig(filename)
    pyplot.close()

#   Saves the generator, discriminator and gan model in an specific state

def save_models(step, generator, discriminator, gan, verbose=False):

    save_model(step, "gen", generator)
    save_model(step, "dis", discriminator)
    save_model(step, "gan", gan)

    if(verbose):
        print('Saved model')

def save_model(step, name, model):
    filename = routes.models_dir_path + name + '_%03d' % step
    model.save_weights(filename + '.h5')

#   Given a discriminator, generator and gan model in conjunction with a number of epochs
#   and a data_size it trains the networks.
#   It also saves a log for displaying a Tensorboard (at real time or after training) that
#   shows the training performance.
#   The trained models are stored periodically (also the summarized performances).

def train(discriminator, generator, gan, dataset, n_epochs=100, batch_size=1):
    
    discriminator_patch_shape = discriminator.output_shape[1]
    source_imgs, target_imgs = dataset
    epoch_size = len(source_imgs)
    batches_per_epoch = int(epoch_size / batch_size)
    n_steps = batches_per_epoch * n_epochs

        
    log_dir = os.path.join(routes.log_dir_path, datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
    summary_writer = tf.summary.create_file_writer(logdir=log_dir)

    for i in range(n_steps):
        [source_imgs, target_imgs], real_labels = image_handler.retrieve_real_samples(dataset, batch_size, discriminator_patch_shape)
        fake_imgs, fake_labels = generate_fake_samples(generator, source_imgs, discriminator_patch_shape)
        disc_loss_real = discriminator.train_on_batch([source_imgs, target_imgs], real_labels)
        disc_loss_fake = discriminator.train_on_batch([source_imgs, fake_imgs], fake_labels)
        gan_loss, _, _ = gan.train_on_batch(source_imgs, [real_labels, target_imgs])

        with summary_writer.as_default():
            tf.summary.scalar('gan_loss', gan_loss, step=int(i / batches_per_epoch))
            tf.summary.scalar('disc_loss_real', disc_loss_real,  step=int(i / batches_per_epoch))
            tf.summary.scalar('disc_loss_fake', disc_loss_fake,  step=int(i / batches_per_epoch))

        if ((i + 1) % (epoch_size)) == 0:
            print("EPOCH %d FINISHED" % ((i + 1) % (epoch_size)))
            print('>%d, disc_loss_real[%.3f] disc_loss_fake[%.3f] gan_loss[%.3f]' % (i+1, disc_loss_real, disc_loss_fake, gan_loss))
            summarize_performance((i + 1) / epoch_size, generator, dataset)
        if ((i + 1) % (epoch_size * 10)) == 0:
            print("SAVING MODEL")
            save_models((i + 1) / epoch_size, generator, discriminator, gan)
            
    save_models(n_steps, generator, discriminator, gan)

parser = argparse.ArgumentParser(prog="network_trainer", description="Trains a model based on a compressed dataset (.npz)")
parser.add_argument('input_file_path', help="The compressed file path")
parser.add_argument('number_of_epochs', help="Number of epochs you expect the model to be trained")

parser.add_argument('--gen_path', help="The path of the generator model")
parser.add_argument('--dis_path', help="The path of the discriminator model")
parser.add_argument('--gan_path', help="The path of the gan model")

args = parser.parse_args()

input_file_path = args.input_file_path
number_of_epochs = int(args.number_of_epochs)
dataset = image_handler.load_dataset(input_file_path)

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

train(discriminator, generator, gan, dataset, number_of_epochs, 1)
