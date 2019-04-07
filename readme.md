Building a machine learnign model for node.js servers mainly because python has too many good libraries feel free to help me out.



npm install @king__somto/savage

/////for now it can only solve problems with that have an inut of one dimension



```

var data = {
    x:[0,1,2,3,4,5,6,7,8,9],
    y:[0,1,2,3,4,5,6,7,8,9]
}
let savage_ = new savage()
var linear = savage_.Linear_Regression(data['x'], data['y'], 'mse')
console.log(linear);


//savage model initailized!!
//x1 * w1 + c
//[ 7.6015539732441635, 0.7600969072169218 ]

```



w1 being 7.6015539732441635

and c being  0.7600969072169218