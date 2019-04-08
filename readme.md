Building a machine learning tool for node.js servers mainly because python has too many good libraries, feel free to help me out.


```
npm install @king__somto/savage
```

for now it can  solve problems that have multiple 2 dimensions 

```Javascript
const savage = require('./index')
var data = {
    x: [[0, 0, 0, 1],//1
        [0, 0, 1, 0],//2
        [0, 0, 1, 1],//3
        [0, 1, 0, 0],//4
        [0, 1, 0, 1],//5
        [0, 1, 1, 0],//6
        [0, 1, 1, 1],//7
        [1, 0, 0, 0]],//8
    y: [0, 1, 0, 1, 0, 1, 0, 1]/////data set created to differentiate even and odd numbers 0 for odd 1 for even
}

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
var linear = savage_.linearRegression(data['x'], data['y'], 'mse',0.01,1000)
console.log(linear);



//savage model initailized!!
//x1 * w1 + c
//[ 7.6015539732441635, 0.7600969072169218 ]

```



w1 being 7.6015539732441635

and c being  0.7600969072169218