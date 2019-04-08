const savage = require('./index')
var data = {
    x: [[0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [1, 0, 0, 0]],
    y: [0, 1, 0, 1, 0, 1, 0, 1]
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
var linear = savage_.linearRegression(data['x'], data['y'], 'mse')
console.log(linear);
