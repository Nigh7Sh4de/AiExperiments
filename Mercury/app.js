var text = document.getElementById('text');
text.log = function (s) {
    this.innerHTML += s + "\n";
}
text.log('high/low: 1000');
text.log('max/min: 73');
text.log('max/min: 53');
text.log("HELLO!");

var xinput = document.getElementById('extraInput');

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

var output = [0.25];
//var output = [0.25];

var clearDiv = function () {
    text.innerHTML = "HELLO!\n";
}

var start = function () {

    var net = new NeuralNet();
    net.createLayer(input);
    net.createLayer(3);
    net.createLayer(1);
    //text.log(net.forward(true));
    text.log('Training with input: ' + input);
    text.log('Expected output: ' + output);
    var its = [];
    //text.log(net.train(output));
    var itCount = 1;
    for (var i = 0; i < itCount; i++) {
        var result = net.train(output);
        its.push(result.iterations);
    }
    console.log(its.average());
    text.log('Trained output: ' + net.layers[net.layers.length - 1].neurons[0].value);

    var extraInput = xinput.value;
    text.log('Just to note: ' + extraInput + ' ^ 2 = ' + (extraInput * extraInput));
    text.log('Testing extrapolation...');
    net.clear();
    net.configure(result.bestConf, result.bestConf);
    net.setInputs([extraInput]);
    text.log(net.forward());
}
