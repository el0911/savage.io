
const math = require('mathjs')

class Savage {

  constructor() {
    console.log('savage model initailized!!');

  }

  Linear_Regression(data, label, lossfunction) {
    data = math.matrix(data)
    data = this.normalise(data)
    data={
     'x':data.valueOf() ,
      'y':label
    }
    
    
    return this.optimizers()['gradient_descent'](data)
  }


  K_Nearest_Neighbour(data, points) {

  }


  normalise(data) {
    'data normalysed'
    return math.divide(math.subtract(data, math.min(data)), math.subtract(math.max(data), math.min(data)))
  }

  optimizers(algorithm) {
    const this_ = this
    return {
      'gradient_descent': function (data) {
        let element = {m:0,c:0};

        for (let i = 0; i < 1000; i++) {
           element = this_.loss_functions()['mse']['compute_gradient'](element,data,0.01)            
          }


          return element

      },
      'adamopt': function () {
        ///adam optimizer
      }
    }

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
        'compute_gradient': function  (params2,data,lr){
          var params={m:0,c:0};
          for (var i = 0; i < data.x.length; i++) {
            params.m=params.m - 2/data.x.length*data.x[i]*(data.y[i] - ((params2.m * data.x[i])+params2.c))
            params.c=params.c - 2/data.x.length*(data.y[i] - ((params2.m * data.x[i])+params2.c))
              }
          params.m=params2.m - (lr*params.m);
          params.c=params2.c - (lr*params.c);
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