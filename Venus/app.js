var text = document.getElementById('text');
text.log = function (str) {
    this.innerHTML += (str != null ? str : '') + '\n';
}

var start = function () {
    text.log('Starting NeuralNet simulation');
    //    var input = new math.Matrix([[0.5], [0.1], [0.2]]);
    var input = new math.Matrix([[0.5], [0.1], [0.2]]);
    //    var output = new math.Matrix([[0.25], [0.01], [0.04]]);
    var output = new math.Matrix([[0.25], [0.05], [0.1]]);
    text.log('input: ' + input);
    text.log('target: ' + output);
    var net = new NeuralNet(input, output);
    net.CreateLayer(3);
    net.CreateLayer(3);
    text.log(net);
    text.log(net.toString('A'));
    text.log(net.Forward());
    text.log('Cost with 0\'s: ' + net.Cost(net.Forward()).sum());
    text.log('Starting NeurelNet training');
    net.Train();
    text.log('Completed NeuralNet training');
    text.log('Result:');
    text.log(net.Forward());
}
