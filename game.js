"use strict";

function getRandomQuestion(questions) {
    var size = questions.length;
    var index = Math.floor(Math.random() * size);
    return questions[index];
}

let questions = [];

async function getQuestionsAsync (id) {
    let question;
    let response = await fetch(url+id, {
        method: 'get',
        mode: 'cors',
        headers: headers
      });
    let data = await response.json().then(data => {
        question = data;
        questions.push(question);
    })
    .catch(error => {
        console.log(error);
    });
    return question;
}

const URLparams =  new URLSearchParams(window.location.search);
const mode = URLparams.get("mode");

const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const username = "test@gmail.com";
const password = "secret";
const headers = new Headers();
headers.append("Authorization", "Basic " + btoa(username + ":" + password));

document.addEventListener("DOMContentLoaded", function() {
    let q;
    switch (mode) {
        case "mathe":
            heading.innerHTML = "Mathematik";
            break;
        case "it":
            heading.innerHTML = "Internettechnologien";
            break;
        case "allgemein":
            heading.innerHTML = "Allgemeinwissen";
            break;
        case "noten":
            heading.innerHTML = "Noten lernen";
            break;
        case "personen":
            let idRange = [2, 33];

            for (let i = idRange[0]; i <= idRange[1]; i++) {
                getQuestionsAsync(i);
            }
            heading.innerHTML = "Personen";
            console.log(questions);
            q.innerHTML = q;
            break;
        default:
            heading.innerHTML = "Error 404";
            break;
    }
});

const heading = document.querySelector("h1");
const q = document.querySelector("#question");
const answer1 = document.querySelector("#answer1");
const answer2 = document.querySelector("#answer2");
const answer3 = document.querySelector("#answer3");
const answer4 = document.querySelector("#answer4");

document.addEventListener("DOMContentLoaded", function() {

    /*
    // lokale JSON Datei asynchron laden
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "assets/questions.json", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        questions = response;
        
        if (mode === "mathe") {
            var q = getRandomQuestion(questions['teil-mathe']);
            heading.innerHTML = "Mathematik";
            question.innerHTML = "\\("+q.a+"\\)";
            answer1.innerHTML = "\\("+q.l[0]+"\\)";
            answer2.innerHTML = "\\("+q.l[1]+"\\)";
            answer3.innerHTML = "\\("+q.l[2]+"\\)";
            answer4.innerHTML = "\\("+q.l[3]+"\\)";
        }
        else if (mode === "it") {
            heading.innerHTML = "Internettechnologien";
            var q = getRandomQuestion(questions['teil-internettechnologien']);
            
        }
        else if (mode === "allgemein") {
            heading.innerHTML = "Allgemeinwissen";
        }
        else if (mode === "noten") {
            heading.innerHTML = "Noten lernen";
        }
        else if (mode === "personen") {
            heading.innerHTML = "Personen";
        }
        else {
            heading.innerText = "Error 404";
        }

        }
        
        renderMathInElement(document.body, {
            // customised options
            // • auto-render specific keys, e.g.:
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            // • rendering keys, e.g.:
            throwOnError : false
          });
        
    };
    xhr.send(null);
    
    */
});