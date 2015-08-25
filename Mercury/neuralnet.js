function NeuralNet() {

    var self = this;

    this.system = {
        inputs: [],
        synapses: [],
        layers: [],
        results: []
    }

    this.system.layers.push([]);

    this.Node = function (value) {
        this.value = value;
    }

    this.Synapse = function (input, out, layer) {
        this.input = input;
        this.output = out;
        this.weight = 1;
        this.layer = layer == null ? 0 : layer;
        this.setWeight = function (w) {
            this.weight = w;
        }
    }

    this.createNode = function (layer) {
        var n = new self.Node();
        self.system.layers[layer].push(n);
        return n;
    }

    this.createInput = function (x) {
        var n = new self.Node(x);
        self.system.inputs.push(n);
        self.system.layers[0].push(n);
        return n;
    }

    this.createLayer = function (size) {
        self.system.layers.push(new []);
        var index = self.system.layers.length - 1;
        for (var i = 0; i < size; i++) {
            var out = self.createNode(index);
            self.system.layers[index - 1].forEach(function (input) {
                self.system.ceateSynapse(input, out, index);
            });
        }

    }

    this.createSynapse = function (input, out) {
        self.system.synapses.push(new Synapse(input, out));
    }

    this.toString = function () {
        var x = "Neural Net\n";
        x += '--------------\n';
        self.system.layers.forEach(function (layer) {
            layer.forEach(function (node) {
                x += node.value + " ";
            });
            x += '\n';
        });
        x += '--------------';
        return x;
    }
}
