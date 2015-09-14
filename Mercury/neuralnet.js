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

NeuralNet.prototype.configure = function (min, max) {
    var weight = ((max - min) / 2) + min;
    //    var weight = Math.random() * (max - min) + min;
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
    //        this.layers.forEach(function (l) {
    for (var i = 1; i < this.layers.length; i++) {
        var l = this.layers[i];
        l.synapses.forEach(function (s) {
            s.forward();
        });
        l.neurons.forEach(function (n) {
            n.activate();
        });
        //        s += self.toString();
    } //);
    s += self.toString();
    s += "Finished.\n";
    return s;
}

NeuralNet.prototype.train = function (expectedOutput) {
    var infMax = 100000;
    var costThreshold = 0.00000000000000000000000000000001; //1x10^-32
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
    var conf = 0,
        min = -10,
        max = 10;
    do {
        this.clear();
        //        text.log(conf + ' ' + dir);
        conf = this.configure(min, max);
        this.forward();
        cost = 0;
        for (var i = 0; i < outputLayer.neurons.length; i++) {
            var y = outputLayer.neurons[i].value;
            var _y = expectedOutput[i];
            cost += 0.5 * Math.pow(y - _y, 2);
            if (y < _y)
                min = conf;
            else if (y > _y)
                max = conf;
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

NeuralNet.prototype.createLayer = function (values) {
    var prevLayer = null;
    if (this.layers.length > 0)
        prevLayer = this.layers[this.layers.length - 1];
    this.layers.push(new NeuralNet.Layer(values, prevLayer));
}

NeuralNet.prototype.setInputs = function (values) {
    if (this.layers[0].neurons.length != values.length)
        console.error('Incorrect numbber of test cases provided');
    for (var i = 0; i < values; i++) {
        this.layers[0].neurons[i].value = values[i];
    }
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
        NeuralNet.ActivationFunction.sigmoid(this);
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

NeuralNet.ActivationFunction = {
    tanh: function (neuron) {
        neuron.value = Math.tanh(neuron.value);
    },
    sigmoid: function (neuron) {
        neuron.value = 1.0 / (1.0 + Math.exp(-neuron.value));
    },
    none: function (neuron) {}
}

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
