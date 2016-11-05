var express = require('express'),
    $app = express(),
    port, _port,
    $config = require('./config');


process.argv.forEach(function (val, index, array) {
    if (val == '--port') {
        expectedPort = array[index + 1]
        console.log('You put a custom port:', expectedPort)
        if (Boolean(expectedPort)) {
            if (isNaN(expectedPort)) {
                console.error('Port is not a number. Back to default.')
                _port = $config.serverPort
            } else {
                _port = expectedPort
            }
        } else {
            console.error('No port number indentified. Back to default.')
            _port = $config.serverPort
        }
    }
});

port = (_port) ? _port : $config.serverPort

$app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

$app.get(/^(.+)$/, function(req, res) {
    res.sendFile(__dirname + '/public' + req.params[0])
})


$app.listen(port, function() {
    console.log('Listening on ' + port)
})

