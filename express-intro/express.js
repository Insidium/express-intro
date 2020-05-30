// File handling for our persisted data
const fs = require('fs');
// require express
const express = require('express');
// require	 body-parser
const bodyParser = require('body-parser');
// require cors (Cross Origin Resource Sharing)
const cors = require('cors');

// enable express router
const router = express.Router();

// enables us to use express (our server) by calling 'app'
const app = express();

//turns req.data into JSON parse req.body - routes will be passed through this middleware
app.use(bodyParser.json());

// use cors to allow resource sharing with everyone
app.use(cors());

// use express router - first argument is the root path of routes handled
app.use('/', router);

// ***ROUTES***

// GET '/'
// use get verb on server, passing in URL, the randomPair function and a callback function with a request and response
router.get('/', randomPair, (req, res) => {
	//express detects the default status for response as 200 and recognises the content type of the contents within - sends through random pair of students
	res.send(req.pair);
});

// GET '/students'
router.get('/students', (req, res) => {
	// returns our array of students
	res.send(students);
});

// POST '/students'
router.post('/students', logger, (req, res) => {
	// push to students array
	students.push(req.body.name);
	//persist the data data in the file/array
	persistStudentData('students.txt', students);
	//set status code to 201 - 'created' - return students array
	res.status(201).send(students);
});

// Middleware - if you have made it yourself

// logger middleware used to log something and then move to next part of code
function logger(req, res, next) {
	// log req.body in console
	console.log('We got one!', req.body);
	// move to next part of code if successful
	next();
}

// uses fs library module to use a synchronous method to
const readStudentData = (file) => {
	// read data from a file as UTF8 and split on new line to populate array of students
	let students = fs.readFileSync(file, 'utf8').split('\n');
	// return the array of students
	return students;
};
// function passes in file name and students array
const persistStudentData = (file, students) => {
	// writes whatever is in the students array to the file, joining on the new line, sending across a string with new lines in it
	fs.writeFileSync(file, students.join('\n'));
	// console.log to let us know that this has happened
	console.log('updated students:', students);
	//return students array
	return students;
};

// select two random students from array
function randomPair(req, res, next) {
	let s1Ind = Math.floor(Math.random() * students.length);
	let s2Ind = Math.floor(Math.random() * students.length);
	// Return a JSON object as a req with an array
	req.pair = {
		pair: [students[s1Ind], students[s2Ind]],
	};
	//go to next if successful
	next();
}

// Initialise students
let students = [];
students = readStudentData('students.txt');

// set up port
const port = 3009;
// get server to listen on port (port number interpolated in) - npm run express-server to activate
app.listen(port, () => {
	console.log(`App listening on port ${port}!`);
});
