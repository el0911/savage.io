
const math = require('mathjs')

class Savage {

  constructor() {
    console.log('savage model initailized!!');

  }

  Linear_Regression(data, label, lossfunction) {
    data = math.matrix(data)
    let dimensions = math.size(data).valueOf();
    if(dimensions.length > 1){
      dimensions = dimensions[1]+2
    }
    else{
      dimensions = 3
    }
    // i need to get the dimension of this so i can know haw many params am using

    data = this.normalise(data)
    data = {
      'x': data.valueOf(),
      'y': label
    }

    console.log(dimensions);
    

    return this.optimizers('gradient_descent', data, dimensions)
  }


  K_Nearest_Neighbour(data, points) {

  }


  normalise(data) {
    'data normalysed'
    return math.divide(math.subtract(data, math.min(data)), math.subtract(math.max(data), math.min(data)))
  }

  optimizers(optimizer, data, dimensions) {
    const this_ = this
    const optimer_dic = {
      'gradient_descent': function () {
        let element = math.multiply(0, math.range(1, dimensions)).valueOf()

        for (let i = 0; i < 1000; i++) {
          element = this_.loss_functions()['mse']['compute_gradient'](element, data, 0.01)
        }


        return element

      },
      'adamopt': function () {
        ///adam optimizer
      }
    }
    return optimer_dic[optimizer]()


  }

  loss_functions(lossfunction) {
    // optimizers to write
    // 1. Binary Cross Entropy 
    // 2. Negative Log Likelihood
    // 3. Margin Classifier
    // 4. Soft Margin Classifier


    return {
      'mse': {
        '__function__': function (predicted, real_value) {
          //me an squared error
          return math.divide(math.square(math.subtract(predicted, real_value)), data.lenth)
        },
        'compute_gradient': function (params2, data, lr) {
          var params = math.multiply(0,params2 ).valueOf();
          for (var i = 0; i < data.x.length; i++) {
            params[0] = params[0] - 2 / data.x.length * data.x[i] * (data.y[i] - ((params2[0] * data.x[i]) + params2[1]))
            params[1] = params[1] - 2 / data.x.length * (data.y[i] - ((params2[0] * data.x[i]) + params2[1]))
          }
          params[0] = params2[0] - (lr * params[0]);
          params[1] = params2[1] - (lr * params[1]);
          return params
        }

      },
      'abserror': function (params) {
        //absolute error
      },
      'smoothabserror': function (params) {
        //smooth abs error
      }
    }

  }


};

module.exports = Savage


// // work with an expression tree, evaluate results
// const h = math.parse('x^2 + x')
// const dh = math.derivative(h, 'x')
// console.log(dh.toString()) // '2 * x + 1'
// console.log(dh.eval({ x: 3 })) // '7'

// chained operations
// math.chain(3)
//     .add(4)
//     .multiply(2)
//     .done() // 14