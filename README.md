# Weather App
This is a Node.js application for receiving weather data for various cities. Data about the cities is stored in a JSON file and passed to an HTML template as an array. In the template, a menu of links with city names is created.

The format of the query string for getting weather data is /weather/{city}, where city is the name of the selected city. Weather data can be obtained by sending a request to OpenWeatherMap.

## Installation
To run this application, you'll need to have Node.js and the npm package manager installed on your computer.

1. Clone the repository to your local machine: `git clone https://github.com/t0nn1x/node.js_uni.git
2. Navigate to the project directory: `cd weather-app`
3. Install the dependencies: `npm install`
4. Set your OpenWeatherMap API key as an environment variable:

`export OPENWEATHERMAP_API_KEY=your_api_key`

5. Start the server: `npm start`
6. Open a web browser and go to `http://localhost:3000`.

## Usage
When you first open the application, you will see a list of links to the weather pages for each city in the JSON file. Click on a link to view the weather data for that city.

You can also access the weather data for a specific city directly by entering `/weather/{city}` in the address bar of your browser, replacing `{city}` with the name of the desired city.

## Technologies Used
* Node.js
* Express.js
* Handlebars.js
* OpenWeatherMap API
