
const math = require('mathjs')
const fs = require('fs');
const csv = require('csvtojson')
// const request=require('request')



class Savage {

  constructor() {
    console.log('savage model initailized!!');
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
    'data normalysed'
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

            for (let j = 0; j < dimensions ; j++) {
              ////solving every equation 

              const x = 'x' + (j + 1)
              const w = 'w' + (j + 1)

             if( j < (dimensions-1)){
              d[x] = data.x[i][j]
              d['n'] = data.x.length
              d[w] = params2[j]
              d['c'] = params2[dimensions - 1]
              d['y'] = data.y[i]
             }

              

            }


            for (let j = 0; j < dimensions; j++) {

            
              params[j] = params[j] - expressions_list[j].compile(d)

        
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