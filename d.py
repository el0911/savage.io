# import numpy as np
# d = [ 0.009751146820633027,
#   0.20331000610420993,
#   0.03729308632820124,
#   0.017944463535719324,
#   0.15834420674820399,
#   0.03651751590310607,
#   0.0007878291703406342,
#   0.04268016630706386,
#   0.2992519920075304 ]
# def dd(x):
#     w = d[0:-1]
#     w = np.multiply(w,x)
#     w = np.sum(w)
#     return np.add(w,d[-1])


# print(dd([ 7,147,76,0,0,39.4,0.257,43 ]))



import numpy as np
import pandas as pd
def sigmoid(x):
    return 1.0/(1+ np.exp(-x))

def sigmoid_derivative(x):
    return x * (1.0 - x)

class NeuralNetwork:
    def __init__(self, x, y):
        self.input      = x
        self.weights1   = np.random.rand(self.input.shape[1],38) 
        self.weights2   = np.random.rand(38,1)                 
        self.y          = y
        self.output     = np.zeros(self.y.shape)

    def feedforward(self):
        self.layer1 = sigmoid(np.dot(self.input, self.weights1))
        self.output = sigmoid(np.dot(self.layer1, self.weights2))

    def backprop(self):
        # application of the chain rule to find derivative of the loss function with respect to weights2 and weights1
        d_weights2 = np.dot(self.layer1.T, (2*(self.y - self.output) * sigmoid_derivative(self.output)))
        d_weights1 = np.dot(self.input.T,  (np.dot(2*(self.y - self.output) * sigmoid_derivative(self.output), self.weights2.T) * sigmoid_derivative(self.layer1)))

        # update the weights with the derivative (slope) of the loss function
        self.weights1 += d_weights1
        self.weights2 += d_weights2


if __name__ == "__main__":
    X = np.array([[0, 0, 0, 1],#1
        [0, 0, 1, 0],#2
        [0, 0, 1, 1],#3
        [0, 1, 0, 0],#4
        [0, 1, 0, 1],#5
        [0, 1, 1, 0],#6
        [0, 1, 1, 1],#7
        [1, 0, 0, 0]])
    y = np.array([[0], [1], [0], [1], [0], [1], [0], [1]])

    df = pd.read_csv('diabetes.csv')
    
    df = df.values

    X = df[:,0:-1]

    Y = df[:,-1]

    y = []
    
    for i in range(len(Y)):
        y.append([i])
        pass


    nn = NeuralNetwork(X,np.array(y))


    for i in range(3000):
        if( i % 100 == 0):
            print((np.sum(np.abs(nn.y - nn.output))) )
            pass
        nn.feedforward()
        nn.backprop()

    