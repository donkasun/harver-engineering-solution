const { getRandomWordSync, getRandomWord } = require('word-maker');
const fs = require('fs');
const now = require('performance-now');

const DEFAULT_WORD_ERROR_MESSAGE = "It shouldn't break anything!";
const FIZZ = 'Fizz';
const BUZZ = 'Buzz';
const FIZZ_BUZZ = 'FizzBuzz';
// console.log('It works!');

// YOUR CODE HERE

doTasks();

async function doTasks() {
	console.log('Running Tasks!');
	createFile();
	task('Task 1 - Synchronous');
	task('Task 2 - Synchronous FizzBuzz', { fizz: true });
	await task('Task 3.1 - Asynchronous', { async: true });
	await task('Task 3.2 - Asynchronous FizzBuzz', { fizz: true, async: true });
	task('Task 4.1 - Synchronous WithErrors', { withErrors: true });
	task('Task 4.2 - Synchronous FizzBuzz WithErrors', { fizz: true, withErrors: true });
	await task('Task 4.3 - Asynchronous WithErrors', { async: true, withErrors: true });
	await task('Task 4.4 - Asynchronous FizzBuzz WithErrors', {
		async: true,
		fizz: true,
		withErrors: true,
	});
	await task('Bonus Task - Slow Asynchronous', { async: true, slow: true });
	console.log('Done!');
}

function createFile() {
	try {
		fs.open('results.txt', 'w', function (err) {
			if (err) console.error(err);
		});
	} catch (error) {
		console.log('Error ocurred while handling file');
	}
}

async function task(title, options = {}) {
	let startTime = now();
	let result = await getResult(options);
	let duration = now() - startTime;
	duration = Math.abs(Math.round(duration));
	writeToFile(title, duration, result);
}

async function getResult(options) {
	const { fizz, async, withErrors, slow = false } = options;
	let index = 0;
	let result = '';
	let word = '';
	let promiseList = [];
	do {
		try {
			if (slow) {
				word = getRandomWord({ slow });
			} else if (async) {
				word = await getRandomWord({ withErrors, slow });
			} else {
				word = getRandomWordSync({ withErrors });
			}

			if (fizz) {
				word = checkFizzBuzz(word, index);
			}
		} catch (error) {
			word = DEFAULT_WORD_ERROR_MESSAGE;
		}

		if (slow) {
			promiseList.push(word);
		} else {
			result += `${index + 1}: ${word}\n`;
		}

		index++;
	} while (index < 100);

	if (slow) {
		return Promise.all(promiseList).then((values) => {
			values.forEach((element, index) => {
				result += `${index + 1}: ${element}\n`;
			});
			return result;
		});
	}
	return result;
}

function checkFizzBuzz(word, index) {
	let multipleOfThree = (index + 1) % 3 == 0 ? true : false;
	let multipleOfFive = (index + 1) % 5 == 0 ? true : false;
	if (multipleOfThree && multipleOfFive) word = FIZZ_BUZZ;
	else if (multipleOfFive) word = BUZZ;
	else if (multipleOfThree) word = FIZZ;
	return word;
}

function writeToFile(title, duration, result) {
	let fileData = `\n${title} (Time elapsed: ${duration}ms)\n${result}\n`;
	// console.log(fileData);
	fs.appendFile('results.txt', `${fileData}`, function (err) {
		if (err) console.error('Error ocurred while writing to file', err);
	});
}
