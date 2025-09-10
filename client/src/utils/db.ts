import Axios from 'axios'

let serverAddress: string;
fetch("serveraddress.txt")
    .then((response) => response.text())
    .then((text) => {
        serverAddress = text;
    }).catch((error) => console.error(error));

// example db handling for sqlite to test setup
// example of sending to server

// handle based on mode
export async function dbCommand(mode: string, input: string): Promise<string> {
  if (input === "") {
    console.log("SQL cannot be null");
    return "";
  }
  console.log(input);
  console.log("Server Address:", serverAddress);
  let output: string = "not setup";
  if (mode === "not setup") {
    return output;
  }

  // connect to server
  const response = await Axios.post(serverAddress + mode,
    input, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

  output = JSON.stringify(response.data);

  return output;
}
