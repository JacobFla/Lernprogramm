"use strict";

const fieldRight = document.querySelector("#valueRight");
const fieldWrong = document.querySelector("#valueWrong");
const fieldPercentage = document.querySelector("#percentage");

const URLparams =  new URLSearchParams(window.location.search);
const mode = URLparams.get("mode");
const rightParam = URLparams.get("r");
const wrongParam = URLparams.get("w");
const right = parseInt(rightParam);
const wrong = parseInt(wrongParam);
const button = document.querySelector("#button");

document.addEventListener("DOMContentLoaded", function() {
    fieldRight.textContent = right;
    fieldWrong.textContent = wrong;
    var text = fieldPercentage.innerHTML;
    fieldPercentage.innerText = ("Insgesamt hast du " + getPercentage(right, wrong) + "% richtig beantwortet!");

    button.addEventListener("click", function() {
        window.location.href = "game.html?mode="+mode;
    });

});

function getPercentage(r, w) {
    return Math.round((r / (r + w)) * 100);
}