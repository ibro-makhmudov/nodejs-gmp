// ***************************************************************************************************
// ************************************      Task 1      *********************************************
// ***************************************************************************************************

class EventEmitter {
    listeners = {};

    addListener(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(fn);
    }

    on(eventName, fn) {
        this.addListener(eventName, fn);
    }

    removeListener(eventName, fn) {
        let listeners = this.listeners[eventName];
        if (!listeners) return;
        for(let i = 0; i < listeners.length; i++) {
            if(listeners[i] === fn) {
                listeners.splice(i, 1);
                i--;
            }
        }
    }

    off(eventName, fn) {
        this.removeListener(eventName, fn);
    }

    once(eventName, fn) {
        const onceWrapper = () => {
            fn();
            this.off(eventName, onceWrapper);
        };
        this.on(eventName, onceWrapper);
    }

    emit(eventName, ...args) {
        let listeners = this.listeners[eventName];
        if (!listeners) return;
        listeners.forEach((fn) => {
            fn(...args);
        });
    }

    listenerCount(eventName) {
        let listeners = this.listeners[eventName] || [];
        return listeners.length;
    }

    rawListeners(eventName) {
        return this.listeners[eventName];
    }
}

// ************************************      Testing Task 1      *********************************************
console.log('************************************      Testing Task 1      *********************************************');

const myEmitter = new EventEmitter();

function c1() {
    console.log('an event occurred!');
}

function c2() {
    console.log('yet another event occurred!');
}

myEmitter.on('eventOne', c1); // Register for eventOne
myEmitter.on('eventOne', c2); // Register for eventOne

// Register eventOnce for one time execution
myEmitter.once('eventOnce', () => console.log('eventOnce once fired'));
myEmitter.once('init', () => console.log('init once fired'));

// Register for 'status' event with parameters
myEmitter.on('status', (code, msg)=> console.log(`Got ${code} and ${msg}`));


myEmitter.emit('eventOne');

// Emit 'eventOnce' -> After this the eventOnce will be
// removed/unregistered automatically
myEmitter.emit('eventOnce');


myEmitter.emit('eventOne');
myEmitter.emit('init');
myEmitter.emit('init'); // Will not be fired
myEmitter.emit('eventOne');
myEmitter.emit('status', 200, 'ok');

// Get listener's count
console.log(myEmitter.listenerCount('eventOne'));

// Get array of rawListeners//
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners('eventOne'));

// Get listener's count after remove one or all listeners of 'eventOne'
myEmitter.off('eventOne', c1);
console.log(myEmitter.listenerCount('eventOne'));
myEmitter.off('eventOne', c2);
console.log(myEmitter.listenerCount('eventOne'));


// ***************************************************************************************************
// ************************************      Task 2      *********************************************
// ***************************************************************************************************
console.log('************************************      Testing Task 2      *********************************************');

const fetch = require('node-fetch');

class WithTime extends EventEmitter {
    async execute(asyncFunc, ...args) {
        this.emit('begin');

        let startTime = process.hrtime();

        let result = await asyncFunc(...args);

        let diff = process.hrtime(startTime);
        let time = diff[0] * 1e9 + diff[1]; // in nanoseconds

        this.emit('end', time, result);
    }
}

const fetchFromUrl = (url) => {
    return fetch(url).then(response => response.json());
}

// ************************************      Testing      *********************************************

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners("end"));