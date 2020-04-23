import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

var sock;
var stomp;

let handlerMap = [];

function defaultHandler(message) {
    const body = JSON.parse(message.body)
    if(body) {
        const eventType = body.type;
        const events = handlerMap[eventType];
        for(let index in events) {
            events[index](body.content);
        }
    }
}

export function subscribe(destination) {
    return stomp.subscribe(destination, defaultHandler);
}

export function unsubscribe(subscription) {
    stomp.unsubscribe(subscription);
}

export function regHandler(eventType, handler) {
    if(!handlerMap[eventType]) {
        handlerMap[eventType] = [];
    }
    handlerMap[eventType].push(handler);
}

export function delHandler(handler) {
    for(let index in handlerMap) {
        let innerIndex = handlerMap[index].indexOf(handler);
        if(innerIndex !== -1) {
            handlerMap[index].slice(innerIndex, 1);
        }
    }
}

export function close() {
    sock.close();
}

export async function start(url, user) {
    sock = new SockJS(url);
    stomp = Stomp.over(sock);
    sock.onopen = function() {
        console.log('WS open');
    };

    sock.onerror = function(error) {
        console.log('WS error: ' + error);
    }
    
    //sock.onmessage = defaultHandler;
    
    sock.onclose = function() {
        console.log('WS close');
    };
    return new Promise((onsuccess, onreject) => {
        stomp.connect({auth: user}, function (frame) {
            console.log('STOMP Connected: ' + frame);
            onsuccess();
        });
    });
    
}

export default {
    start: start,
    subscribe: subscribe,
    regHandler: regHandler,
    delHandler: delHandler,
    unsubscribe: unsubscribe
};

