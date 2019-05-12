
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
      'weights': math.random([input, output]),////creatte a random matrix
      'bias': 0,////same
      'index': this.model.length - 1
    })
  }

  run(input, labels, itterations, batch) {
    for (let index = 0; index < itterations; index++) {

      ///here i divide the datset into batches to train 
      let trainedItemCheck = 0 //variable to check  how many items ive passed through to train 
      // for (let i = 0; i <= parseInt(labels.length/batch); i++) {
      ///so i first send the elements batch by batch
      const rand_index = (Math.floor(Math.random() * (input.length - 1 + 1)) + 1) - 1

      this.input = input[rand_index]
      this.label = labels[rand_index]


      this.feedForWard(this.input)
      this.backPropagation(index, 1, batch)

      // }
      if (index % 100 == 0) {
        console.log("Itterration " + index);
      }
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
    const point = this.input
    let weights = this.model[0].weights
    const z = point[0] * weights[0] + point[1] * weights[1] + point[2] * weights[2] + point[3] * weights[3] + this.model[0].bias
    const prediction = this.sigmoid(z)

    const target = this.label
    const cost = math.square(math.subtract(prediction, target))

    const derivativeOfCost = math.multiply(2, math.subtract(prediction, target))

    const derivativeOfPrediction = this.sigmoid(z)


    const dz_dw1 = point[0]
    const dz_dw2 = point[1]
    const dz_dw3 = point[2]
    const dz_dw4 = point[3]
    const dz_db = 1

    const dcost_dz = derivativeOfCost * derivativeOfPrediction
    const dcost_dw = math.multiply(learning_rate , math.multiply(point,dcost_dz))

    const dcost_db = dcost_dz * dz_db
    
    weights = math.subtract(weights , math.transpose([dcost_dw]) )
    this.model[0].bias = this.model[0].bias - (learning_rate * dcost_db)
    this.model[0].weights = weights
  }

  predict(sample) {
    let ans = this.feedForWard(sample)
    return ans[ans.length - 1];
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

