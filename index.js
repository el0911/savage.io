
const math = require('mathjs')
const fs = require('fs');
const csv = require('csvtojson')
// const request=require('request')



class Savage {

  model() {
    console.log('model initialised!!');
  }

  constructor() {
    console.log('savage library initailized!!');
    this.data = ''
  }

  loadDataFromCSV(link, removeFirstRow) {

    this.data = fs.readFileSync(link, { encoding: 'utf8' }).split('\n');
    if (removeFirstRow) {
      this.data.shift()
    }

    for (let i = 0; i < this.data.length; i++) {

      this.data[i] = this.data[i].split(',')

    }


  }

  // loadDataFromURL(link,removeFirstRow){
  //   csv()
  //   .fromStream(request.get(link))
  //   .subscribe((json)=>{
  //       return new Promise((resolve,reject)=>{
  //           // long operation for each json e.g. transform / write into database.
  //       })
  //   },onError,onComplete)
  // }

  head(number) {
    const data = this.data

    if (!number) {
      number = 5
    }


    for (let i = 0; i < number; i++) {

      console.log(data[i]);
    }
  }




  linearRegression(data, label, lossfunction, lr, itterations) {
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



    return this.optimizers('gradient_descent', data, dimensions, expression, lr, itterations)
  }


  K_Nearest_Neighbour(data, points) {

  }


  normalise(data) {
    console.log('data normalysed');

    return math.divide(math.subtract(data, math.min(data)), math.subtract(math.max(data), math.min(data)))
  }

  optimizers(optimizer, data, dimensions, expression, lr, itterations) {
    const this_ = this
    const optimer_dic = {

      'gradient_descent': function () {
        let element = math.multiply(0, math.range(0, dimensions)).valueOf()

        for (let i = 0; i < itterations; i++) {
          console.log('itter ' + i);

          element = this_.lossFunctions('mse', element, data, lr, expression, dimensions)
        }


        return element

      },
      'adamopt': function () {
        ///adam optimizer
      }
    }
    return optimer_dic[optimizer]()


  }

  lossFunctions(lossFunction, element, data, lr, expression, dimensions) {
    // optimizers to write
    // 1. Binary Cross Entropy 
    // 2. Negative Log Likelihood
    // 3. Margin Classifier
    // 4. Soft Margin Classifier


    const lossFunctionsDict = {
      'mse': {
        '__function__': function (predicted, real_value) {
          //me an squared error
          return math.divide(math.square(math.subtract(predicted, real_value)), data.lenth)
        },
        'compute_gradient': function (params2, data, lr, expression, dimensions) {
          const h = math.parse(expression)

          let expressions_list = []
          for (let i = 1; i <= dimensions; i++) {
            if (i == dimensions) {

              const dh = math.derivative(h, 'c')
              const new_ = math.parse('(2 / n) * ( ' + dh.toString() + ' * ( y - ( ' + expression + ' )  ) )')
              // console.log(new_.toString());
              expressions_list.push(new_)

            }
            else {
              const dh = math.derivative(h, 'w' + i)
              const new_ = math.parse('(2 / n) * ( ' + dh.toString() + ' * ( y - ( ' + expression + ' )  ) )')
              // console.log(new_.toString());
              expressions_list.push(new_)
            }
          }

          // console.log(h.eval({ 'x1': 3,'w1':5,'c':6 }));



          var params = math.multiply(0, params2).valueOf();
          for (var i = 0; i < data.x.length; i++) {
            // params[0] = params[0] - 2 / data.x.length * data.x[i] * (data.y[i] - ((params2[0] * data.x[i]) + params2[1]))
            // params[1] = params[1] - 2 / data.x.length * (data.y[i] - ((params2[0] * data.x[i]) + params2[1]))
            let d = {}

            for (let j = 0; j < dimensions; j++) {
              ////solving every equation 

              const x = 'x' + (j + 1)
              const w = 'w' + (j + 1)

              if (j < (dimensions - 1)) {
                d[x] = data.x[i][j]
                d['n'] = data.x.length
                d[w] = params2[j]
                d['c'] = params2[dimensions - 1]
                d['y'] = data.y[i]
              }



            }


            for (let j = 0; j < dimensions; j++) {

              const math_function = expressions_list[j].compile().valueOf()
              params[j] = params[j] - math_function.eval(d)


            }


          }

          for (let j = 0; j < dimensions; j++) {
            params[j] = params2[j] - (lr * params[j]);
          }
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

    return lossFunctionsDict[lossFunction]['compute_gradient'](element, data, lr, expression, dimensions)

  }


};


class Savage_model {
  constructor() {
    console.log('savage model initialized');
    this.model = []
    this.bias = []
    this.activations = ['sigmoid', 'softmax']
  }

  addDense(config) {
    let output = config['output']
    let input = config['input']
    let activation = config['activation']
    if (!activation) {
      throw Error('you must pass in an activation function')
    }

    if (!this.activations.includes(activation)) {
      throw Error('Unrecognised activation function')
    }

    if (!input) {
      if (!this.model.length < 1) {
        ///means this isnt the input layer so we can move on
        input = this.model[this.model.length - 1]['output']
      }
      else {
        throw Error('you must define input dimension for first layer')
      }
    }

    if (this.model.length == 0) this.input = input

    this.model.push({
      'inputs': input,
      'activation': activation,
      'output': output,
      'weights': math.random([input, output]),////creatte a random matrix
      'bias': 0,////same
      'index': this.model.length - 1
    })
  }

  run(inputs, labels, itterations) {
    this.labels = labels
    this.inputs = inputs
    for (let index = 0; index < itterations; index++) {
      this.feedForWard(inputs)
      this.backPropagation(index)
    }
  }

  sigmoid(x) {

    return math.dotDivide(1, math.add(1, math.exp(math.multiply(-1, x))))
  }

  sigmoidPrime(s) {
    return math.dotMultiply(s, math.subtract(1, s))  //s * (1 - s)
  }

  backPropagation(index) {

    let input = this.input
    //  this.sigmoidPrime(math.multiply(input,this.model[0].weights))
    let error = []
    let delta = []

    ///since its backwards we start at the end
    for (let i = this.model.length - 1; i >= 0; i--) {
      if (i == this.model.length - 1) {
        error = math.subtract(this.labels, this.layers[this.layers.length - 1])
        if (index % 100 == 0) {
          console.log('error is = ', math.sum(math.abs(error)));
        }
      }
      else {

        error = math.multiply(delta[delta.length - 1], math.transpose(this.model[i + 1].weights))

      }

      let layer_delta = math.dotMultiply(error, this.sigmoidPrime(this.layers[i + 1]))
      delta.push(layer_delta)
      ///update model weights
      this.model[i].weights = math.add(this.model[i].weights, math.multiply(math.transpose(this.layers[i]), layer_delta))



    }


    // l1 = nonlin(np.dot(l0, syn0))
    // l2 = nonlin(np.dot(l1, syn1))

    // l2_error = y - l2
    // if (j % 10000) == 0:
    //     print("Error: " + str(np.mean(np.abs(l2_error))))

    // l2_delta = l2_error * nonlin(l2, deriv=True)
    // l1_error = l2_delta.dot(syn1.T)
    // l1_delta = l1_error * nonlin(l1, deriv=True)

    // syn1 += l1.T.dot(l2_delta)
    // syn0 += l0.T.dot(l1_delta)


  }

  predict(sample) {
    let ans = this.feedForWard(sample)
    return ans[ans.length - 1];
  }

  modelSave(fileName) {
    let model = this.model
    let file = fs.createWriteStream(fileName);
    model = JSON.stringify(model)
    file.on('error', function(err) { /* error handling */ });
    file.write(model);
    file.end()
  }

  loadModel(modelDirectory){
    let model = fs.readFileSync(modelDirectory, { encoding: 'utf8' })
    model = JSON.parse(model)
    this.model  = model
    console.log('model loaded into object!')
  }

  feedForWard(inputs) {
    let layers = []
    layers.push(inputs)
    for (let i = 0; i < this.model.length; i++) {
      const element = this.model[i];
      inputs = layers[layers.length - 1]
      layers.push(this.sigmoid(math.add(math.multiply(inputs, element.weights), element.bias)))
    }

    //so i try and run every item in a model
    this.layers = layers
    return this.layers ///this is just for the predict function
  }


}

module.exports = { Savage, Savage_model }


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