Building a machine learning tool for node.js servers mainly because python has too many good libraries, feel free to help me out.


```
npm install @king__somto/savage
```

for now it can  solve problems that have  2 dimensions 

```Javascript
const savage = require('./index')
// var data = {
//     x: [[0, 0, 0, 1],//1
//         [0, 0, 1, 0],//2
//         [0, 0, 1, 1],//3
//         [0, 1, 0, 0],//4
//         [0, 1, 0, 1],//5
//         [0, 1, 1, 0],//6
//         [0, 1, 1, 1],//7
//         [1, 0, 0, 0]],//8
//     y: [0, 1, 0, 1, 0, 1, 0, 1]/////data set created to differentiate even and odd numbers 0 for odd 1 for even
// }

// var data = {
//     x:[[0],
//         [1],
//         [2],
//         [3],
//         [4],
//         [5],
//         [6],
//         [7],
//         [8],
//         [9]],
//     y:[0,1,2,3,4,5,6,7,8,9]
// }
let savage_ = new savage()
savage_.loadDataFromCSV('diabetes.csv',true)
savage_.head()
///data is stored in variable savage_.data
let x = []
let y = []
for (let i = 0; i < savage_.data.length; i++) {
    const element =  savage_.data[i];

    y.push(element[8])
    x.push(element.slice(0,8))
}/////preprocess data


var linear = savage_.linearRegression(x, y,'mse',0.01,100)
console.log(linear);
savage model initailized!!
// [ '1', '85', '66', '29', '0', '26.6', '0.351', '31', '0\r' ]
// [ '8', '183', '64', '0', '0', '23.3', '0.672', '32', '1\r' ]
// [ '1', '89', '66', '23', '94', '28.1', '0.167', '21', '0\r' ]
// [ '0', '137', '40', '35', '168', '43.1', '2.288', '33', '1\r' ]
// [ '5', '116', '74', '0', '0', '25.6', '0.201', '30', '0\r' ]
// x1 * w1 + x2 * w2 + x3 * w3 + x4 * w4 + x5 * w5 + x6 * w6 + x7 * w7 + x8 * w8 + c
// itter 0
// itter 1
// itter 2
// itter 3
// itter 4
// ......
// ......

// [ 0.0021624662171815688,
//   0.058212216904147844,
//   0.025181295518047275,
//   0.008316394245646294,
//   0.04353779939030065,
//   0.013599241227316828,
//   0.00022646456433765433,
//   0.014562232104820869,
//   0.29152134549618924 ]
```
Building an ANN with the library

``` Javascript
const {Savage,Savage_model} =  require('./index.js')
const mod = new Savage_model()
let savage_ = new Savage()
savage_.loadDataFromCSV('diabetes.csv',true)
savage_.head()

let x = []
let y = []
for (let i = 0; i < savage_.data.length; i++) {
    const element =  savage_.data[i];

    y.push([element[8]])
    x.push(element.slice(0,8))
}

mod.addDense({
    'output':4,
    'input':4,
    'activation':'sigmoid'
})



mod.addDense({
    'output':3,
    'activation':'softmax'
})

mod.addDense({
    'output':4,
    'activation':'softmax'
})

mod.addDense({
    'output':1,
    'activation':'softmax'
})


mod.run(data.x,data.y)

mod.predict([1,0,1,0])



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
let ans = model.predict([0,1,1,0])
console.log(ans);
```