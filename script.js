"use strict";

//vars
const params = new URLSearchParams(window.location.search);
const gamemode = params.get("mode");
const questionField = document.querySelector("#question");
const options = document.querySelectorAll("#game-container > .answer-container");
const counter = document.querySelector("#counter");
const nextButton = document.querySelector("#next-button");
const heading = document.querySelector("#heading-game");
const progressbarRight = document.querySelector("#progressbar-right");
const progressbarWrong = document.querySelector("#progressbar-wrong");

//request variables
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const file = "assets/questions.json";
const username = "jfla42@gmail.com";
const password = "supersecretpassword";

const quizLength = 8;
const idRanges = [[203, 210]];
const modes = ["mathe", "it", "allgemein", "personen"];

var currentID = 2;
var currentProgress = 0;
var currentRight = "";
var questions = [];
var questionsDone = [];


document.addEventListener("DOMContentLoaded", function() {
    let model = new Model();
    let presenter = new Presenter(model);
    let view = new View(model, presenter);
    presenter.setView(view);
    model.setPresenterAndView(presenter, view);
    presenter.startGame();
});

//model
class Model {
    setPresenterAndView(presenter, view) {
        this.presenter = presenter;
        this.view = view;
    }

    //get questions from local file
    async getLocal() {
        return fetch(file).then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Error: " + response.status);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    checkAnswerLocal (answer) {
        if (answer === currentRight) {
            this.presenter.success = true;
        }
        else {
            this.presenter.success = false;
        }
    }

    //request question from remote server
    async getRemote(id) {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        return fetch(url+id, {
            method: "get",
            mode: "cors",
            headers: headers
          })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Error: " + response.status);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    //send multiple requests to external sever
    //finds correct answer to server question
    async getAnswersRemote (id) {
        let bodies = [];
        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/json");

        for (let i = 0; i < options.length; i++) {
            bodies.push("["+JSON.stringify(i)+"]");
        }

        try {
            let responses = await Promise.all(bodies.map(async body => {
                let response = await fetch(url+id+"/solve", {
                    method: "post",
                    mode: "cors",
                    headers: headers,
                    body: body
                });
                return response;
            }));

            for (let i = 0; i < responses.length; i++) {
                let data = await responses[i].json();
                if (data["success"]) {
                    currentRight = i+1;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

//view
class View {
    constructor(model, presenter) {
        this.model = model;
        this.presenter = presenter;
        this.setHandlers();
        this.selectable = true;
        this.rightCounter = 0;
        this.wrongCounter = 0;
    }

    setHandlers() {
        options[0].addEventListener("click", this.selectAnswer.bind(this, 1), false);
        options[1].addEventListener("click", this.selectAnswer.bind(this, 2), false);
        options[2].addEventListener("click", this.selectAnswer.bind(this, 3), false);
        options[3].addEventListener("click", this.selectAnswer.bind(this, 4), false);
        nextButton.addEventListener("click", this.nextButtonPress.bind(this), false);
    }

    //reset question states of buttons or redirect to results screen
    nextButtonPress() {
        if (currentProgress >= quizLength) {
            window.location.href = "results.html?mode="+gamemode+"&r="+this.rightCounter+"&w="+this.wrongCounter;
            return;
        }
        nextButton.disabled = true;
        this.selectable = true;
        for (let i = 0; i < options.length; i++) {
            options[i].style.backgroundColor = "lightgoldenrodyellow";
            options[i].style.cursor = "pointer";
        }
        this.presenter.nextQuestion();
    }

    setHeading() {
        let headings = ["Mathematik", "Internettechnologien", "Allgemeinwissen", "Noten", "Personen"];

        for (let i = 0; i < modes.length; i++) {
            if (gamemode === modes[i]) {
                heading.textContent = headings[i];
                return;
            }
        }
        heading.textContent = "Fehler: Spielmodus nicht gefunden";
    }

    //triggered when user selects an answer
    selectAnswer(answer) {
        if (!this.selectable) {
            console.log("not selectable");
            return;
        }
        currentProgress++;
        this.selectable = false;
        if (gamemode === "personen") {
            if (answer === currentRight) {
                this.presenter.success = true;
            }
            else {
                this.presenter.success = false;
            }
        }
        else {
            this.model.checkAnswerLocal(answer);
        }
        
        if (this.presenter.success) {
            options[answer-1].style.backgroundColor = "lightgreen";
        }
        else {
            options[answer-1].style.backgroundColor = "salmon";
            options[currentRight-1].style.backgroundColor = "lightgreen";
        }
        this.setProgress();
        this.endQuestion();
    }

    //updates progress bar
    setProgress() {
        if (this.presenter.success) {
            this.rightCounter++;
        }
        else {
            this.wrongCounter++;
        }
        let rightPercentage = this.rightCounter / quizLength * 100;
        let wrongPercentage = this.wrongCounter / quizLength * 100;
        progressbarRight.style.width = rightPercentage + "%";
        progressbarWrong.style.width = wrongPercentage + "%";
        this.setCounter();
    }

    //updates counter above next button
    setCounter() {
        counter.textContent = (this.rightCounter + this.wrongCounter) + " / " + quizLength;
    }

    //fills in question and answer options
    fillQuestion(q) {
        if (gamemode === "mathe") {
            katex.render(q[0], questionField, {throwOnError: false});
            for (let i = 0; i < q[1].length; i++) {
                katex.render(q[1][i], options[i].children[1], {throwOnError: false});
            }
        }
        else {
            questionField.innerHTML = q[0];
            for (let i = 0; i < options.length; i++) {
                options[i].children[1].innerHTML = q[1][i];
            }
        }
    }

    //block answer selection, shows next button
    endQuestion() {
        nextButton.disabled = false;
        if (currentProgress >= quizLength) {
            nextButton.textContent = "Auswertung ansehen";
        }
        else {
            for (let i = 0; i < options.length; i++) {
                options[i].style.cursor = "not-allowed";
            }
        }
    }
}

//presenter
class Presenter {
    constructor(model) {
        this.model = model;
        this.success = false;
    }

    setView(view) {
        this.view = view;
    }

    //initiates game for selected gamemode
    async startGame() {
        this.view.setHeading();
        this.view.setCounter();
        if (gamemode === "personen") {
            for (let i = idRanges[0][0]; i <= idRanges[0][1]; i++) {
                questions.push(i);
            }
        }
        else if (modes.includes(gamemode)) {
            await this.model.getLocal().then(data => {
                questions = data[gamemode];
            });
        }
        else {
            console.log("Error: gamemode not found");
        }
        this.nextQuestion();
    }

    //get random question from questions array
    //only for local questions
    getRandomQuestion() {
        let randomID = Math.floor(Math.random() * questions.length);
        let randomQuestion = questions[randomID];
        currentID = randomQuestion;
        questions.splice(randomID, 1);
        questionsDone.push(randomQuestion);
    }

    //gets triggered when next-button is pressed
    //gets new question to fill in
    nextQuestion() {
        this.getRandomQuestion();
        if (gamemode === "personen") {
            this.model.getAnswersRemote(currentID);
            this.model.getRemote(currentID).then(data => {
                this.view.fillQuestion([data["text"], data["options"]]);
            });
        }
        else {
            currentID["l"] = this.mixOptions(currentID["l"]);
            this.view.fillQuestion([currentID["a"], currentID["l"]]);
        }
    }

    //mixes the array
    //only for local questions
    mixOptions(options) {
        let right = options[0];
        //fisher-yates shuffle
        for (let i = options.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        for (let i = 0; i < options.length; i++) {
            if (options[i] === right) {
                currentRight = i+1;
            }
        }
        return options;
    }
}