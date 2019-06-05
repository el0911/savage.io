Building a machine learning tool for node.js servers mainly because python has too many good libraries, feel free to help me out.


```
npm install @king__somto/savage
```

Building an ANN with the library

``` Javascript
const {Savage,Savage_model} =  require('./index.js')
const mod = new Savage_model()
let savage_ = new Savage()
const math = require('mathjs')

// savage_.loadDataFromCSV('diabetes.csv',true)
// savage_.head()
 

//    let x= [[0, 0, 0, 1],//1
//         [0, 0, 1, 0],//2
//         [0, 0, 1, 1],//3
//         [0, 1, 0, 0],//4
//         [0, 1, 0, 1],//5
//         [0, 1, 1, 0],//6
//         [0, 1, 1, 1],//7
//         [1, 0, 0, 0]]//8
//     let y = [[0], [1], [0], [1], [0], [1], [0], [1]]/////data set created to differentiate even and odd numbers 0 for odd 1 for even

let data  = [[5.4,  3.4,  1.7,  0.2,  0.],
[5.1,  3.7,  1.5,  0.4,  0.],
[4.6,  3.6,  1.,  0.2,  0.],
[5.1,  3.3,  1.7,  0.5,  0.],
[4.8,  3.4,  1.9,  0.2,  0.],
[5.,  3.,  1.6,  0.2,  0.],
[5.,  3.4,  1.6,  0.4,  0.],
[5.2,  3.5,  1.5,  0.2,  0.],
[5.2,  3.4,  1.4,  0.2,  0.],
[4.7,  3.2,  1.6,  0.2,  0.],
[4.8,  3.1,  1.6,  0.2,  0.],
[5.4,  3.4,  1.5,  0.4,  0.],
[5.2,  4.1,  1.5,  0.1,  0.],
[5.5,  4.2,  1.4,  0.2,  0.],
[4.9,  3.1,  1.5,  0.1,  0.],
[5.,  3.2,  1.2,  0.2,  0.],
[5.5,  3.5,  1.3,  0.2,  0.],
[4.9,  3.1,  1.5,  0.1,  0.],
[4.4,  3.,  1.3,  0.2,  0.],
[5.1,  3.4,  1.5,  0.2,  0.],
[5.,  3.5,  1.3,  0.3,  0.],
[4.5,  2.3,  1.3,  0.3,  0.],
[4.4,  3.2,  1.3,  0.2,  0.],
[5.,  3.5,  1.6,  0.6,  0.],
[5.1,  3.8,  1.9,  0.4,  0.],
[4.8,  3.,  1.4,  0.3,  0.],
[5.1,  3.8,  1.6,  0.2,  0.],
[4.6,  3.2,  1.4,  0.2,  0.],
[5.3,  3.7,  1.5,  0.2,  0.],
[5.,  3.3,  1.4,  0.2,  0.],
[6.8,  2.8,  4.8,  1.4,  1.],
[6.7,  3.,  5.,  1.7,  1.],
[6.,  2.9,  4.5,  1.5,  1.],
[5.7,  2.6,  3.5,  1.,  1.],
[5.5,  2.4,  3.8,  1.1,  1.],
[5.5,  2.4,  3.7,  1.,  1.],
[5.8,  2.7,  3.9,  1.2,  1.],
[6.,  2.7,  5.1,  1.6,  1.],
[5.4,  3.,  4.5,  1.5,  1.],
[6.,  3.4,  4.5,  1.6,  1.],
[6.7,  3.1,  4.7,  1.5,  1.],
[6.3,  2.3,  4.4,  1.3,  1.],
[5.6,  3.,  4.1,  1.3,  1.],
[5.5,  2.5,  4.,  1.3,  1.],
[5.5,  2.6,  4.4,  1.2,  1.],
[6.1,  3.,  4.6,  1.4,  1.],
[5.8,  2.6,  4.,  1.2,  1.],
[5.,  2.3,  3.3,  1.,  1.],
[5.6,  2.7,  4.2,  1.3,  1.],
[5.7,  3.,  4.2,  1.2,  1.],
[5.7,  2.9,  4.2,  1.3,  1.],
[6.2,  2.9,  4.3,  1.3,  1.],
[5.1,  2.5,  3.,  1.1,  1.],
[5.7,  2.8,  4.1,  1.3,  1.]]



let x = []
let y = []
for (let i = 0; i < data.length; i++) {
    const element = data[i];

    y.push([element[4]])
    x.push(element.slice(0,4))
}

x = savage_.normalise(x)/// note this line is very important in most cases that have large values, it helps you normalise the input values(as the name implies)



mod.dataClassesDistribution(y)

mod.addDense({
    'output':3,
    'input':4,
    'activation':'sigmoid'
})

mod.addDense({
    'output':4,
    'activation':'softmax'
})

mod.addDense({
    'output':1,
    'activation':'softmax'
})


let itterations = 20000
let batch = 20


mod.run(x,y,itterations,batch)
mod.modelSave('model.txt')

const min = 0
const max = x.length

let rand = parseInt(math.random(min,max))
console.log('predicted:',mod.predict(x[rand]));
console.log('actual:',y[rand])

rand = parseInt(math.random(min,max))
console.log('predicted:',mod.predict(x[rand]));
console.log('actual:',y[rand])

rand = parseInt(math.random(min,max))
console.log('predicted:',mod.predict(x[rand]));
console.log('actual:',y[rand])

rand = parseInt(math.random(min,max))
console.log('predicted:',mod.predict(x[rand]));
console.log('actual:',y[rand])



```

Now creating a model thats awesome now lets save it so we dont have to retrain all the time

``` javascript
///after training call
mod.saveModel('fileName.txt')
```

Now to load model 

``` javascript
const model = new Savage_model()
model.loadModel('fileNames.txt')
let ans = model.predict(x)
console.log(ans);
```