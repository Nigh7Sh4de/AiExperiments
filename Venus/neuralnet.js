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

    this.Z.push(inputs);
    this.A.push(inputs);
    this.CreateLayer(output.size[1]);
}

NeuralNet.prototype.Forward = function (layer) {
    layer = layer != null ? layer : this.W.length;
    if (layer == 0)
        return this.A[layer];

    var f = this.Forward(layer - 1);
    var w = this.W[layer - 1];
    this.Z[layer] = f.mul(w);
    return this.A[layer] = this.Z[layer].sigmoid();
}

NeuralNet.prototype.dSigmoid = function (matrix) {
    var t = matrix.sigmoid();
    var i = matrix.sigmoid().mul(-1).add(1);
    return t.scale(i);
}

NeuralNet.prototype.Cost = function (Y) {
    Y = Y != null ? Y : this.A[this.A.length - 1];
    return Y.sub(this.T).square().mul(0.5);
}

NeuralNet.prototype.dCost = function (n) {
    var a = this.A[n].transpose();
    var d = this.Delta(n + 1);
    return a.mul(d);
}

NeuralNet.prototype.Delta = function (n) {
    if (n < this.W.length)
        return this.Delta(n + 1)
            .mul(this.W[n].transpose())
            .scale(this.dSigmoid(this.Z[n]));
    else
        return this.A[n].sub(this.T)
            .scale(this.dSigmoid(this.Z[n]));
}

NeuralNet.prototype.Train = function () {
    var scale = 20;
    var i = 1,
        MAX = 2000,
        //        MAX = 1000000,
        cost = 1,
        threshold = 0.1;
    do {
        this.Forward();
        //        text.log('d/dW1' + this.dCost(1));
        //        text.log(this.toString('W'));
        text.log('Cost on iteration #' + i + ': ' + this.Cost());
        text.log('cuz: ' + this.A[this.A.length - 1]); //.sum());
        for (var n = 0; n < this.W.length; n++) {
            var deriv = this.dCost(n);
            //            text.log('dE/dW_' + n + ': ' + deriv);
            this.W[n] = this.W[n].add(deriv.scale(-(scale)));
        }
        //        text.log('Iteration ' + i + ': ');
        //        text.log(this.toString('W'));
    }
    while (cost > threshold && i++ < MAX)

    return this.Cost(this.Forward()).sum();
}

NeuralNet.prototype.CreateLayer = function (size) {
    var out = this.W.pop();
    var outSize = out == null ? 0 : out.size[1];
    var prevLayer = this.W[this.W.length - 1];
    var inputSize = prevLayer == null ? this.X.size[1] : prevLayer.size[1];
    var weightMatrix = new math.Matrix(inputSize, size);
    this.W.push(weightMatrix)
    if (outSize > 0)
        this.W.push(new math.Matrix(size, outSize));

    var neuronMatrixA = new math.Matrix(this.X.size[0], size);
    var neuronMatrixZ = new math.Matrix(this.X.size[0], size);
    var spliceIndexA = this.A.length - 1;
    var spliceIndexZ = this.Z.length - 1;
    this.A.splice(spliceIndexA <= 0 ? 1 : spliceIndexA, 0, neuronMatrixA);
    this.Z.splice(spliceIndexZ <= 0 ? 1 : spliceIndexZ, 0, neuronMatrixZ);


}

NeuralNet.prototype.toString = function (arr) {

    var str = "------------\n";
    var s = [];
    arr = arr != null ? arr : 'W';
    this[arr].forEach(function (m) {
        s.push(m.toString('m').split('\n'));
    });

    var i = 0,
        MAX = 100,
        go = false;
    do {
        go = false;
        s.forEach(function (_s) {
            if (_s[i] == null) {
                str += '\t';
                return;
            }
            str += (_s[i] + '\t');
            go = true;
        });
        str += '\n';
    } while (i++ < MAX && go);
    str = str.trimRight();
    str += "\n------------";
    return str;

    /*

                    var str = "-----------\n";
                    var s = [];
                    arr = arr != null ? arr : 'W';
                    this[arr].forEach(function (weightMatrix) {
                        var _s = weightMatrix.toString();
                        s.push(_s.substr(1, _s.length - 2).replace(/], |],|]/gi, ']\n').trim().split('\n'));
                    });
                    var i = 0,
                        MAX = 100,
                        go = false;
                    do {
                        go = false;
                        s.forEach(function (_s) {
                            if (_s[i] == null) {
                                str += '\t\t';
                                return;
                            }
                            str += (_s[i] + '\t');
                            go = true;
                        });
                        str += '\n';
                    } while (i++ < MAX && go);
                    str = str.trimRight();
                    str += "\n-----------";
                    return str;

                    */
}
