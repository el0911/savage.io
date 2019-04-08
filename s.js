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

let savage_ = new savage()
var linear = savage_.linearRegression(data['x'], data['y'], 'mse')
console.log(linear);
