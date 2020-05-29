from __future__ import absolute_import, division, print_function, unicode_literals
import sys
import pymongo
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from keras.utils import to_categorical
from keras.layers import Dense, LSTM
from keras.utils import to_categorical
from keras.models import Sequential, load_model

NUM_OF_TAGS = 10 # 标签数，同时也是feature矩阵的维度（这么多个特征决定是该题）
batch_size = 10 # 一次处理多少个样本
input_dim = NUM_OF_TAGS #s 输入维度
units = 64 # LSTM hidden layer
output_size = 101 # probablility of answering a question right
TIME_STEP = 1
# mongodb to numpy data
client = pymongo.MongoClient("localhost")
db = client.IntelliC
collection_train = db.tmp_train
collection_test = db.tmp_test
# i = int(0)
# for n in range(0, 100):
#     i += 1
#     post = {"q_id": i,
#             "tags": [random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1)],
#             "percentage": random.randint(0,100)}
#     collection_train.insert_one(post)
# j = int(0)
# for n in range(0, 100):
#     j += 1
#     post = {"q_id": j,
#             "tags": [random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1)],
#             "percentage": 0}
#     collection_test.insert_one(post)
train_data = pd.DataFrame(list(collection_train.find({}, {"tags": 1, "percentage": 1, "_id": 0}).sort("_id", pymongo.ASCENDING)))
x_train = pd.DataFrame(list(train_data.tags))
# x_train = x_train.to_numpy().reshape(x_train.shape[0], TIME_STEP, x_train.shape[1])
x_train = to_categorical(x_train, num_classes=2)
y_train = train_data.percentage
y_train = to_categorical(y_train, num_classes=output_size)
print(x_train.shape)
print(y_train)

test_data = pd.DataFrame(list(collection_test.find({}, {"tags": 1, "percentage": 1, "_id": 0}).sort("_id", pymongo.ASCENDING)))
x_test = pd.DataFrame(list(test_data.tags))
# x_test = x_test.to_numpy().reshape(x_test.shape[0], TIME_STEP, x_test.shape[1])
x_test = to_categorical(x_test, num_classes=2)
y_test = test_data.percentage
y_test = to_categorical(y_train, num_classes=output_size)


""" ------------------------------------ LSTM -------------------------------------- """

def build_model(allow_cudnn_kernel=True):
    # CuDNN is only available at the layer level, and not at the cell level.
    # This means `LSTM(units)` will use the CuDNN kernel,
    # while RNN(LSTMCell(units)) will run on non-CuDNN kernel.
    if allow_cudnn_kernel:
        # The LSTM layer with default options uses CuDNN.
        lstm_layer1 = tf.keras.layers.LSTM(units, input_shape=(10, 2), return_sequences=True) # x_train.shape[1],x_train.shape[2]
        lstm_layer2 = tf.keras.layers.LSTM(units * 2, return_sequences=False)
        # lstm_layer3 = tf.keras.layers.LSTM(units * 2, return_sequences=False)
    else:
        # Wrapping a LSTMCell in a RNN layer will not use CuDNN.
        lstm_layer = tf.keras.layers.RNN(
            tf.keras.layers.LSTMCell(units),
            input_shape=(10, 2))

    model = tf.keras.models.Sequential([

        lstm_layer1,
        lstm_layer2,
        # lstm_layer3,
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(output_size, activation='softmax')]
    )
    return  model

model = build_model(allow_cudnn_kernel=True)
model.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])

history = model.fit(x_train, y_train,
          # validation_data=(x_test, y_test),
          batch_size=batch_size,
          epochs=700)

model.save('test_model.h5')

y_pred = model.predict(x_test,batch_size = 1).tolist()
print(y_pred)
final_y = []
i = 0
for pi in y_pred:
    i = i+1
    final_y.append(pi.index(max(pi)))
    collection_test.update_one({'q_id': i}, {'$set': {'percentage': pi.index(max(pi))}})
print(final_y)

# ==================================== Testing Reload Model ============================================
model = load_model('test_model.h5')
# i = int(100)
# for n in range(0, 100):
#     i += 1
#     post = {"q_id": i,
#             "tags": [random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1), random.randint(0, 1)],
#             "percentage": random.randint(0,100)}
#     collection_train.insert_one(post)
# train_data = pd.DataFrame(list(collection_train.find({}, {"tags": 1, "percentage": 1, "_id": 0}).sort("_id", pymongo.ASCENDING)))
# x_train = pd.DataFrame(list(train_data.tags))
# # x_train = x_train.to_numpy().reshape(x_train.shape[0], TIME_STEP, x_train.shape[1])
# x_train = to_categorical(x_train, num_classes=2)
# y_train = train_data.percentage
# y_train = to_categorical(y_train, num_classes=output_size)
# print(x_train.shape)
# print(y_train)
# history = model.fit(x_train, y_train,
#           # validation_data=(x_test, y_test),
#           batch_size=batch_size,
#           epochs=5000)