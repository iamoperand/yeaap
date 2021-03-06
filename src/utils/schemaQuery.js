require('dotenv').config({});
const fetch = require('node-fetch');
const fs = require('fs');

const { API_URL } = process.env;

fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
  })
})
  .then((result) => result.json())
  .then((result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    );
    result.data.__schema.types = filteredData; // eslint-disable-line no-param-reassign
    fs.writeFile(
      'src/fragmentTypes.json',
      JSON.stringify(result.data),
      (error) => {
        if (error) {
          console.error('Error writing fragmentTypes file: ', error);
          return;
        }

        console.log('Fragment types successfully extracted!');
      }
    );
  })
  .catch((err) => console.error(err));
