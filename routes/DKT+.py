""" Bi-directional Recurrent Neural Network.

A Bi-directional Recurrent Neural Network (LSTM) implementation example using 
TensorFlow library. This example is using the MNIST database of handwritten 
digits (http://yann.lecun.com/exdb/mnist/)

Links:
    [Long Short Term Memory](http://deeplearning.cs.cmu.edu/pdfs/Hochreiter97_lstm.pdf)
    [MNIST Dataset](http://yann.lecun.com/exdb/mnist/).

Author: Aymeric Damien
Project: https://github.com/aymericdamien/TensorFlow-Examples/
"""
from __future__ import absolute_import, division, print_function, unicode_literals
import pymongo
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
import input_data

# mongodb to numpy data
client = pymongo.MongoClient("localhost")
db = client.IntelliC
collection = db.tmp_test
# i = int(0)
# for n in range(0, 5000):
#     i += 1
#     post = {"q_id": i,
#             "tags": [random.randint(1, 100), random.randint(1, 100), random.randint(1, 100)],
#             "percentage": random.uniform(0, 1)}
#     collection.insert_one(post)
train_data = pd.DataFrame(list(collection.find({}, {"tags": 1, "percentage": 1, "_id": 0}).sort("_id", pymongo.ASCENDING)))
train_tags = pd.DataFrame(list(train_data.tags))
x_train = tf.keras.utils.to_categorical(train_tags) # one-hot
y_train = train_data.percentage * 100
y_train = tf.keras.utils.to_categorical(y_train) # y_train[i] = y_raw*100好转化成one-hot编码

# model = tf.keras.Sequential([tf.keras.layers.Dense(100, input_shape=(3,), activation="relu"), tf.keras.layers.Dense(100), tf.keras.layers.Dense(10), tf.keras.layers.Dense(1)])
# model.add(tf.keras.layers.Dense(1, input_shape=(1,))) # Dense: ax+b=Y-expect
# model.summary()
# model.compile(optimizer="adam", loss="mse")
# model.fit(training_tags, training_percentage, epochs=1000)
# test_tags = training_tags
# print(test_tags)
# p = model.predict(test_tags)
# print(p)
# print(training_percentage)


""" ------------------------------------ LSTM -------------------------------------- """
from keras.datasets import mnist
from keras.layers import Dense, LSTM
from keras.utils import to_categorical
from keras.models import Sequential


def lstm_model(input_size, output_size, num_of_layers):
    model = Sequential()
    # units: output size of this layer
    # input_shape:(batch_size, input_dim, input_length)
    model.add(LSTM(units=1, input_length=x_train[1], input_dim=x_train[2], activation="relu"))
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

model = lstm_model(5000, 1, 1)
model.fit(x_train, y_train)

model.summary()

# score = model.evaluate(x_test, y_test,batch_size=128, verbose=1)
# print(score)