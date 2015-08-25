console.log('hello world!');

exampleInput.forEach(function (i) {
    net.createInput(i);
});

console.log(net.toString());
