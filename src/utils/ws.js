import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

var sock;
var stomp;
var started;

let handlerMap = [];
let subscriptionMap = [];

function defaultHandler(message) {
    const body = JSON.parse(message.body)
    if (body) {
        const eventType = body.type;
        const events = handlerMap[eventType];
        for (let index in events) {
            events[index](body.content);
        }
    }
}

export function subscribe(destination) {
    subscriptionMap[destination] = stomp.subscribe(destination, defaultHandler);
    return subscriptionMap[destination];
}

export function unsubscribeBySub(subscription) {
    let keys = Object.keys(subscriptionMap);
    for(let key in keys) {
        if(subscriptionMap[keys[key]].id === subscription.id) {
            subscriptionMap[keys[key]].unsubscribe();
            delete subscriptionMap[key];
            break;
        }
    }
}

export function unsubscribeByDest(destination) {
    if (subscriptionMap[destination]) {
        stomp.unsubscribe(subscriptionMap[destination]);
        subscriptionMap[destination] = null;
    }
}

export function regHandler(eventType, handler) {
    if (!handlerMap[eventType]) {
        handlerMap[eventType] = [];
    }
    handlerMap[eventType].push(handler);
}

export function delHandler(handler) {
    for (let index in handlerMap) {
        let innerIndex = handlerMap[index].indexOf(handler);
        if (innerIndex !== -1) {
            handlerMap[index].slice(innerIndex, 1);
        }
    }
}

export function close() {
    sock.close();
}

function restoreSubscriptions() {
    for (let index in subscriptionMap) {
        subscribe(index);
    }
}

export async function start(url, user) {
    sock = new SockJS(url);
    let _transportClose = sock._transportClose;
    sock._transportClose = function (code, reason) {
        if (this._transport && this._transport.close) {
            this._transport.close();
        }
        _transportClose.call(this, code, reason);
    }
    stomp = Stomp.over(() => {
        sock = new SockJS(url);
        return sock;
    });
    stomp.reconnectDelay = 1000;

    sock.onerror = function (error) {
        console.log('WS error: ' + error);
    }
    return new Promise((onsuccess, onreject) => {
        stomp.connect({ auth: user }, function (frame) {
            console.log('STOMP Connected: ' + frame);
            restoreSubscriptions();
            started = true;
            onsuccess();
        });
    });

}

export default {
    start: start,
    subscribe: subscribe,
    regHandler: regHandler,
    delHandler: delHandler,
    unsubscribe: unsubscribeBySub,
    unsubscribeByDest: unsubscribeByDest,
    isStarted: started
};

