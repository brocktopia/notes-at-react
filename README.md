# notes-at-react

> A note taking app that retrieves and stores location data for each note. This is a fork of 
[github.com/brocktopia/notes-at-vuex](https://github.com/brocktopia/notes-at-vuex/tree/testing) testing branch implemented
using React on the Client-side.

## Dependencies

**Server-side**
* [Node.js](https://nodejs.org)
* [Express](https://github.com/expressjs/express)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://github.com/Automattic/mongoose)

**Client-side**
* [React](https://reactjs.org/)
  * [create-react-app](https://github.com/facebook/create-react-app)
* [react-router](https://github.com/ReactTraining/react-router)
* [mobx](https://github.com/mobxjs/mobx)
  * [mobx-react](https://github.com/mobxjs/mobx-react)
* [craco](https://github.com/sharegate/craco)
  * [craco use-mobx](https://github.com/sharegate/craco/tree/master/recipes/use-mobx)
* [react-google-maps](https://github.com/tomchentw/react-google-maps)
* [Moment.js](https://momentjs.com/)
* [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) (for Maps JavaScript API &amp; Places API for Web)

## Configuration

You will need to set your Google API Key in [./src/components/MapComponent.js](src/components/MapComponent.js).
```js
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// utility method for default configs and to isolate API Key
function mapProps(config = {}) {
  return Object.assign({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=places`,
    ...
```
You may also need to configure [./server.js](server.js) if your instance of MongoDB is running on a port
other than the default port `27017` or your local server is something other than `http://localhost`.
```js
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/' + dbName, {'useNewUrlParser': true});//
```

## Build Setup

``` bash
# install dependencies
npm install

# start express RESTful service layer at localhost:3030
npm run start-api

# build project
npm run build

# serve with hot reload at localhost:3000
npm run start
```

## Resources

* [RESTfulAPITutorial](https://github.com/generalgmt/RESTfulAPITutorial) Provided the underpinnings of my API services
* [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) Documentation on navigator.geolocation from Mozilla.
* [Google Maps API Reference](https://developers.google.com/maps/documentation/javascript/reference/map)
* [Google Places Service API Reference](https://developers.google.com/maps/documentation/javascript/reference/places-service)

## Notes on React

I was initially frustrated by React due to it's extremely unopinionated nature. 
It was difficult to figure out how to structure a React application given the simplicity of the boilerplate provided by 
the Create React App utility and the documentation provide on the React website. 
I ended up choosing a hybrid structure somewhere between what is used by the Vue.js and Angular boilerplate, and that 
actually worked out great. 
I chose MobX for data and state management over Redux, again because of the extremely unopinionated nature of Redux and 
the ambiguity of where to start given the documentation. 
MobX provided clear instructions for setting up a store manager in a React environment even though it 
really is just a set of utility HOC wrappers. 
It also reminded me a little of working with RxJS in Angular. Once I had my application architecture in place, 
porting the application over mostly became an exercise in building my render functions in React. 

## Author
Brock Henderson [@brocktopia](https://github.com/brocktopia/) ||
[brocktopia.com](https://brocktopia.com)