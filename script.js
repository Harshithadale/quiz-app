document.addEventListener("DOMContentLoaded", function () {
  const userDetailSection = document.getElementById("user-details-section");
  const backgroundContainer = document.getElementById("category-section");
  const funFact = document.getElementsByClassName("fun-fact");
  const questionsPage = document.getElementById("questionsPage");
  const startBtn = document.getElementById("startBtn");
  const userName = document.getElementById("userName");
  const mcq = document.getElementById("mcq");
  const trueFalse = document.getElementById("true_false");
  const matching = document.getElementById("matching");
  const fillInTheBlank = document.getElementById("fill_in_the_blank");
  const nextBtn = document.getElementById("nextBtn");
  const saveBtn = document.getElementById("saveBtn");
  const finalScoreContainer = document.getElementById("finalScoreContainer");
  finalScoreContainer.style.display = "none"
  fillInTheBlank.style.display = "none";
  matching.style.display = "none";
  trueFalse.style.display = "none";
  mcq.style.display = "none";
  let quizData = null;
  userDetailSection.style.display = "none";
  questionsPage.style.display = "none";
  let score = 0
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      quizData = data["quiz_sections"];
      initSections();
    })
    .catch((error) => console.log(error));
  function initSections() {
    const sections = document.getElementsByClassName("section");
    Array.from(sections).forEach((element) => {
      element.addEventListener("click", function () {
        const currentSection = element.getAttribute("data-section");
        startQuiz(currentSection);
      });
    });
  }
  function getShuffledNumbers(range) {
    const numbers = Array.from({ length: range + 1 }, (_, i) => i);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }
  function startQuiz(index) {
    userDetailSection.style.display = "flex";
    backgroundContainer.style.display = "none";
    funFact[0].style.display = "none";

    startBtn.onclick = () => {
      if (userName.value == "") {
        alert("Please Enter Name Before Starting Quiz");
      } else {
        userDetailSection.style.display = "none";
        questionsPage.style.display = "flex";
        displayQuestions(index);
      }
    };
  }
  function displayQuestions(index) {
    document.getElementById("main-head").style.display = "none"
    document.getElementById("wishesMessage").classList.add("capital")
    document.getElementById("wishesMessage").textContent = `All the Best, ${userName.value} `;
    console.log(index);
    const categoryData = Array.from(quizData)[index];
    const randomNumbers = getShuffledNumbers(14);
    executeQuestion(categoryData["questions"][randomNumbers[0]]);
    let count = 1;
    nextBtn.onclick = () => {
      nextButtonFunction(categoryData, randomNumbers[count]);
      count++;
      if (count >10) {
        questionsPage.style.display = "none";
        finalScoreContainer.style.display = "flex";
        document.getElementById("score").textContent = `Score: ${score}`
        return;
      }
    };
  }
  function nextButtonFunction(categoryData, randomNumber) {
    executeQuestion(categoryData["questions"][randomNumber]);
     saveBtn.style.display ="block"
  }
  function checkAnswer(userAnswer,correctAnswer,type){
    switch (type){
      case "mcq":
        if(userAnswer == correctAnswer){
            score += 1
        }
        break;
      case "fill_in_the_blank":
        if(userAnswer == correctAnswer){
          score += 1
        }
        break
      case "true_false":
        if(userAnswer==correctAnswer.toString()){
          score =  score + 1
        }
        break
      case "matching":
        let correct = true
        for (let i=0;i < 4;i++){
          if(userAnswer[i] != correctAnswer[i]){
            correct = false;
            break
          }
        }
        if(correct){
          score += 1;
        }
        break
    }
    console.log(score)
  }
  function executeQuestion(question) {
    fillInTheBlank.style.display = "none";
    matching.style.display = "none";
    trueFalse.style.display = "none";
    mcq.style.display = "none";
    console.log(question);
    const questionPara = document.getElementById("question");
    questionPara.textContent = question["question"];
    if (question["type"] == "mcq") {
      let userAnswer = null;
      mcq.style.display = "flex";
      let count = 1;
      const options = Array.from(document.querySelectorAll(".mcq-option"));
      for (let i = 0; i < options.length; i++) {
        for (let j = 0; j < options.length; j++) {
                 options[j].classList.remove("active");
              }
        options[i].textContent =
          question["options"][count - 1];
        count++;
        options[i].onclick=()=>{
             for (let j = 0; j < options.length; j++) {
                 options[j].classList.remove("active");
                }
                options[i].classList.add("active")
          userAnswer = options[i].textContent
          saveBtn.onclick=()=>{
            saveBtn.style.display = "none"
            checkAnswer(userAnswer,question["answer"],question["type"])

          }
        }

      }

    } else if (question["type"] == "fill_in_the_blank") {
      const fillInBlanksInp = document.getElementById("fill-in-blanks-inp")
      fillInTheBlank.style.display = "flex";
       saveBtn.onclick=()=>{
            saveBtn.style.display = "none"
            checkAnswer(fillInBlanksInp.value,question["answer"],question["type"])
          }
          fillInBlanksInp.value=""

    } else if (question["type"] == "matching") {
    
      let count = 1;
      const matchLeftOptions =
        document.getElementsByClassName("match-option-left");
      const matchRightOptions =
        document.getElementsByClassName("match-option-right");
      for (let [key, val] of Object.entries(question["pairs"])) {
        matchLeftOptions[count - 1].textContent = key;
        matchRightOptions[count - 1].textContent =
          String.fromCharCode(64 + count) + " . " + val;
        count++;

      }
      saveBtn.onclick=()=>{
            saveBtn.style.display = "none"
              const matchAnswers = Array.from(document.getElementsByClassName("match-inp"))
              const answersArray =[]
              for(let i=0;i<4;i++){
                answersArray.push((matchAnswers[i].value).toLowerCase())
              }
              checkAnswer(answersArray,question["answer"],question["type"])
          }
      matching.style.display = "flex";

    } else if (question["type"] == "true_false") {
      trueFalse.style.display = "flex";
      saveBtn.onclick=()=>{
            saveBtn.style.display = "none"
            console.log(document.querySelector('input[name="bool"]:checked').value)
            checkAnswer(document.querySelector('input[name="bool"]:checked').value,question["answer"],question["type"])

          }
    }
  }
});
function restartFunction(){
  location.reload()
}