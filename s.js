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
savage_.loadDataFromCSV('diabetes.csv',true)
savage_.head()
///data is stored as savage_.data
// var linear = savage_.linearRegression(data['x'], data['y'],'mse',0.01,1000)
// console.log(linear);
let x = []
let y = []
for (let i = 0; i < savage_.data.length; i++) {
    const element =  savage_.data[i];

    y.push(element[8])
    x.push(element.slice(0,8))
}

var linear = savage_.linearRegression(x, y,'mse',0.01,100)
console.log(linear);


