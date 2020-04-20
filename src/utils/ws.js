import SockJS from 'sockjs-client'

let sock;

function defaultHandler(message) {
    console.log('message', e.data);
    sock.close();
}

export function start(url) {
    sock = new SockJS(url);

    sock.onopen = function() {
        console.log('open');//'http://localhost:8080/ws'
        sock.send('test');
    };
    
    sock.onmessage = defaultHandler;
    
    sock.onclose = function() {
        console.log('close');
    };
    
}

export default {
    start: start
};

