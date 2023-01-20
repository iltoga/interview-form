# Interview Application

This application is a simple tool for conducting and recording interviews. It uses the Express framework for handling HTTP requests and routes, and the Body-Parser middleware for parsing request bodies. It also utilizes the FS and Moment modules for reading a file of questions and formatting the elapsed time of the interview, respectively.

## Features
- Input fields for candidate and interviewer names
- Checkboxes for recording the candidate's answers as correct, incorrect, or skipped
- A table of questions to be read from a text file
- A text area for recording the interviewer's notes
- A summary report of the interview's results, including the candidate's score, a breakdown of correct, incorrect, and skipped answers, and the elapsed time of the interview

## How to use
1. Start the application by running `node app.js` in the command line.
2. Visit the root route (http://localhost:3000/) in a web browser to begin the interview.
3. Fill in the candidate and interviewer name fields and answer the questions using the provided checkboxes.
4. Once all questions have been answered, submit the form to generate a summary report of the interview.
5. The report will include the candidate's score, a breakdown of correct, incorrect, and skipped answers, and the elapsed time of the interview.
6. The interviewer's notes will also be included in the report.

## Configuration
- The list of questions displayed in the interview can be edited by modifying the questions.txt file.
- The application can be configured to run on a different port by modifying the `app.listen()` function in app.js.
