import Axios from 'axios'

let serverAddress: string;
fetch("serveraddress.txt")
    .then((response) => response.text())
    .then((text) => {
        serverAddress = text;
    }).catch((error) => console.error(error));

// example db handling for sqlite to test setup

export async function dbCommand(input: string): Promise<string> {
    if (input === "") {
        console.log("SQL cannot be null");
        return "";
    }

    console.log(input);
    const output: string = "not setup";

    return output;
}

// example of sending to server

export async function dbCommandServer(input: string): Promise<string> {
    if (input === "") {
        console.log("SQL cannot be null");
        return "";
    }
    console.log(input);
    console.log("Server Address:", serverAddress);
    let output: string = "not setup";

    // connect to server
    const response = await Axios.post(serverAddress + "login", 
        input, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    output = JSON.stringify(response);

    return output;
}