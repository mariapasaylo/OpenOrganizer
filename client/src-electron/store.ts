import Store from 'electron-store';
import type { Schema } from 'electron-store';


// Define the blueprint for user data
interface User {
    name : string;
    systemTime : string;
}

// Define schema for the store
const schema: Schema<User> = {
    name: { 
        type: 'string', 
        default: 'Alberta Gator' 
    },
    systemTime: { 
        type: 'string', 
        default: new Date().toISOString()
    },
};

const store = new Store<User>({ schema });

console.log("User Name:", store.get('name'));
console.log("System Time:", store.get('systemTime'));

// store.set('name', 'Al Gator');
// store.set('systemTime', new Date().toISOString());

// console.log("User Name:", store.get('name'));
// console.log("System Time:", store.get('systemTime'));