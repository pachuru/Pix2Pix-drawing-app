#!/usr/bin/env python
# coding: utf-8

from os import listdir
from numpy import asarray
from numpy import vstack
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import load_img
from numpy import savez_compressed


def load_images(path, size=(256,512)):
    source_imgs_list, target_imgs_list = list(), list()
    for filename in listdir(path):
        img_pixels = load_img(path + filename, target_size=size)
        img_pixels = img_to_array(img_pixels)
        # The source and target images came as a unique image where half of it is
        # the source and the other half the target.
        source_img, target_img = img_pixels[:, :256], img_pixels[:, 256:]
        source_imgs_list.append(source_img)
        target_imgs_list.append(target_img)
    return [asarray(source_imgs_list), asarray(target_imgs_list)]        

from pathlib import Path

path = "./maps/maps/train/"
if not Path("./maps_256.npz").exists():
    [source_images, target_images] = load_images(path)


filename = 'maps_256.npz'
if not Path("./maps_256.npz").exists():
    savez_compressed(filename, source_images, target_images)


from numpy import load
from numpy import zeros
from numpy import ones
from numpy.random import randint
from keras.optimizers import Adam
from keras.initializers import RandomNormal
from keras.models import Model
from keras.models import Input
from keras.layers import Conv2D
from keras.layers import Conv2DTranspose
from keras.layers import LeakyReLU
from keras.layers import Activation
from keras.layers import Concatenate
from keras.layers import Dropout
from keras.layers import BatchNormalization
from keras.layers import LeakyReLU
from matplotlib import pyplot

import tensorflow as tf
gpus = tf.config.experimental.list_physical_devices('GPU')
tf.config.experimental.set_virtual_device_configuration(
          gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=5000)])


## DISCRIMINATOR

# The architecture we're using for the discriminator is the *U-Net*.

# If we concieve a "block" in this context as the set of operations that are executed repeatedly, 
# then a discriminator block only changes in the number of filters it has, it stride length and 
# the input that it receives. Also, in the first layer the batch normalization musn't be performed.

def discriminator_block(init, num_filters, stride_length, input, apply_batch_norm = True):
    
    output = Conv2D(num_filters, (4,4), strides=stride_length, padding='same', kernel_initializer=init)(input)
    if(apply_batch_norm):
        output = BatchNormalization()(output)
    output = LeakyReLU(alpha=0.2)(output)
    
    return output


# As Input to the discriminator a source image and its target image are passed and then concatenated.
# The target image is the one we're trying to generate so it can either be a real or a fake one.
# The source image will remain always the same and condition the discriminator network.

def discriminator(image_shape):
    
    kernel_initializer = RandomNormal(stddev=0.02)
    
    input_source_image = Input(shape=image_shape)
    input_target_image = Input(shape=image_shape)
    
    merged_inputs = Concatenate()([input_source_image, input_target_image])
    
    dis_output = discriminator_block(kernel_initializer, 64,  (2,2), merged_inputs, False)
    dis_output = discriminator_block(kernel_initializer, 128, (2,2), dis_output)
    dis_output = discriminator_block(kernel_initializer, 256, (2,2), dis_output)
    dis_output = discriminator_block(kernel_initializer, 512, (2,2), dis_output)
    dis_output = discriminator_block(kernel_initializer, 512, (1,1), dis_output)
    
    # Here we're using as a final output activation layer a Sigmoid function because we want to generate
    # an image of patches where each patch is a number between 0 or 1 representing the likelihood of that 
    # patch being real or fake (generated).
    dis_output = Conv2D(1, (4,4), padding='same', kernel_initializer=kernel_initializer)(dis_output)
    patch_out = Activation('sigmoid')(dis_output)
    
    model = Model([input_source_image, input_target_image], patch_out)
    
    optimizer_technique = Adam(lr=0.0002, beta_1=0.5)
    model.compile(loss='binary_crossentropy', optimizer=optimizer_technique, loss_weights=[0.5])
    
    return model


## ENCODER

def encoder_block(input, num_filters, apply_batch_norm=True):
    
    init = RandomNormal(stddev=0.02)
    
    enc_output = Conv2D(num_filters, (4,4), strides=(2,2), padding="same", kernel_initializer=init)(input)
    if(apply_batch_norm):
        enc_output = BatchNormalization()(enc_output, training=True)
    enc_output = LeakyReLU(alpha=0.2)(enc_output)

    return enc_output


# The decoder blocks take as input among others the skip connections with the encoders. This skip connections
# are then merged with the output of the normalized deconvoluted input.
def decoder_block(input, skip_connection, num_filters, apply_dropout=True):
    
    init = RandomNormal(stddev=0.02)
    
    dec_output = Conv2DTranspose(num_filters, (4,4), strides=(2,2), padding="same", kernel_initializer=init)(input)
    dec_output = BatchNormalization()(dec_output, training=True)
    if(apply_dropout):
        dec_output = Dropout(0.5)(dec_output, training=True)
    dec_output = Concatenate()([dec_output, skip_connection])
    dec_output = Activation('relu')(dec_output)
    

    return dec_output


# The generator takes as input an image, this image will be the source image or (in our case) a semantic
# labeling map from which we want to obtain a realistic image (target image).
def generator(image_shape=(256,256,3)):
    
    init = RandomNormal(stddev=0.02)
    input_image = Input(shape=image_shape)
    
    encoder_output_1 = encoder_block(input_image, 64, apply_batch_norm=False)
    encoder_output_2 = encoder_block(encoder_output_1 , 128)
    encoder_output_3 = encoder_block(encoder_output_2, 256)
    encoder_output_4 = encoder_block(encoder_output_3, 512)
    encoder_output_5 = encoder_block(encoder_output_4, 512)
    encoder_output_6 = encoder_block(encoder_output_5, 512)
    encoder_output_7 = encoder_block(encoder_output_6, 512)
    
    bottleneck = Conv2D(512, (4,4), strides=(2,2), padding='same', kernel_initializer=init)(encoder_output_7)
    bottleneck = Activation('relu')(bottleneck)
    
    decoder_output_1 = decoder_block(bottleneck, encoder_output_7, 512)
    decoder_output_2 = decoder_block(decoder_output_1, encoder_output_6, 512)
    decoder_output_3 = decoder_block(decoder_output_2, encoder_output_5, 512)
    decoder_output_4 = decoder_block(decoder_output_3, encoder_output_4, 512)
    decoder_output_5 = decoder_block(decoder_output_4, encoder_output_3, 256, apply_dropout=False)
    decoder_output_6 = decoder_block(decoder_output_5, encoder_output_2, 128, apply_dropout=False)
    decoder_output_7 = decoder_block(decoder_output_6, encoder_output_1, 64,  apply_dropout=False)
    
    generator_output = Conv2DTranspose(3, (4,4), strides=(2,2), padding="same", kernel_initializer=init)(decoder_output_7)
    output_image = Activation('tanh')(generator_output)
    
    model = Model(input_image, output_image)
    return model
    
def gan(generator, discriminator, image_shape):
    
    discriminator.trainable = False
    
    input_source_img = Input(shape=image_shape)
    
    generator_output = generator(input_source_img)
    discriminator_output = discriminator([input_source_img, generator_output])
    
    model = Model(input_source_img, [discriminator_output, generator_output])
    optimizer_technique = Adam(lr=0.0002, beta_1=0.5)
    model.compile(loss=['binary_crossentropy', 'mae'], optimizer=optimizer_technique, loss_weights=[1,100])
    
    return model
    
def load_real_samples(filename):
    data = load(filename)
    source_imgs , target_imgs = data['arr_0'], data['arr_1']
    source_imgs = (source_imgs - 127.5) / 127.5
    target_imgs = (target_imgs - 127.5) / 127.5
    return [source_imgs, target_imgs]


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


def summarize_performance(step, generator, dataset, n_samples=3):
    
    [source_imgs, target_imgs], _ = retrieve_real_samples(dataset, n_samples, 1)
    fake_imgs, _ = generate_fake_samples(generator, source_imgs, 1)
    
    
    source_imgs = scale_img_pixels(source_imgs)
    target_imgs = scale_img_pixels(target_imgs)
    fake_imgs = scale_img_pixels(fake_imgs)
    
    for i in range(n_samples):
        pyplot.subplot(3, n_samples, 1 + n_samples + i)
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

    filename = 'plot_%06d.png' % (step + 1)
    pyplot.savefig(filename)
    pyplot.close()
    

def save_model(generator, step, verbose=False):
    filename = 'model_%06d.h5' % (step + 1)
    generator.save(filename)
   
    if(verbose):
        print('Saved model: %s ' % (filename))


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
            save_model(i, generator)
    save_model(n_steps, generator)

dataset = load_real_samples('maps_256.npz')

image_shape = dataset[0].shape[1:]

discriminator = discriminator(image_shape)

generator = generator(image_shape)

gan = gan(generator, discriminator, image_shape)

summarize_performance(1, generator, dataset)

train(discriminator, generator, gan, dataset, 10, 1)
