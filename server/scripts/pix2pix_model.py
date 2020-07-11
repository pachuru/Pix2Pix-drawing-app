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


def encoder_block(init, input, num_filters, apply_batch_norm=True):
    
    enc_output = Conv2D(num_filters, (4,4), strides=(2,2), padding="same", kernel_initializer=init)(input)
    if(apply_batch_norm):
        enc_output = BatchNormalization()(enc_output, training=True)
    enc_output = LeakyReLU(alpha=0.2)(enc_output)

    return enc_output


# The decoder blocks take as input among others the skip connections with the encoders. This skip connections
# are then merged with the output of the normalized deconvoluted input.
def decoder_block(init, input, skip_connection, num_filters, apply_dropout=True):
    
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
    
    kernel_initializer = RandomNormal(stddev=0.02)
    input_image = Input(shape=image_shape)
    
    encoder_output_1 = encoder_block(kernel_initializer, input_image, 64, apply_batch_norm=False)
    encoder_output_2 = encoder_block(kernel_initializer, encoder_output_1 , 128)
    encoder_output_3 = encoder_block(kernel_initializer, encoder_output_2, 256)
    encoder_output_4 = encoder_block(kernel_initializer, encoder_output_3, 512)
    encoder_output_5 = encoder_block(kernel_initializer, encoder_output_4, 512)
    encoder_output_6 = encoder_block(kernel_initializer, encoder_output_5, 512)
    encoder_output_7 = encoder_block(kernel_initializer, encoder_output_6, 512)
    
    bottleneck = Conv2D(512, (4,4), strides=(2,2), padding='same', kernel_initializer=kernel_initializer)(encoder_output_7)
    bottleneck = Activation('relu')(bottleneck)
    
    decoder_output_1 = decoder_block(kernel_initializer, bottleneck, encoder_output_7, 512)
    decoder_output_2 = decoder_block(kernel_initializer, decoder_output_1, encoder_output_6, 512)
    decoder_output_3 = decoder_block(kernel_initializer, decoder_output_2, encoder_output_5, 512)
    decoder_output_4 = decoder_block(kernel_initializer, decoder_output_3, encoder_output_4, 512)
    decoder_output_5 = decoder_block(kernel_initializer, decoder_output_4, encoder_output_3, 256, apply_dropout=False)
    decoder_output_6 = decoder_block(kernel_initializer, decoder_output_5, encoder_output_2, 128, apply_dropout=False)
    decoder_output_7 = decoder_block(kernel_initializer, decoder_output_6, encoder_output_1, 64,  apply_dropout=False)
    
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
    




