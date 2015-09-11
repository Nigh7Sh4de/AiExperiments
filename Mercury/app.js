var text = document.getElementById('text');
text.log = function (s) {
    this.innerHTML += s + "\n";
}
text.log('high/low: 1000');
text.log('max/min: 73');


text.log("HELLO!");

Array.prototype.average = function () {
    var sum = 0;
    this.forEach(function (e) {
        sum += e;
    });
    return sum / this.length;
}


var inputs = [1, 2, 3, 4, 5];
//var input = inputs[4];
var input = [0.5];

var output = [1];
//var output = [0.25];

//Records:

var start = function () {

    var net = new NeuralNet();
    net.createLayer(input);
    net.createLayer(3);
    net.createLayer(3);
    net.createLayer(1);
    //text.log(net.forward(true));
    var its = [];
    //text.log(net.train(output));
    for (var i = 0; i < 1000; i++) {
        its.push(net.train(output).iterations);
    }
    console.log(its.average());
    text.log(net.layers[net.layers.length - 1].neurons[0].value);
}
