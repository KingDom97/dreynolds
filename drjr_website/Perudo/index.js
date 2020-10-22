class Player {
    constructor(name) {
        this.name = name;
        this.noOfDice = 5;
        this.dice = [];
        this.palifico = true;
        this.freq = [0, 0, 0, 0, 0, 0];
        this.diceImg = [];
    }
}

let instructions_header = document.getElementById("instructions");
let button = document.getElementById("btn");
let dudo_button = document.getElementById("dudo");
let die_buttons = document.getElementById("die");
let bet_button = document.getElementById("bet");
let bet_btns = document.getElementById("bet-btns");
let newGame_button = document.getElementById("new-game");
const htp_btn = document.getElementById("htp");
const diceArr = ["dice1.png", "dice2.png", "dice3.png", "dice4.png", "dice5.png", "dice6.png"];
const diceRoll = new Audio('DiceRoll.mp3');
let totalDice = 20;
let palificoPlayer = 0;
let turn = 0;
let newGame = true;
let betD = 0;
let betN = 0;
let aces = false;
let palificoR = false;
let betButtons = [];
let dieButton = [];

let players = [new Player("Blue"), new Player("Green"), new Player("Pink"), new Player("Red")];

function newRound() {
    if (checkPalifico()) {
        turn = palificoPlayer;
    } else {
        turn = Math.floor(Math.random() * (players.length));
        instructions_header.innerText = "Let's play";
    }
    randomiseDice();
    turn = nextTurn(turn);
   
}

function compBet() {
    const numbers = players[turn].dice;
    const totals = players[turn].freq;
    //figure out if it is the first turn
    if (betD === 0) {
        betN = totals.reduce(function(a, b) {
            return(Math.max(a, b));
        });
        betD = totals.indexOf(betN) + 1;
        if (betD === 1) {
            if (palificoR) {
                document.getElementById("bet-" + players[turn].name).innerText = `${(betN / 2)} aces`
            } else if (!Number.isInteger(betN / 2)) {
                betN++;
                document.getElementById("bet-" + players[turn].name).innerText = `${(betN / 2)} aces`;
            } else {
                document.getElementById("bet-" + players[turn].name).innerText = `${(betN / 2)} aces`;
            }
        } else {
            document.getElementById("bet-" + players[turn].name).innerText = `${betN} ${betD}s`
        }
    } else if (isLikely(betD, betN)) {
        if (totals[betD - 1] * (totalDice / 4) > betN || palificoR) {
            betN++;
        } else {
            let x = totals.reduce(function(a, b) {
                return(Math.max(a, b));
            });
            let y = totals.indexOf(x) + 1;
            if (y <= betD) {
                betN++;
            }
            betD = y;
        }
        if (betD === 1 &! palificoR) {
            if (!Number.isInteger(betN / 2)) {
                betN++;
            }
            document.getElementById("bet-" + players[turn].name).innerText = `${(betN / 2)} aces`;
        } else {
            document.getElementById("bet-" + players[turn].name).innerText = `${betN} ${betD}s`
        }
    } else {
        dudo(turn - 1);
        newGame = true;
        totalDice--;
        betD = 0;
        betN = 1;
        button.innerText = "Roll Dice";
    }
    
}
function dudo(culprit) {
    console.log(players[turn].name);
    console.log(turn);
    let d = 0;
    let a = 0;
    for (let i = 0; i < players.length; i++) {
        if (betD > 1) {d += players[i].freq[betD - 1];}
        a += players[i].freq[0];
    }
    document.getElementById("bet-Blue").innerText = "";
    for (let i = 1; i < players.length; i++) {
        if (turn != 0) {
            document.getElementById("Blue-cup").classList.add("lift");
            document.getElementById("Blue-cup").classList.add("hold");
        }
        document.getElementById("bet-" + players[i].name).innerText = "";
        document.getElementById(players[i].name + "-cup").classList.add("lift");
        document.getElementById(players[i].name + "-cup").classList.add("hold");
        document.getElementById(players[i].name + "-cup").classList.remove("drop");
    }
    
    if (betD === 1) {
        console.log("aces");
        if (a >= betN / 2) {
            instructions_header.innerText = `${players[turn].name} called DUDO! There are ${a} aces. \n${players[turn].name} was wrong, they lose a dice`;
            players[turn].noOfDice--;
            players[turn].dice.pop();
            players[turn].diceImg[0].classList.add("byebye");
            setTimeout(() => {players[turn].diceImg[0].style.display = "none";}, 1000);
        } else {
            instructions_header.innerText = `${players[turn].name} called DUDO! There are ${a} aces. \n${players[turn].name} was right, ${players[culprit].name} loses a dice`;
            players[culprit].noOfDice--;
            players[culprit].dice.pop();
            players[culprit].diceImg[0].classList.add("byebye");
            setTimeout(() => {players[culprit].diceImg[0].style.display = "none";}, 1000);
        }
    } else if (palificoR) {
        if (d >= betN) {
            instructions_header.innerText = `${players[turn].name} called DUDO! There are ${a} ${betD}. \n${players[turn].name} was wrong, they lose a dice`;
            players[turn].noOfDice--;
            players[turn].dice.pop();
            players[turn].diceImg[0].classList.add("byebye");
            setTimeout(() => {players[turn].diceImg[0].style.display = "none";}, 1000);
        } else {
            instructions_header.innerText = `${players[turn].name} called DUDO! There are ${a} ${betD}. \n${players[turn].name} was right, ${players[culprit].name} loses a dice`;
            players[culprit].noOfDice--;
            players[culprit].dice.pop();
            players[culprit].diceImg[0].classList.add("byebye");
            setTimeout(() => {players[culprit].diceImg[0].style.display = "none";}, 1000);
        }
        palificoR = false;
    } else {
        console.log("not aces");
        if (a + d >= betN) {
            instructions_header.innerText = `${players[turn].name} called DUDO! There are ${d} ${betD}s and ${a} aces. \n${players[turn].name} was wrong, they lose a dice`;
            players[turn].noOfDice--;
            players[turn].dice.pop();
            players[turn].diceImg[0].classList.add("byebye");
            setTimeout(() => {players[turn].diceImg[0].style.display = "none";}, 1000);
        } else {
            instructions_header.innerText = `${players[turn].name} called DUDO! There are ${d} ${betD}s and ${a} aces. \n${players[turn].name} was right, ${players[culprit].name} loses a dice`;
            players[culprit].noOfDice--;
            players[culprit].dice.pop();
            players[culprit].diceImg[0].classList.add("byebye");
            setTimeout(() => {players[culprit].diceImg[0].style.display = "none";}, 1000);
        }
    } 
    checkRemainingPlayers();
}
function playerBet(n, aces) {
    betN = n;
    if (aces) {
        betN *= 2;
    }
    console.log(betN);

    document.getElementById("Blue-cup").classList.add("drop");
    document.getElementById("Blue-cup").classList.remove("lift");
    document.getElementById("Blue-cup").classList.remove("hold");
    if (betD > 1) {
        document.getElementById("bet-Blue").innerText = `${betN} ${betD}s`;
    } else {
        document.getElementById("bet-Blue").innerText = `${(betN / 2)} aces`;
    }
    button.style.display = "block";
}

function isLikely(dice, numOf) {
    const numOfPlayers = players.length;
    let likelyNum =  totalDice / numOfPlayers;
    likelyNum += players[turn].freq[dice - 1];
    likelyNum += players[turn].freq[0] + (totalDice / 6);
    if (numOf <= likelyNum) {
        return true;
    } else {
        return false;
    }
}
function showUserInput() {
    dudo_button.style.display = "block";
    bet_button.style.display = "block";
    button.style.display = "none";
}
function showUserBetOptions() {
    die_buttons.style.display = "block";
}
function checkRemainingPlayers() {
    if (players[0].dice.length === 0) {
        instructions_header.innerText = "You have lost all of your dice, you lose";
        button.style.display = "none";
        newGame_button.style.display = "block";
    } else {
        console.log("players length: " + players.length);
        for (let i = 1; i < players.length; i++) {
            if (players[i].dice.length === 0) {
                instructions_header.innerText = players[i].name + " has lost their last dice, they are out of the game";
                
                document.querySelector(player[i].name).classList.add('.byebye');
                setTimeout(() => {document.getElementById(players[i].name).style.display = "none";}, 1000);
                players.splice(i, 1);

            } 
        }
    }
}
function hideUserInput() {
    dudo_button.style.display = "none";
    bet_button.style.display = "none";
    button.style.display = "block";
}
function nextTurn(i) {
    if (i === 0) {
        instructions_header.innerText = "Your turn";
        showUserInput();
        document.getElementById("Blue-cup").classList.add("lift");
        setTimeout(() => {document.getElementById("Blue-cup").classList.add("hold");}, 999);

        return 1;
    } else {
        hideUserInput();
        document.getElementById("Blue-cup").classList.remove("drop"); 
        instructions_header.innerText = players[i].name + "'s turn";
        button.innerText = "Next turn";
        compBet();
        if (i === players.length - 1) {
            return 0;
        } else {
            return i + 1;;
        }
    }
}
function randomiseDice() {
    for (let i = 0; i < players.length; i++) {
        let tempArr = [];
        for (let j = 0; j < players[i].noOfDice; j++) {
            tempArr[j] = Math.floor(Math.random() * 6) + 1;
        }
        players[i].dice = tempArr;
        players[i].freq = [0, 0, 0, 0, 0 ,0];
        for (let j = 0; j < players[i].noOfDice; j++) {
            switch (players[i].dice[j]) {
                case 1:
                    players[i].freq[0]++;
                    break;
                case 2:
                    players[i].freq[1]++;
                    break;
                case 3:
                    players[i].freq[2]++;
                    break;
                case 4:
                    players[i].freq[3]++;
                    break;
                case 5:
                    players[i].freq[4]++;
                    break;
                case 6:
                    players[i].freq[5]++;
                    break;
            }
        }
    }
    generatePlayerDice();
}
function generatePlayerDice()  {
    for (let i = 0; i < players.length; i++) {
        players[i].diceImg.splice(0, players[i].diceImg.length);
        document.getElementById(players[i].name + "-dice").innerHTML = "";
        for (let j = 0; j < players[i].dice.length; j++) {
            const t = players[i].name + "-dice-" + j;
            players[i].diceImg[j] = document.createElement("img");
            players[i].diceImg[j].src = diceArr[players[i].dice[j] - 1];
            players[i].diceImg[j].style.border = "2px solid black";
            players[i].diceImg[j].style.borderRadius = "10%";
            players[i].diceImg[j].style.maxWidth = "9%"; 
            document.getElementById(players[i].name + "-dice").appendChild(players[i].diceImg[j]);
        }
    }
}
function generateUserBetBtns(n, aces) {
    for (let i = 0; i < 3; i++) {
        betButtons[i] = document.createElement("span");
        betButtons[i].classList.add("btn");
        betButtons[i].innerText = n + i;
        betButtons[i].addEventListener('click', () => {
            playerBet(n + i, aces);
            bet_btns.innerHTML = "";
        });
        bet_btns.appendChild(betButtons[i]);
    }
}
function checkPalifico() {
    for (let i = 0; i < players.length; i++) {
        if (players[i].dice.length === 1 && players[i].palifico) {
            instructions_header.innerText = `${players[i].name} is Palifico`;
            palificoR = true;
            players[i].palifico = false;
            palificoPlayer = i;
            return true;
        }
    }
    return false;
}
function dicePressed(dice) {
    console.log(dice);
    let n = betN;
    if (dice <= betD) {
        n++;
    }
    if (betN === 0) {
        n++;
    }
    if (dice === 1) {
        if (Number.isInteger(n / 2) === false) {
            n++;
        } 
        n = n / 2;
        generateUserBetBtns(n, true);
    } else {
        generateUserBetBtns(n, false);
    }
    betD = dice;
}
function generateDiceButtons() {
    for (let i = 0; i < 6; i++) {
        dieButton[i] = document.createElement("img");
        dieButton[i].src = diceArr[i];
        dieButton[i].classList.add("dice");
        dieButton[i].addEventListener('click', () => {
            dicePressed(i + 1);
            die_buttons.innerHTML = "";
            console.log(i+1);
        });
        die_buttons.appendChild(dieButton[i]);
    }
}
button.addEventListener('click', () => {
    console.log("click");
    if (newGame) {
        for (let i = 0; i < players.length; i++) {
            document.getElementById(players[i].name + "-cup").classList.remove("lift");
            document.getElementById(players[i].name + "-cup").classList.remove("hold");
        }
        document.querySelector('.flexbox').classList.add('shake');
        diceRoll.play();
        setTimeout(() => {newRound();}, 1700);
        newGame = false;
    } else {
        turn = nextTurn(turn);
        document.querySelector('.flexbox').classList.remove('shake');
    }
});
dudo_button.addEventListener('click', () => {
    turn = 0;
    button.innerText = "Roll Dice";
    hideUserInput();
    dudo(players.length - 1);
    newGame = true;
    totalDice--;
    betD = 0;
    betN = 1;
});
bet_button.addEventListener('click', () => {
    document.querySelector('.flexbox').classList.remove('shake');
    if (palificoR === false || palificoPlayer === 0) {
        generateDiceButtons();
        instructions_header.innerText = "Pick a dice to bet on";
    } else if (palificoPlayer > 0 && palificoR) {
        dicePressed(betD);
        instructions_header.innerText = "Palifico round - dice cannot be changed"
    }
    bet_button.style.display = "none";
    dudo_button.style.display = "none";
});
newGame_button.addEventListener('click', () => {
    newGame = true;
    players.splice(0, players.length);
    players = [new Player("Blue"), new Player("Green"), new Player("Pink"), new Player("Red")];
    totalDice = 20;
    palificoPlayer = 0;
    turn = 0;
    newGame = true;
    betD = 0;
    betN = 0;
    aces = false;
    palificoR = false;
    for (let i = 0; i < players.length; i++) {
        document.getElementById(players[i].name).style.display = "block";
    }
    hideUserInput();
    newGame_button.style.display = "none";
    instructions_header.innerText = "Click start to begin";
});
htp_btn.addEventListener('click', () => {
    window.open('howToPlay.html');
});