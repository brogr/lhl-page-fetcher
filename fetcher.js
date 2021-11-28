/* fetcher.js
 * small command line node app which should take a URL as a command-line argument as well as a local file path and download the resource to the specified path.
**/

// imports
const request = require("request");
const fs = require("fs");

// fetchPage: fetch url and pass data to callback function when done
const fetchPage = (url, file, done) => {
  request(url, (error, response, body) => {
    if (error) return console.error("fetchPage error:", error);
    
    // console.log("statusCode:", response && response.statusCode); // Print the response status code IF a response was received
    if (response) {
      if (response.statusCode === 200) {
        // console.log("body:", body);
        // console.log("fetchPage: got it!");
        // callback on success
        const bytes = response.headers["content-length"];
        done(file, body, bytes, printResults);
      } else {
        console.warn(
          `Ooops, couldn't fetch the page because the server returned statusCode ${response.statusCode}!`
        );
      }
    }
  });
};

// saveToFile: write data to file, and call callback function when done
const saveToFile = (file, data, bytes, done) => {
  // console.log("saveToFile: start...");
  fs.writeFile(file, data, (error) => {
    // console.log("In writeFile's callback");
    if (error) return console.error("saveToFile error:", error);

    // callback on success
    done(file, data, bytes);
  });
};

// printResults: print final results
const printResults = (file, data, bytes) => {
  console.log(`Downloaded and saved ${bytes} bytes to ${file}`);
};

// init: get command line arguments and initiate fetching
const init = () => {
  // get command line arguments
  const args = process.argv;
  // console.log(args);
  if (!args[2] || !args[3]) {
    console.warn("Missing argument(s): provide URL and local file path");
  } else {
    // console.log("init: Go fetching...");
    const url = args[2];
    const file = args[3];
    fetchPage(url, file, saveToFile);
  }
};

// run
init();