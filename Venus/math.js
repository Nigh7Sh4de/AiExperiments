var math = {}

math.E = Math.E;
math.PI = Math.PI;

math.sigmoid = function (x) {
    return 1 / (1 + math.exp(-x));
}
math.exp = function (x) {
    return math.pow(math.E, x);
}

math.pow = function (a, x) {
    return Math.pow(a, x);
    //    for (var i = 1; i < x; i++) {
    //        a *= a;
    //    }
    //    return a;
}

math.Matrix = function (x, y, n) {
    this.data = [];
    this.size = [];
    n = n != null ? n : 0;

    if (x == null)
        console.error('Default constructor not implemented.');
    else
    if (typeof x == 'number') {
        if (typeof y != 'number')
            console.error('When creating matrix by size, must specify both dimensions as numbers');

        this.size = [x, y];
        for (var i = 0; i < x; i++) {
            this.data.push([]);
            for (var j = 0; j < y; j++) {
                this.data[i].push(n);
            }
        }

    } else {
        if (x.length <= 0)
            console.error('When creating matrix by data, input must have length');
        this.data = x;
        this.size = [x.length, x[0].length];
    }
}

math.Matrix.prototype.sum = function () {
    var sum = 0;
    this.iterate(function (v) {
        sum += v;
    });
    return sum;
}

math.Matrix.prototype.toString = function (format) {

    switch (format) {
    case math.Matrix.StringFormat.MultiLine:
        var s = '';
        this.data.forEach(function (row) {
            s += '[' + row.toString() + ']\n'
        });
        return s.substr(0, s.length - 1);
        break;
    case math.Matrix.StringFormat.SingleLine:
    default:
        var s = '[';
        this.data.forEach(function (row) {
            s += '[' + row.toString() + '],'
        });
        return s.substr(0, s.length - 1) + ']';
        break;
    }


}
math.Matrix.StringFormat = {
    SingleLine: 's',
    MultiLine: 'm'
}

math.Matrix.prototype.sigmoid = function () {
    return this.transform(function (v) {
        return math.sigmoid(v);
    });
}

math.Matrix.prototype.add = function (other) {
    if (typeof other == 'number')
        return this.transform(function (v, x, y) {
            return v + other;
        });

    if (this.size[0] != other.size[0] ||
        this.size[1] != other.size[1])
        console.error('Added matrices requires identical size. this:' + this.size.toString() + '. other:' + other.size.toString());

    var m = new math.Matrix(this.size[0], this.size[1]);
    for (var i = 0; i < this.size[0]; i++) {
        for (var j = 0; j < this.size[1]; j++) {
            m.data[i][j] = this.data[i][j] + other.data[i][j];
        }
    }
    return m;
}

math.Matrix.prototype.sub = function (other) {
    if (typeof other == 'number')
        return this.transform(function (v, x, y) {
            return v - other;
        });

    if (this.size[0] != other.size[0] ||
        this.size[1] != other.size[1])
        console.error('Subtracting matrices requires identical size. this:' + this.size.toString() + '. other:' + other.size.toString());

    var m = new math.Matrix(this.size[0], this.size[1]);
    for (var i = 0; i < this.size[0]; i++) {
        for (var j = 0; j < this.size[1]; j++) {
            m.data[i][j] = this.data[i][j] - other.data[i][j];
        }
    }
    return m;
}

math.Matrix.prototype.scale = function (other) {
    if (typeof other == 'number')
        return this.transform(function (v, x, y) {
            return v * other;
        });

    if (this.size[0] != other.size[0] ||
        this.size[1] != other.size[1])
        console.error('For scalar multiplication across matrices, the sizes must be the same. this:' + this.size.toString() + '. other:' + other.size.toString() + '.');

    return this.transform(function (v, x, y) {
        return v * other.data[x][y];
    });

}

math.Matrix.prototype.mul = function (other) {
    if (typeof other == 'number')
        return this.transform(function (v, x, y) {
            return v * other;
        });

    if (this.size[1] != other.size[0])
        console.error('Multypling matrices require A_col to be equal to B_row. this:' + this.size.toString() + '. other:' + other.size.toString() + '.');


    var m = new math.Matrix(this.size[0], other.size[1]);
    var self = this;
    return m.transform(function (v, x, y) {
        var sum = 0;
        for (var i = 0; i < self.size[1]; i++)
            sum += self.data[x][i] * other.data[i][y];
        return sum;
    })
}


math.Matrix.prototype.div = function (other) {
    console.error('Matrix division is not yet implemented.');
}

math.Matrix.prototype.square = function () {
    return this.transform(function (v, x, y) {
        return v * v;
    });
}

math.Matrix.prototype.transpose = function () {
    var m = new math.Matrix(this.size[1], this.size[0]);
    var self = this;
    m = m.transform(function (v, x, y) {
        return self.data[self.size[0] - 1 - y][self.size[1] - 1 - x];
    });
    return m;
}

math.Matrix.prototype.transform = function (fun) {
    var m = new math.Matrix(this.size[0], this.size[1]);
    this.iterate(function (v, x, y) {
        m.data[x][y] = fun(v, x, y);
    });
    return m;
}

math.Matrix.prototype.iterate = function (func) {
    for (var i = 0; i < this.size[0]; i++) {
        for (var j = 0; j < this.size[1]; j++) {
            func(this.data[i][j], i, j);
        }
    }
}
