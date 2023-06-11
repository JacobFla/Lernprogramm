"use strict";

//vars
const params = new URLSearchParams(window.location.search);
const gamemode = params.get("mode");
const questionField = document.querySelector("#question");
const options = document.querySelectorAll("#game-container > .answer-container");
const nextButton = document.querySelector("#next-button");
const heading = document.querySelector("#heading-game");
const progressbarRight = document.querySelector("#progressbar-right");
const progressbarWrong = document.querySelector("#progressbar-wrong");

const quizLength = 6;
const idRange = [2, 33];
const modes = ["mathe", "it", "allgemein", "noten", "personen"];
var currentID = 2;
var currentProgress = 0;
var currentRight = "";
var questions = [];
var questionsDone = [];

//request variables
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const file = "assets/questions.json";
const username = "test@gmail.com";
const password = "secret";

document.addEventListener("DOMContentLoaded", function() {
    let model = new Model();
    let presenter = new Presenter(model);
    let view = new View(presenter);
    presenter.setModelAndView(model, view);
    model.setPresenterAndView(presenter, view);

    model.startGame();
});

//model
class Model {
    constructor() {

    }

    setPresenterAndView(presenter, view) {
        this.presenter = presenter;
        this.view = view;
    }

    startGame() {
        if (gamemode === "personen") {
            this.getRemote(2).then(data => {
                console.log(data);
                
                

            });
        }
        else if (modes.includes(gamemode)) {
            this.getLocal().then(data => {
                questions = data[gamemode];
                let q = this.getRandomQuestion();
                q["l"] = this.presenter.mixOptions(q["l"]);
                this.view.fillQuestion([q["a"], q["l"]]);
            });
        }
        else {
            console.log("Error: gamemode not found");
        }
    }

    //get random question from questions array
    //only for local questions
    getRandomQuestion() {
        let randomID = Math.floor(Math.random() * questions.length);
        let randomQuestion = questions[randomID];
        questions.splice(randomID, 1);
        questionsDone.push(randomQuestion);
        return randomQuestion;
    }

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

    async getRemote(id) {
        let q;
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
}

//view
class View {
    constructor(presenter) {
        this.presenter = presenter;  // Presenter
        this.setHandler();
        this.selectable = true;
    }

    setHandler() {
        options[0].addEventListener("click", this.selectAnswer.bind(this, 1), false);
        options[1].addEventListener("click", this.selectAnswer.bind(this, 2), false);
        options[2].addEventListener("click", this.selectAnswer.bind(this, 3), false);
        options[3].addEventListener("click", this.selectAnswer.bind(this, 4), false);

        nextButton.addEventListener("click", this.next.bind(this), false);
    }

    next () {
        this.presenter.nextButtonPress();
    }

    async selectAnswer(answer) {
        if (!this.selectable) {
            console.log("not selectable");
            return;
        }
        currentProgress++;
        this.selectable = false;
        if (gamemode === "personen") {
            await this.presenter.checkAnswerRemote(currentID, answer);
        }
        else {
            console.log(answer);
            this.presenter.checkAnswerLocal(answer);
        }
        
        if (this.presenter.success) {
            options[answer-1].style.backgroundColor = "lightgreen";
        }
        else {
            options[answer-1].style.backgroundColor = "salmon";
        }
        this.presenter.setProgress();
        this.endQuestion();
    }

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

    //block answer selection, show next button
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
        this.rightCounter = 0;
        this.wrongCounter = 0;
    }

    setModelAndView(model, view) {
        this.model = model;
        this.view = view;
    }

    async startGame() {
        await this.model.getQuestionsAsync(idRange).then(data => {});
        //this.view.fillQuestion();
    }

    nextButtonPress() {
        console.log("next: r="+this.rightCounter + "w=" + this.wrongCounter);
        if (currentProgress >= quizLength) {
            window.location.href = "results.html?r="+this.rightCounter+"&w="+this.wrongCounter;
            return;
        }
        console.log("next question");
        nextButton.disabled = true;
        this.view.selectable = true;
        for (let i = 0; i < options.length; i++) {
            options[i].style.backgroundColor = "lightgoldenrodyellow";
            options[i].style.cursor = "pointer";
        }

        //TODO nextQuestion
    }
    
    setProgress() {
        if (this.success) {
            this.rightCounter++;
            console.log(this.rightCounter);
        }
        else {
            this.wrongCounter++;
        }
        let rightPercentage = this.rightCounter / quizLength * 100;
        let wrongPercentage = this.wrongCounter / quizLength * 100;
        progressbarRight.style.width = rightPercentage + "%";
        progressbarWrong.style.width = wrongPercentage + "%";
    }

    mixOptions(options) {
        let right = options[0];

        //fisher-yates shuffle
        console.log("pre shuffle: "+options);
        for (let i = options.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        console.log("post shuffle: "+options);

        for (let i = 0; i < options.length; i++) {
            if (options[i] === right) {
                currentRight = i+1;
            }
        }
        console.log("rightAnswer: "+currentRight);
        return options;
    }

    checkAnswerLocal (answer) {
        if (answer === currentRight) {
            this.success = true;
        }
        else {
            this.success = false;
        }
    }

    async checkAnswerRemote (id, answer) {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/json");
        let response = await fetch(url+id+"/solve", {
            method: "post",
            mode: "cors",
            headers: headers,
            body: "["+JSON.stringify(answer)+"]"
        });
        let solution = await response.json().then(data => {
            console.log(data);
            console.log(data["success"]);
            this.success = data["success"];
            return data;
        })
        .catch(error => {
            console.log(error);
        });
    }
}