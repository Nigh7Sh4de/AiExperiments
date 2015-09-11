var NeuralNet = function () {
    this.layers = [];
}

NeuralNet.prototype.clear = function () {
    for (var i = 1; i < this.layers.length; i++) {
        this.layers[i].neurons.forEach(function (n) {
            n.value = 0;
        });
    }
}

NeuralNet.prototype.configure = function (w, dir) {
    var weight;
    if (w == null)
        var weight = Math.random();
    else
        weight = w + (dir ? +1 : -1) * (1 - w) * Math.random();
    this.layers.forEach(function (l) {
        l.synapses.forEach(function (s) {
            s.weight = weight;
        });
    });
    return weight;
}

NeuralNet.prototype.forward = function () {
    var self = this;
    var s = "Starting forward propogation...\n";
    s += "Using the following configuration:\n";
    s += this.toString(NeuralNet.StringFormat.Weight);
    this.layers.forEach(function (l) {
        l.synapses.forEach(function (s) {
            s.forward();
        });
        s += self.toString();
    });
    s += "Finished.\n";
    return s;
}

NeuralNet.prototype.train = function (expectedOutput) {
    var infMax = 100000;
    var costThreshold = 0.000001;
    var cost = 0;
    var result = {
        bestCost: null,
        bestConf: null,
        iterations: 0,
        toString: function () {
            return "Cost: " + this.bestCost + ", Conf: " + this.bestConf + ', Iterations: ' + this.iterations + "\n";
        }
    };
    var outputLayer = this.layers[this.layers.length - 1];
    var conf, dir = true;
    do {
        this.clear();
        //        text.log(conf + ' ' + dir);
        conf = this.configure(conf, dir);
        this.forward();
        cost = 0;
        for (var i = 0; i < outputLayer.neurons.length; i++) {
            var y = outputLayer.neurons[i].value;
            var _y = expectedOutput[i];
            cost += 0.5 * Math.pow(y - _y, 2);
            dir = y < _y;
        }
        if (result.bestCost == null || cost < result.bestCost) {
            result.bestCost = cost;
            result.bestConf = conf;
        }
    }
    while (result.iterations++ < infMax && cost > costThreshold);
    if (result.iterations > infMax)
        console.warn('Training loop maxed out.');

    return result;
}

//NeuralNet.protoype.train = function (expectedOutput) {
//    var outputLayer = this.layers[this.layers.length];
//    var cost = 0;
//    for (var i = 0; i < outputLayer.neurons.length; i++) {
//        var y = outputLayer.neurons[i].value;
//        var _y = expectedOutput[i];
//        cost += 0.5 * Math.pow(y - _y, 2);
//    }
//    return cost;
//}

NeuralNet.prototype.createLayer = function (values) {
    var prevLayer = null;
    if (this.layers.length > 0)
        prevLayer = this.layers[this.layers.length - 1];
    this.layers.push(new NeuralNet.Layer(values, prevLayer));
}

NeuralNet.Layer = function (values, prevLayer) {
    var self = this;
    if (typeof values == 'number')
        values = new Array(values);
    this.MAX_SIZE = 10;
    this.neurons = [];
    for (var i = 0; i < values.length; i++)
        self.neurons.push(new NeuralNet.Neuron(values[i]));

    this.synapses = [];
    if (prevLayer != null) {
        this.neurons.forEach(function (n) {
            prevLayer.neurons.forEach(function (p) {
                self.synapses.push(new NeuralNet.Synapse(p, n));
            });
        })
    }

}

NeuralNet.Neuron = function (v) {
    var self = this;
    this.value = v == null ? 0 : v;
    this.activate = function () {

    }
    this.active = false;
}

NeuralNet.Synapse = function (i, o, w) {
    var self = this;
    var DEFAULT_VALUE = 1;
    this.weight = w == null ? DEFAULT_VALUE : w;
    this.input = i;
    this.output = o;
    this.forward = function () {
        return this.output.value += this.input.value * this.weight;
    }
}

NeuralNet.StringFormat = {
    Visual: {
        Type: 'neurons',
        Accessor: 'value'
    },
    Weight: {
        Type: 'synapses',
        Accessor: 'weight'
    }
}
NeuralNet.StringFormat.Default = NeuralNet.StringFormat.Visual;

NeuralNet.prototype.toString = function (format) {
    format = format == null ? NeuralNet.StringFormat.Default : format;

    var str = "";
    //str += "NeuralNet: \n";
    str += "----------------\n";
    var go = true;
    var infCatch = 10000,
        c = 0;
    var iL = 0,
        iN = 0;

    while (go && c < infCatch) {
        c++;
        go = false;
        this.layers.forEach(function (l) {
            var n = null;
            if ((n = l[format.Type][iN]) != null) {
                str += '[' + n[format.Accessor] + ']\t';
                go = true;
            } else
                str += '   \t';
        });
        str += '\n';
        iN++;
    }
    if (c >= infCatch)
        console.warn('while loop went infinite');

    str += "----------------\n";
    return str;
}
