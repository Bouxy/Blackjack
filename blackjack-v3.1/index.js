// _____________________________________________BASICS
// Déclarer les variables

let player = {
    name: prompt('What is your name ?'),
    chips: 20,
};
do {
    player.chips = parseInt(prompt('How many credits do you want for starting ?'), 10);
} while (isNaN(player.chips) || player.chips < 1);
let cards = [];
let sum = 0;
let hasBlackJack = false;
let bankBlackJack = false;
let hasAssurance = false;
let isAlive = false;
let hasSplit = false;
let inSplit = false;
let message = '';
let bankCards = [];
let splitedCard;
let bankSum;
let bet;
let startRenderd = false;
let questionResponded = true;

// Chercher les élements
let messageEl = document.getElementById('message');
let messageDiv = document.querySelector('.message');

let cardsEl = document.getElementById('player-cards');
let playerEl = document.getElementById('player-name');
let playerChipsEl = document.getElementById('player-chips');
let sumEl;
let bankSumEl;
let newCardEl = document.getElementById('new-card');
let finishEl = document.getElementById('finish');
let bankCardsEl = document.querySelector('.bank-cards');
let startEl = document.getElementById('start-el');
let betEl = document.getElementById('bet-chips');
let betParent = document.querySelector('.bet');
let assuranceEl = document.getElementById('assurance-chips');
let assuranceParent = document.querySelector('.assurance');
let questionEl = document.getElementById('question-el');

playerEl.textContent = player.name;
playerChipsEl.textContent = player.chips;
newCardEl.style.opacity = '0.5';
finishEl.style.opacity = '0.5';
messageEl.style.backgroundColor = 'transparent';

//---------event listener---------------

window.addEventListener('resize', renderStacking);

//_______________________________________Under functions

//-----render functions------

function displayMessage() {
    messageEl.style.transition = 'none';
    messageEl.style.backgroundColor = 'white';
    messageEl.textContent = message;
    const myTimeout = setTimeout(function t() {
        messageEl.style.transition = 'background-color 1s ease';
        messageEl.style.backgroundColor = 'transparent';
    }, 1);
}
function renderButton() {
    if (isAlive === true) {
        newCardEl.style.opacity = '1';
        finishEl.style.opacity = '1';
        startEl.style.opacity = '0.5';
    } else {
        newCardEl.style.opacity = '0.5';
        finishEl.style.opacity = '0.5';
        startEl.style.opacity = '1';
    }

    if (player.chips === 0) {
        startEl.style.opacity = '0.5';
    }
}
function checkAs() {
    if (sum > 21 && cards.includes(11)) {
        let firstAs = cards.indexOf(11);

        cards[firstAs] = 1;
        sum -= 10;
    }
}
function checkBankAs() {
    if (bankSum > 21 && bankCards.includes(11)) {
        let firstAs = bankCards.indexOf(11);

        bankCards[firstAs] = 1;
        bankSum -= 10;
    }
}
function renderPlayerCards() {
    let allPlayerCards = document.querySelectorAll('.p-card');
    for (let i = 0; i < cards.length; i++) {
        let renderd = false;
        if (allPlayerCards.length > 0) {
            if (i === allPlayerCards.length) {
            } else if (allPlayerCards[i].hasAttribute('class')) {
                renderd = true;
            }
        }
        if (renderd === false) {
            let img = document.createElement('img');
            let randomCard;
            let randomFam = Math.floor(Math.random() * 4);
            cardsEl.appendChild(img);
            img.setAttribute('class', 'card p-card');

            if (cards[i] === 1 || cards[i] === 11) {
                randomCard = randomFam + '/' + 1;
            } else if (cards[i] === 10) {
                let randomTen = Math.floor(Math.random() * 4);
                randomCard = randomFam + '/' + (10 + randomTen);
            } else {
                randomCard = randomFam + '/' + cards[i];
            }

            img.setAttribute('src', 'cards/' + randomCard + '.svg');
        }
    }
}
function renderBankCards() {
    if (isAlive === true) {
        for (let i = 0; i < bankCards.length; i++) {
            if (startRenderd === false) {
                for (let ii = 0; ii < 2; ii++) {
                    if (ii === 0) {
                        let img = document.createElement('img');
                        let randomCard;
                        let randomFam = Math.floor(Math.random() * 4);
                        bankCardsEl.appendChild(img);
                        img.setAttribute('class', 'card b-card');
                        if (bankCards[i] === 1 || bankCards[i] === 11) {
                            randomCard = randomFam + '/' + 1;
                            if (player.chips >= bet) {
                                questionEl.setAttribute('data-visible', 'true');
                                message = 'Do you want to pay Insurance ?';
                                displayMessage();
                                questionResponded = false;
                            }
                        } else if (bankCards[i] === 10) {
                            let randomTen = Math.floor(Math.random() * 4);
                            randomCard = randomFam + '/' + (10 + randomTen);
                        } else {
                            randomCard = randomFam + '/' + bankCards[i];
                        }
                        img.setAttribute('src', 'cards/' + randomCard + '.svg');
                    } else {
                        let img = document.createElement('img');
                        bankCardsEl.appendChild(img);
                        img.setAttribute('class', 'card b-card');
                        img.setAttribute('src', 'cards/back.svg');
                    }
                }
                startRenderd = true;
            }
        }
    } else {
        for (let i = 0; i < bankCards.length; i++) {
            if (i === 0) {
                bankCardsEl.removeChild(bankCardsEl.lastChild);
                continue;
            }
            let allBankCards = document.querySelectorAll('.b-card');
            let renderd = false;
            if (allBankCards.length > 0) {
                if (i === allBankCards.length) {
                } else if (allBankCards[i].hasAttribute('class')) {
                    renderd = true;
                }
            }
            if (renderd === false) {
                let img = document.createElement('img');
                let randomCard;
                let tries = 0;
                let randomFam = Math.floor(Math.random() * 4);
                bankCardsEl.appendChild(img);
                img.setAttribute('class', 'card b-card');
                tries += 1;
                if (tries === 2) {
                    randomFam = 0;
                }

                if (bankCards[i] === 1 || bankCards[i] === 11) {
                    randomCard = randomFam + '/' + 1;
                } else if (bankCards[i] === 10) {
                    let randomTen = Math.floor(Math.random() * 4);
                    randomCard = randomFam + '/' + (10 + randomTen);
                } else {
                    randomCard = randomFam + '/' + bankCards[i];
                }

                img.setAttribute('src', 'cards/' + randomCard + '.svg');
            }
        }
    }
}

function renderStacking() {
    // let allPlayerCards = document.querySelectorAll('.p-card');
    // let allBankCards = document.querySelectorAll('.b-card');
    // let container = document.querySelector('.cards-container');
    // let containerWidthString = getComputedStyle(container).width;
    // let containerWidth = parseInt(containerWidthString, 10);
    // let containerHeightString = getComputedStyle(container).height;
    // let containerHeight = parseInt(containerHeightString, 10);
    // let cardWidth = containerHeight / 1.5;
    // if (containerWidth / 2 < (cardWidth + 20) * allPlayerCards.length) {
    //     for (let i = 0; i < allPlayerCards.length; i++) {
    //         allPlayerCards[i].style.marginLeft = '-5rem';
    //     }
    // } else {
    //     for (let i = 0; i < allPlayerCards.length; i++) {
    //         allPlayerCards[i].style.marginLeft = '1rem';
    //     }
    // }
    // if (containerWidth / 2 < (cardWidth + 20) * allBankCards.length) {
    //     for (let i = 0; i < allBankCards.length; i++) {
    //         allBankCards[i].style.marginLeft = '-5rem';
    //     }
    // } else {
    //     for (let i = 0; i < allBankCards.length; i++) {
    //         allBankCards[i].style.marginLeft = '1rem';
    //     }
    // }
}
function renderCards() {
    checkAs();
    checkBankAs();
    renderPlayerCards();
    renderBankCards();
    renderStacking();
}
function renderChips() {
    if (isAlive === true) {
        betEl.setAttribute('data-visible', 'true');
        betParent.firstChild.nodeValue = '';
    } else {
        betEl.setAttribute('data-visible', 'false');
        betParent.firstChild.nodeValue = 'Bet';
    }
    if (hasAssurance === true) {
        assuranceParent.setAttribute('data-visible', 'true');
    } else {
        assuranceParent.setAttribute('data-visible', 'false');
    }
}
function renderGame() {
    renderCards();
    renderChips();

    sumEl = document.getElementById('sum');
    sumEl.textContent = sum;
    bankSumEl = document.getElementById('bank-sum');
    bankSumEl.textContent = '?';

    function continuer() {
        if (questionResponded === true) {
            if (sum <= 20) {
                message = 'Do you want to draw a new card or finish here ?';
            } else if (sum === 21) {
                finish();
            } else {
                finish();
            }
            displayMessage();
            renderButton();
        } else {
            setTimeout(continuer, 500);
        }
    }
    continuer();
}

//------------------Bank new card-------------

function bankNewCard() {
    let bankCard = getBankRandomCard();
    bankSum += bankCard;
    bankCards.push(bankCard);
    checkBankAs();
    renderBankCards();
}

//------------------Randoms-------------------

function getBankRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    if (randomNumber > 10) {
        return 10;
    } else if (randomNumber === 1) {
        if (bankSum < 11) {
            return 11;
        } else {
            return 1;
        }
    } else {
        return randomNumber;
    }
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    if (randomNumber > 10) {
        return 10;
    } else if (randomNumber === 1) {
        if (sum < 11) {
            return 11;
        } else {
            return 1;
        }
    } else {
        return randomNumber;
    }
}

//_______________________________________________________Called functions

//------------------------Main buttons--------------------------

function startGame() {
    if (isAlive === false && player.chips > 0) {
        if (hasSplit === false) {
            do {
                let betBrut = prompt(
                    'How many do you want to bet on this round ?\nMinimum : 1\nMaximum : Your credits'
                );
                if (betBrut === null) {
                    bet = null;
                    break;
                }
                bet = parseInt(betBrut, 10);
            } while (isNaN(bet) || bet < 1);
        } else if (player.chips < bet) {
            bet = player.chips;
        }

        if (bet === null) {
        } else if (bet <= player.chips) {
            while (cardsEl.firstChild) {
                cardsEl.removeChild(cardsEl.lastChild);
            }
            while (bankCardsEl.firstChild) {
                bankCardsEl.removeChild(bankCardsEl.lastChild);
            }
            let createSum = document.createElement('div');
            cardsEl.appendChild(createSum);
            createSum.setAttribute('class', 'sum not-play');
            createSum.setAttribute('id', 'sum');

            let createBankSum = document.createElement('div');
            bankCardsEl.appendChild(createBankSum);
            createBankSum.setAttribute('class', 'sum');
            createBankSum.setAttribute('id', 'bank-sum');

            player.chips -= bet;
            playerChipsEl.textContent = player.chips;
            betEl.textContent = bet;
            isAlive = true;
            startRenderd = false;
            sum = 0;

            let firstCard = getRandomCard();
            if (hasSplit === true) {
                firstCard = splitedCard;
                let img = document.createElement('img');
                cardsEl.appendChild(img);
                img.setAttribute('class', 'p-card card');
                let randomCard;
                if (splitedCard === 1 || splitedCard === 11) {
                    randomCard = 2 + '/' + 1;
                } else {
                    randomCard = 2 + '/' + splitedCard;
                }
                img.setAttribute('src', 'cards/' + randomCard + '.svg');
                hasSplit = false;
                inSplit = true;
            } else {
                inSplit = false;
            }

            let secondCard = getRandomCard();

            sum = firstCard + secondCard;
            //-----Split-----
            if ((firstCard === secondCard || sum === 22) && inSplit === false) {
                hasSplit = true;
                splitedCard = firstCard;
                firstCard = getRandomCard();
                let createSplit = document.createElement('img');
                cardsEl.appendChild(createSplit);
                createSplit.setAttribute('class', 'split card not-play');
                let randomCard;
                if (splitedCard === 1 || splitedCard === 11) {
                    randomCard = 2 + '/' + 1;
                } else {
                    randomCard = 2 + '/' + splitedCard;
                }
                createSplit.setAttribute('src', 'cards/' + randomCard + '.svg');
            }

            //----Split----

            cards = [firstCard, secondCard];

            if (sum === 21 && hasSplit === false) {
                hasBlackJack = true;
            }

            bankSum = 0;
            let bankFirstCard = getBankRandomCard();
            bankSum = bankFirstCard;
            let bankSecondCard = getBankRandomCard();
            bankCards = [bankFirstCard, bankSecondCard];
            bankSum = bankFirstCard + bankSecondCard;

            if (bankSum === 21) {
                bankBlackJack = true;
            }

            renderGame();
        } else {
            message = "You can't bet more than you have !";
            displayMessage();
        }
    }
}

function newCard() {
    if (isAlive === true) {
        let card = getRandomCard();
        sum += card;
        cards.push(card);
        renderGame();
    }
}

function finish() {
    if (isAlive === true) {
        if (hasBlackJack === true) {
            message = 'Blackjack !!! You just won 2.5 times your bet !';
            player.chips += bet * 2.5;
        } else if (bankBlackJack === true) {
            if (hasAssurance === true) {
                if (sum > 21) {
                    player.chips += bet;
                    message = 'You can take your assurance back but not your bet';
                } else {
                    player.chips += bet * 2;
                    message = 'Your assurance saved you, take all your credits back !';
                }
            } else if (bankCards[0] === 11 && player.chips > bet) {
                message = "You should'v taken the assurance !!";
            } else {
                message = 'Unfortunate ! I have Blackjack haha!!';
            }
        } else {
            if (bankSum <= sum && sum < 22) {
                for (; bankSum < 17; ) {
                    bankNewCard();
                }

                if (bankSum < sum || bankSum > 21) {
                    message = 'GG, you won 2 times your bet';
                    player.chips += bet * 2;
                } else if (bankSum === sum) {
                    message = 'Tie! Take your credits back lucky guy';
                    player.chips += bet;
                } else {
                    message = "After picking other cards, I've got more points than you";
                }
            } else if (sum > 21) {
                message = "You've exceeded 21. I will keep your credits";
            } else {
                message = 'I already have more points than you. Your credits are mine';
            }
        }

        isAlive = false;
        hasBlackJack = false;
        bankBlackJack = false;
        hasAssurance = false;
        betEl.textContent = '';
        assuranceEl.textContent = '';
        playerChipsEl.textContent = player.chips;

        renderCards();
        renderChips();

        sumEl.textContent = sum;
        bankSumEl.textContent = bankSum;

        if (player.chips === 0) {
            let a = document.createElement('a');
            messageDiv.appendChild(a);
            a.setAttribute('href', 'https://youtu.be/wgOW5x0J4Lo');
            a.textContent = 'Watch this !';
            a.setAttribute('onclick', 'sellKidney()');
            a.setAttribute('target', 'blank_');
            message = 'No more credits? ';
        }

        displayMessage();
        renderButton();
    }
}

//---------------------------------Specials--------------------

function responded() {
    questionEl.setAttribute('data-visible', 'false');
    questionResponded = true;
    displayMessage();
}
function respondedYes() {
    responded();
    hasAssurance = true;
    player.chips -= bet;
    assuranceEl.textContent = bet;
    playerChipsEl.textContent = player.chips;
    renderChips();
}
function sellKidney() {
    player.chips += 20;
    playerChipsEl.textContent = player.chips;
    renderButton();
    messageDiv.removeChild(messageDiv.lastChild);
    message = 'This time, you will have more luck!';
    displayMessage();
}
