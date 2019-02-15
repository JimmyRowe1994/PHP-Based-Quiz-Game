$(document).ready(loadLeaderboard());

var amountOfQuestions;
var correctAnswer;
var selectedAnswer;
var questionIndex = 0;
var questionArr = [];
var hoverSound = new Audio('../Assets/Sounds/hoverSound.flac');
var submitSound = new Audio('../Assets/Sounds/submitSound.wav');
var timerSecond = document.querySelector("#timerSecond");
var timerMinute = document.querySelector("#timerMinute");
var second = 0;
var minute = 0;
var gameOver = true;
var correctTally = 0;
var points = 0;
var startTimer;

$("#easyButton").on("click", function() {
	$(this).css("background", "#2c5272");
	$("#hardButton").css("background", "red");
	amountOfQuestions = 25;
})

$("#hardButton").on("click", function() {
	$(this).css("background", "#a20000");
	$("#easyButton").css("background", "steelblue");
	amountOfQuestions = 50;
})

$("#startButton").on("click", function() {
	if(!$.trim($("#nameInput").val())) {
		alert("Please enter a name.");
		$("#nameInput").val("");
		return;
	}

	if(!amountOfQuestions) {
		alert("Please select a difficulty.");
		return;
	}

	getQuestions();

	gameOver = false;
	startTimer = setInterval(timer, 1000);

	$("#startScreen").removeClass("bottomDisplay");
	$("#startScreen").addClass("hidden");
	$("#answerDisplay").removeClass("hidden");
	$("#answerDisplay").addClass("bottomDisplay");
})

$(".answer").on("click", function() {
	$(".answer").removeClass("selected");
	$(this).addClass("selected");
	selectedAnswer = $(this).text();
})

$(".answer").on("mouseover", function() {
	hoverSound.play();
})

$("#submitButton").on("click", function() {
	if(!selectedAnswer) {
		alert("Please select an answer.");
		return;
	}
	if(selectedAnswer == correctAnswer) {
		correctTally++;
	}
	submitSound.play();
	loadNextQuestion(++questionIndex, questionArr);
})

$("#uploadScoreButton").on("click", function() {
	uploadScore();
})

$("#retryButton").on("click", function() {
	reset();
});

function timer() {
	// setInterval(function() {
		if(!gameOver) {
			second++;
			if(second == 60) {
				second = 0;
				minute++;
			}
			timerMinute.textContent = ("0" + minute).slice(-2);
			timerSecond.textContent = ("0" + second).slice(-2);
		}
	// }, 1000)
}

function loadLeaderboard() {
	$.ajax({
		url: "../PHP/easyLeaderboard.php",
		method: "GET",
		dataType: "JSON",
		success: function(response) {
			var easyLeaderboard = document.querySelectorAll(".easyLeaderboardRanking");
			for(var i = 0; i < response.length; i++) {
				if(response[i]) {
					var responseString = response[i].player_name + " | " + response[i].correct_tally + "/25 (" + response[i].percentage + "%) | " + response[i].time + " | " + response[i].points + " Points";
					easyLeaderboard[i].textContent = responseString;
				}
			}
		}
	})

	$.ajax({
		url: "../PHP/hardLeaderboard.php",
		method: "GET",
		dataType: "JSON",
		success: function(response) {
			var hardLeaderboard = document.querySelectorAll(".hardLeaderboardRanking");
			for(var i = 0; i < response.length; i++) {
				if(response[i]) {
					var responseString = response[i].player_name + " | " + response[i].correct_tally + "/50 (" + response[i].percentage + "%) | " + response[i].time + " | " + response[i].points + " Points";
					hardLeaderboard[i].textContent = responseString;
				}
			}
		}
	})
}

function getQuestions() {
	$.ajax({
		url: "../PHP/questions_and_answers.php",
		method: "GET",
		dataType: "JSON",
		success: function(response) {
			for(var i = 0; i < response.length; i++) {
				var newObj = {
					question: response[i].question,
					answerOne: response[i].answer1,
					answerTwo: response[i].answer2,
					answerThree: response[i].answer3,
					answerFour: response[i].answer4,
					correctAnswer: response[i].correctAnswer
				}
				questionArr.push(newObj);
			}
			loadNextQuestion(questionIndex, questionArr);
		}
	})
}

function loadNextQuestion(questionIndex, questionArr) {
	if(questionIndex == amountOfQuestions) {
		$("#answerDisplay").removeClass("bottomDisplay");
		$("#answerDisplay").addClass("hidden");
		$("#endScreen").removeClass("hidden");
		$("#endScreen").addClass("bottomDisplay");
		gameOver = true;
		endGame();
		return;
	}

	$("#question").html(questionArr[questionIndex].question);
	$("#answerOne").html(questionArr[questionIndex].answerOne);
	$("#answerTwo").html(questionArr[questionIndex].answerTwo);
	$("#answerThree").html(questionArr[questionIndex].answerThree);
	$("#answerFour").html(questionArr[questionIndex].answerFour);
	$("#questionNumber").text("Q" + (questionIndex + 1));
	correctAnswer = questionArr[questionIndex].correctAnswer;
	selectedAnswer = "";
	$(".answer").removeClass("selected");

	if(questionIndex == (amountOfQuestions - 1)) {
		$("#submitButton").text("Finish Quiz");
	}
}

function endGame() {
	$("#question").text("You finished the quiz!");
	$("#correctTally").text(correctTally);
	if(correctTally == amountOfQuestions) {
		$("#correctTally").css("color", "green");
	}
	$("#amountOfQuestions").text(amountOfQuestions);
	points = (correctTally * 100) - (Number(timerMinute.textContent + timerSecond.textContent))
	$("#points").text(points);
	$("#endMinute").text(timerMinute.textContent);
	$("#endSecond").text(timerSecond.textContent);
}

function uploadScore() {
	var name = $("#nameInput").val();
	var percentage = (correctTally / amountOfQuestions) * 100;
	percentage = percentage.toFixed();
	var time = $("#totalTimer").text();
	if(amountOfQuestions == 25) {
		amountOfQuestions = "easy";
	}
	else {
		amountOfQuestions = "hard";
	}
	$.ajax({
		url: "../PHP/uploadScore.php",
		data: {name: name, correctTally: correctTally, questions: amountOfQuestions, percentage: percentage, time: time, points: points},
		method: "POST",
		// dataType: "JSON",
		success: function(response) {
			alert(response);
			reset();
		}
	})
}

function reset() {
	$("#nameInput").val("");
	$("#easyButton").css("background", "steelblue");
	$("#hardButton").css("background", "red");
	amountOfQuestions = 0;
	selectedAnswer = "";
	questionIndex = 0;
	questionArr = [];
	gameOver = true;
	minute = 0;
	second = 0;
	timerSecond.textContent = "00";
	timerMinute.textContent = "00";
	clearInterval(startTimer);
	correctTally = 0;
	points = 0;
	$("#question").text("The Video Game Quiz");
	$("#questionNumber").text("Q0");
	$("#correctTally").css("color", "red");

	$(".easyLeaderboardRanking").text("No Player Data");
	$(".hardLeaderboardRanking").text("No Player Data");

	$("#nextButton").html("Next Question <i class='fas fa-arrow-right'></i>")

	loadLeaderboard();

	$("#endScreen").addClass("hidden");
	$("#endScreen").removeClass("bottomDisplay");
	$("#startScreen").removeClass("hidden");
	$("#startScreen").addClass("bottomDisplay");
}