Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : null;
}

var text = document.getElementById('text');
text.log = function (str) {
    this.innerHTML += str + '\n';
}

var start = function () {
    text.log('Starting NeuralNet simulation');
    var input = math.matrix([[0.5], [0.1], [0.2]]);
    var output = math.matrix([[0.25], [0.01], [0.04]]);
    text.log('input: ' + input);
    text.log('target: ' + output);
    var net = new NeuralNet(input, output);
    net.CreateLayer(3);
}
