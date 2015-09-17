/*

X - given input
Y - calculated output
E - error
T - target output

Wn - weight
Zn - inactive neuron
An - activated neuron

*/

var NeuralNet = function (inputs, output) {

    this.X = inputs;
    this.T = output;
    this.W = [];
    this.Z = [];
    this.A = [];
}

NeuralNet.prototype.CreateLayer = function (size) {
    var prevLayer = this.weight.last();
    var inputSize = prevLayer == null ? this.X.size()[1] : prevLayer.size()[1];
    var weightMatrix = math.zeroes(inputSize, size);
    this.weight.push(weightMatrix);
}
