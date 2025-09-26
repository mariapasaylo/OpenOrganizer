/*
 * Authors: Michael Jagiello, Kevin Sirantoine
 * Created: 2025-04-14
 * Updated: 2025-09-09
 *
 * This file fetches the server address from serveraddress.txt and exports the test dbCommand function which uses Axios
 * to send input to the server and return the response.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */
import Axios from 'axios'

let serverAddress: string;
fetch("serveraddress.txt")
    .then((response) => response.text())
    .then((text) => {
        serverAddress = text;
    }).catch((error) => console.error(error));

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
