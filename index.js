
const math = require('mathjs')
const fs = require('fs');
const csv = require('csvtojson')
// const request=require('request')



class Savage {



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

  modelSave(fileName) {
    let fullmodel = {
          model: this.model,
          values: this.model_values
    }
    let file = fs.createWriteStream(fileName);
    model = JSON.stringify(fullmodel)
    file.on('error', function (err) { /* error handling */ });
    file.write(model);
    file.end()
  }

  loadModel(fileName) {
    let fullmodel = fs.readFileSync(fileName, { encoding: 'utf8' })
    fullmodel = JSON.parse(fullmodel)
    this.model = fullmodel['model']
    this.model_values = fullmodel['model_values']
    console.log('model loaded into object!')
  }

  predict(sample) {
    const length = this.model_values.length
    const weights = this.model_values.slice(0, length)
    const bias = this.model_values[length]
    
    let ans = math.add(math.multiply(sample,weights),bias)
    return ans;
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
    this.model = expression
    this.model_values = this.optimizers('gradient_descent', data, dimensions, expression, lr, itterations)

    return this.model_values
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
              expressions_list.push(new_)

            }
            else {
              const dh = math.derivative(h, 'w' + i)
              const new_ = math.parse('(2 / n) * ( ' + dh.toString() + ' * ( y - ( ' + expression + ' )  ) )')
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
      'input': input,
      'activation': activation,
      'output': output,
      'iterations': 100000,
      'weights': math.random([input, output]),////creatte a random matrix
      'bias': math.random([output]),////same
      'index': this.model.length - 1
    })
  }

  run(input, labels, itterations, batch) {
    let inputBuffer = input
    for (let index = 0; index < itterations; index++) {

      ///here i divide the datset into batches to train 
      let trainedItemCheck = 0 //variable to check  how many items ive passed through to train 
      // for (let i = 0; i <= parseInt(labels.length/batch); i++) {
      ///so i first send the elements batch by batch
      const rand_index = (Math.floor(Math.random() * (inputBuffer.length - 1 + 1)) + 1) - 1

      this.input = input[rand_index]
      this.label = labels[rand_index]


      this.feedForWard(this.input)
      this.backPropagation(index, 1, batch)

      // }
      if (index % 10000 == 0) {
        console.log("Itterration " + index);
      }
      // console.log(inputBuffer.length);
      // console.log(input.length);

      // inputBuffer.splice(rand_index,1)
      // if (inputBuffer.length == 2) {
      //   inputBuffer = input
      // }
    }
  }

  sigmoid(x) {
    return math.dotDivide(1, math.add(1, math.exp(math.dotMultiply(-1, x))))
  }

  dataClassesDistribution(labels) {
    let data = {}
    labels.forEach(element => {
      if (!data.hasOwnProperty(element)) {
        data[element] = 1
      }
      else data[element] = data[element] + 1
    });


  }

  sigmoidPrime(s) {
    return math.dotMultiply(s, math.subtract(1, s))  //s * (1 - s)
  }

  backPropagation(Itterration, batchPosition, batchSize) {
    const learning_rate = 0.2
    let dcost_dz = 0
    let deltas = []
    for (let index = this.model.length - 1; index >= 0; index--) {
      deltas.push(0)
    }


    for (let index = this.model.length - 1; index >= 0; index--) {
      let weights = this.model[index].weights
      let bias = this.model[index].bias
      const target = this.label
      const dz_db = 1
      const prediction = this.layers[this.model.length] ///am not subtracting by one in this index cuz the layers is longer than the model by 1 cuz of the input data
      const error = math.subtract(prediction, target)


      if (index == this.model.length - 1) {///input layer

        const input = this.layers[index]//input to the layer is the output from previous layer

        const layerToFindDer = this.layerToFindDer[index + 1]

        const derivativeOfCost = math.multiply(2, error)

        const derivativeOfPrediction = this.sigmoidPrime(prediction)

        deltas[index] = math.multiply(derivativeOfCost, derivativeOfPrediction)
        const dcost_dw = math.multiply(learning_rate, math.multiply(input, deltas[index]))

        const dcost_db = math.multiply(deltas[index], dz_db)

        weights = math.subtract(weights, math.transpose([dcost_dw]))
        this.model[index].bias = math.subtract(bias, math.multiply(learning_rate, dcost_db))
        this.model[index].weights = weights
      }
      else {
        // console.log(deltas);

        const outputFromThisLayer = [this.layers[index + 1]]//input to the layer is the output from previous layer  
        const error = math.multiply(deltas[index + 1], math.transpose(this.model[index + 1].weights))

        const input = math.transpose([this.layers[index]])//input to the layer is the output from previous layer     


        deltas[index] = math.dotMultiply(error, this.sigmoidPrime(outputFromThisLayer))


        const adjustmentValue = math.multiply(learning_rate, math.multiply(input, deltas[index]))
        weights = math.subtract(weights, adjustmentValue)
        this.model[index].weights = weights

        const biasadjustmentValue = math.multiply(learning_rate, math.multiply(1, deltas[index]))
        bias = math.subtract(bias, biasadjustmentValue[0])
        this.model[index].bias = bias

        // // [1,4] -->input [3,4] -->error



      }

    }


  }

  predict(sample) {
    let ans = this.feedForWard(sample)
    return ans[ans.length - 1];
  }

  print_size(x, y) {
    console.log(math.size(x), y)
  }

  modelSave(fileName) {
    let model = this.model
    let file = fs.createWriteStream(fileName);
    model = JSON.stringify(model)
    file.on('error', function (err) { /* error handling */ });
    file.write(model);
    file.end()
  }

  loadModel(modelDirectory) {
    let model = fs.readFileSync(modelDirectory, { encoding: 'utf8' })
    model = JSON.parse(model)
    this.model = model
    console.log('model loaded into object!')
  }

  feedForWard(input) {

    let layers = []
    let layerToFindDer = []

    layers.push(input)//input is the first  layer this caused  a lot of problems
    layerToFindDer.push(input)

    for (let i = 0; i < this.model.length; i++) {
      const element = this.model[i];

      if (i > 0) {
        input = layers[layers.length - 1]
      }

      const output = math.add(math.multiply(input, element.weights), element.bias)
      layerToFindDer.push(output)
      layers.push(this.sigmoid(output))
    }

    //so i try and run every item in a model
    this.layers = layers
    this.layerToFindDer = layerToFindDer
    return this.layers ///this is just for the predict function


  }


}

module.exports = { Savage, Savage_model }

