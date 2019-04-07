
const math = require('mathjs')

class Savage {

  constructor() {
    console.log('savage model initailized!!');

  }

  Linear_Regression(data, label, lossfunction) {
    data = math.matrix(data)
    let dimensions = math.size(data).valueOf();
    if (dimensions.length > 1) {
      dimensions = dimensions[1] + 1
    }
    else {
      dimensions = 2
    }
    // i need to get the dimension of this so i can know haw many params am using

    data = this.normalise(data)
    data = {
      'x': data.valueOf(),
      'y': label
    }


    let expression = ''
    for (let i = 1; i < dimensions; i++) {
      expression = expression + 'x' + i + ' * w' + i + ' + '  //x being the variabe w being the weight
    }
    expression = expression + 'c'
    console.log(expression);



    return this.optimizers('gradient_descent', data, dimensions, expression)
  }


  K_Nearest_Neighbour(data, points) {

  }


  normalise(data) {
    'data normalysed'
    return math.divide(math.subtract(data, math.min(data)), math.subtract(math.max(data), math.min(data)))
  }

  optimizers(optimizer, data, dimensions, expression) {
    const this_ = this
    const optimer_dic = {

      'gradient_descent': function () {
        let element = math.multiply(0, math.range(0, dimensions)).valueOf()

        for (let i = 0; i < 1000; i++) {
          element = this_.loss_functions()['mse']['compute_gradient'](element, data, 0.01, expression, dimensions)
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
        'compute_gradient': function (params2, data, lr, expression, dimensions) {
          const h = math.parse(expression)

          let expressions_list = []
          for (let i = 1; i < dimensions; i++) {
            const dh = math.derivative(h, 'w' + i)
            const new_ = math.parse('(2 / n) * ( ' + dh.toString() + ' * ( y - ( ' + expression + ' )  ) )')
            // console.log(new_.toString());
            expressions_list.push(new_)
          }
          const dh = math.derivative(h, 'c')
          const new_ = math.parse('(2 / n) * ( ' + dh.toString() + ' * ( y - ( ' + expression + ' )  ) )')
          // console.log(new_.toString());
          expressions_list.push(new_)
          // console.log(h.eval({ 'x1': 3,'w1':5,'c':6 }));



          var params = math.multiply(0, params2).valueOf();
          for (var i = 0; i < data.x.length; i++) {
            // params[0] = params[0] - 2 / data.x.length * data.x[i] * (data.y[i] - ((params2[0] * data.x[i]) + params2[1]))
            // params[1] = params[1] - 2 / data.x.length * (data.y[i] - ((params2[0] * data.x[i]) + params2[1]))

            for (let j = 0; j < dimensions-1; j++) {
              ////solving every equation 

              const x = 'x' + (j+1)
              const w = 'w' + (j+1)
              let d = {}

              d[x] = data.x[i]
              d['n'] = data.x.length
              d[w] = params2[0]
              d['c'] = params2[1]
              d['y'] = data.y[i]
              // console.log(d);
              
              params[j] = params[j] - expressions_list[j].eval(d).valueOf()
              params[dimensions - 1] = params[dimensions - 1] - expressions_list[dimensions - 1].eval(d).valueOf()
            }


            
            
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