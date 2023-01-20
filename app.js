const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let questions = [];
let candidateName, notes, interviewerName;
let correctAnswers = 0;
let incorrectAnswers = 0;
let unansweredQuestions = 0;
let correctQuestions = [];
let incorrectQuestions = [];
let skippedQuestions = [];
let score = 0;
let startTime, endTime, elapsedTime;
let formattedElapsedTime;



fs.readFile('questions.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        questions = data.split('\n');
    }
});

app.get('/', (req, res) => {
  startTime = new Date();

  let form = `
  <style>
      body {font-family: Arial, sans-serif; margin: 0; padding: 0;}
      h1 {text-align: center; padding: 20px; background-color: #f2f2f2;}
      form {margin: 20px; padding: 20px; background-color: #f2f2f2;}
      label {font-weight: bold; margin-right: 10px;}
      input[type=text], input[type=submit] {padding: 12px 20px; margin: 8px 0; box-sizing: border-box; border: 2px solid #ccc; border-radius: 4px;}
      input[type=submit] {background-color: #4CAF50; color: white; cursor: pointer;}
      table {width: 100%; border-collapse: collapse; margin-top: 20px;}
      th, td {border: 1px solid #dddddd; text-align: left; padding: 4px;}
      th {background-color: #f2f2f2; font-weight: bold;}
      div {margin: 20px; padding: 20px; background-color: #f2f2f2;}
      p {font-weight: bold; margin-bottom: 10px;}
      ul {list-style-type: none; padding: 0; margin: 0;}
      li {margin-bottom: 10px;}
      .report {font-family: Arial, sans-serif; margin: 20px; padding: 20px; background-color: #f2f2f2;}
      .report h1 {text-align: center; padding: 20px; background-color: #f2f2f2;}
      .report h2 {font-weight: bold; margin-bottom: 10px;}
      .report ul {list-style-type: none; padding: 0; margin: 0;}
      .report li {margin-bottom: 10px;}
    </style>
  
    <form method="POST" action="/">
        <label>Candidate Name:</label>
        <input type="text" name="candidateName" required />
        <label>Interviewer Name:</label>
        <input type="text" name="interviewerName" required />
        <table>
          <tr>
            <td>Correct</td>
            <td>Incorrect</td>
            <td>Skipped</td>
            <td>Question</td>
          </tr>
  
        `;

  questions.forEach((question, index) => {
    form += `
    <tr>
    <td><input type="checkbox" name="question${index}-correct" value="correct" /> </td>
    <td><input type="checkbox" name="question${index}-incorrect" value="incorrect" /> </td>
    <td><input type="checkbox" name="question${index}-skipped" value="skipped" /> </td>
    <td>${question}</td>
    </tr>
    `;
  });

  form += `
        </table>
        <label>Interviewer notes:</label>
        <br>
        <textarea rows="5" cols="80" name="notes"></textarea>
        <br>
        <table>
        <input type="submit" value="Submit" />
    </form>
    `;

  res.send(form);
});

app.post('/', (req, res) => {
  candidateName = req.body.candidateName;
  notes = req.body.notes;
  interviewerName = req.body.interviewerName;
  correctAnswers = 0;
  incorrectAnswers = 0;
  unansweredQuestions = 0;
  correctQuestions = [];
  incorrectQuestions = [];
  skippedQuestions = [];

  endTime = new Date();
  elapsedTime = endTime - startTime;
  const duration = moment.duration(elapsedTime);
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();
  formattedElapsedTime = `${h}:${m}:${s}`;


  questions.forEach((question, index) => {
    if (req.body[`question${index}-correct`] === 'correct') {
      correctAnswers++;
      correctQuestions.push(question);
    } else if (req.body[`question${index}-incorrect`] === 'incorrect') {
      incorrectAnswers++;
      incorrectQuestions.push(question);
    } else if (req.body[`question${index}-skipped`] === 'skipped') {
      unansweredQuestions++;
      skippedQuestions.push(question);
    }
  });

  score = (correctAnswers * 2) + (incorrectAnswers * -1) + (unansweredQuestions * -2);
  

  res.send(`
  <div class="report">
    <h1>Report for ${candidateName}</h1>
    <div>
        <h2>Correct Answers: ${correctAnswers}</h2>
        <ul>
            ${correctQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>
    </div>
    <div>
        <h2>Incorrect Answers: ${incorrectAnswers}</h2>
        <ul>
            ${incorrectQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>
    </div>
    <div>
        <h2>Unanswered Questions: ${unansweredQuestions}</h2>
        <ul>
            ${skippedQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>
    </div>
    <div>
        <h2>Interview time: ${formattedElapsedTime}</h2>
        <h2>Score: ${score}</h2>
        <h2>Interviewer Notes from ${interviewerName}</h2>
        <ul>
            ${notes}
        </ul>
    </div>

  </div>

  <form method="POST" action="/" id="export-form">
  <input type="hidden" name="candidateName" value="${candidateName}">
  <input type="button" value="Export" onclick="exportReport()">
  </form>

  <script>
    function exportReport() {
      let form = document.getElementById("export-form");
      form.action = '/export';
      form.submit();
    }
  </script>

`);
});

app.post('/export', (req, res) => {
  let candidateName = req.body.candidateName;
  let report = `
    Report for ${candidateName}

    Correct Answers: ${correctAnswers}
    ${correctQuestions.map(q => `- ${q}`).join('\n')}

    Incorrect Answers: ${incorrectAnswers}
    ${incorrectQuestions.map(q => `- ${q}`).join('\n')}

    Unanswered Questions: ${unansweredQuestions}
    ${skippedQuestions.map(q => `- ${q}`).join('\n')}

    Interview time: ${formattedElapsedTime}
    Score: ${score}

    Interviewer: ${interviewerName}
    Notes: ${notes}
  `;

  let fileName = `${candidateName.replace(/\s/g, '_')}.txt`;
  fs.writeFileSync(fileName, report);
  res.download(fileName);
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});

