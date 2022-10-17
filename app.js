const userScore = document.querySelector('.score:nth-child(1)');
const tieScore = document.querySelector('.score:nth-child(2)');
const cpuScore = document.querySelector('.score:nth-child(3)');

let userMarker;
let cpuMarker;
const tieMarker = 'tie';

const btnXMark = document.querySelector('.marks').firstElementChild;
const btnOMark = document.querySelector('.marks').lastElementChild;
const btnOnePlayer = document.querySelector('.start');
const btnTwoPlayers = document.querySelector('.start:last-child');
const btnTurn = document.querySelector('.btn-turn');
const btnRestart = document.querySelector('.btn-restart');
const btnLeft = document.querySelector('.options').firstElementChild;
const btnRight = document.querySelector('.options').lastElementChild;

const btnCancel = function() {DialogBoxLeftBtn(false)} ;
const btnQuit = function() {DialogBoxLeftBtn(true)};
const btnKeepPlaying = function() {DialogBoxRightBtn(false, false)};
const btnReinitializeScoreBoard = function () {DialogBoxRightBtn(true, false)};
const btnTurnMarkers = function() {DialogBoxRightBtn(true, true)}; 

const settings = document.querySelector('.settings');
const message = document.querySelector('.msg-container');
const msgHeading = document.querySelector('.msg-heading');
const msgContent = document.querySelector('.msg-content');
const gameDisplay = document.querySelector('.game-display');
const allEntries = document.querySelectorAll('.entry');

let availableEntries = Array.from(allEntries);
let display = ['0','0','0','0','0','0','0','0','0'];

let currentPlayer;

const eventForUser = function() { EventListenerForUserAsFirstPlayer() };
const eventForCpu = function() { EventListenerForCpuAsFirstPlayer() };
const eventForTwoPlayers = function() { EventListenerForTwoPlayers() };

btnXMark.addEventListener('click', function(){
    btnOMark.classList.remove('selected');
    btnXMark.classList.add('selected');
});

btnOMark.addEventListener('click', function(){
    btnXMark.classList.remove('selected');
    btnOMark.classList.add('selected');            
});

btnOnePlayer.addEventListener('click', function(){

    if ( Array.from(btnXMark.classList).indexOf('selected') != -1 ) {
        localStorage.userMarker = 'X';
        localStorage.cpuMarker = 'O';                
    } else {
        localStorage.userMarker = 'O';
        localStorage.cpuMarker = 'X'; 
    }

    localStorage.isGameForTwoPlayers = false;

    TurnNaNScoresIntoZero();     
    UpdateMarkers();
    UpdateScoreboard();     
    ClearGameScreen(); 
    
    settings.classList.add('index');        
});

btnTwoPlayers.addEventListener('click', function() {

    if ( Array.from(btnXMark.classList).indexOf('selected') != -1 ) {
        localStorage.userMarker = 'X';
        localStorage.cpuMarker = 'O';                
    } else {
        localStorage.userMarker = 'O';
        localStorage.cpuMarker = 'X'; 
    }

    localStorage.isGameForTwoPlayers = true;

    TurnNaNScoresIntoZero();     
    UpdateMarkers();
    UpdateScoreboard();     
    ClearGameScreen();       
    
    settings.classList.add('index');  

});

btnRestart.addEventListener('click', function() {     
   AreYouSure('restart game?', 'no, cancel', 'yes, restart', false);
});

btnTurn.addEventListener('click', function(){
    AreYouSure('turn markers?', 'no, cancel', 'yes, turn', true);
});

allEntries.forEach( function(entry){
    entry.addEventListener('click', function() { UserPlays(entry); });
} );

if( (localStorage.userMarker != 'X') && (localStorage.userMarker != 'O') ) {    
    ChooseGameSettings();
};

UpdateMarkers();
UpdateScoreboard();

if ( localStorage.isGameForTwoPlayers === 'true' ) {      
    GameSettingsWhenTwoPlayers();    
} else if ( userMarker === 'X' ) {
    GameSettingsWhenUserIsFirstPlayer();    
} else {
    GameSettingsWhenCpuIsFirstPlayer();
}



// FUNCTIONS RELATED TO SETTINGS AND CODE REUSABILITY

function ChooseGameSettings() {  

    settings.classList.remove('index'); 
    
}



function TurnNaNScoresIntoZero() {

    if ( isNaN(localStorage.userScore) ){
        localStorage.userScore = 0;
    }
    
    if ( isNaN(localStorage.tieScore) ){
        localStorage.tieScore = 0;
    }
    
    if ( isNaN(localStorage.cpuScore) ){
        localStorage.cpuScore = 0;
    }       

}



function UpdateMarkers() {

    userMarker = localStorage.userMarker;
    cpuMarker = localStorage.cpuMarker;    

    userScore.classList.add(`${userMarker}-bg-color`);
    userScore.classList.remove(`${cpuMarker}-bg-color`);

    cpuScore.classList.add(`${cpuMarker}-bg-color`);
    cpuScore.classList.remove(`${userMarker}-bg-color`);

    if ( localStorage.isGameForTwoPlayers === 'true' ) {
        userScore.firstElementChild.innerHTML = `${userMarker} (PLAYER 1)`;
        cpuScore.firstElementChild.innerHTML = `${cpuMarker} (PLAYER 2)`; 
    } else {
        userScore.firstElementChild.innerHTML = `${userMarker} (YOU)`;
        cpuScore.firstElementChild.innerHTML = `${cpuMarker} (CPU)`; 
    }
    
    btnTurn.firstElementChild.innerHTML = userMarker;
    btnTurn.lastElementChild.innerHTML = 'turn';

}



function UpdateScoreboard() {

    userScore.lastElementChild.innerHTML = localStorage.userScore;
    tieScore.lastElementChild.innerHTML = localStorage.tieScore;
    cpuScore.lastElementChild.innerHTML = localStorage.cpuScore;

}



function UpdateDisplay(pId, pMarker){
    switch(pId){
        case '11':
            display[0] = pMarker;            
            break;
        case '12':
            display[1] = pMarker;            
            break;
        case '13':
            display[2] = pMarker;            
            break;
        case '21':
            display[3] = pMarker;            
            break;
        case '22':
            display[4] = pMarker;            
            break;
        case '23':
            display[5] = pMarker;            
            break;
        case '31':
            display[6] = pMarker;            
            break;
        case '32':
            display[7] = pMarker;            
            break;
        case '33':
            display[8] = pMarker;                                        
    };
}



function GetRows() {

    let firstRow = display[0] + display[1] + display[2];
    let secondRow = display[3] + display[4] + display[5];
    let thirdRow = display[6] + display[7] + display[8];

    return [firstRow, secondRow, thirdRow]; 
}



function GetColumns() {

    let firstColumn = display[0] + display[3] + display[6];
    let secondColumn = display[1] + display[4] + display[7];
    let thirdColumn = display[2] + display[5] + display[8];

    return [firstColumn, secondColumn, thirdColumn];

}



function GetDiagonals() {

    let mainDiagonal = display[0] + display[4] + display[8];
    let secondaryDiagonal = display[2] + display[4] + display[6];
    
    return [mainDiagonal, secondaryDiagonal];

}



function RestartScores() {

    localStorage.userScore = 0;
    localStorage.tieScore = 0;
    localStorage.cpuScore = 0;

}



function ClearGameScreen(){

    allEntries.forEach(function(entry){
        entry.innerHTML = '';
        entry.classList.remove('no-pointer-events');
    });
    
    display = ['0','0','0','0','0','0','0','0','0'];    
    availableEntries = Array.from(allEntries);  
    
    if ( localStorage.isGameForTwoPlayers === 'true' ) {    
        GameSettingsWhenTwoPlayers();
    } else if ( userMarker === 'X' ) {
        GameSettingsWhenUserIsFirstPlayer();
    } else {
        GameSettingsWhenCpuIsFirstPlayer();
    }

}



function DialogBoxSettings(pHeadingText, pMarker, pMarkerStyleClasses, pContentText, pContentStyleClasses, pBtnLeftText, pBtnRightText) {

    msgHeading.innerHTML = pHeadingText;

    msgContent.firstElementChild.innerHTML = pMarker;
    msgContent.firstElementChild.attributes.class.value = pMarkerStyleClasses;

    msgContent.lastElementChild.innerHTML = pContentText;
    msgContent.lastElementChild.attributes.class.value = pContentStyleClasses;

    btnLeft.innerHTML = pBtnLeftText;
    btnRight.innerHTML = pBtnRightText;

}



function DialogBoxLeftBtn(pQuitGame) {

    if(pQuitGame) {

        btnXMark.classList.add('selected');
        btnOMark.classList.remove('selected');        
        
        RestartScores();
        ChooseGameSettings();            
        
    }

    message.classList.add('opacity', 'index');           

}



function DialogBoxRightBtn(pRestartScoreboard, pTurnMarkers) {

    message.classList.add('opacity', 'index');
        
    if(pRestartScoreboard) {
        RestartScores();
    }    

    if(pTurnMarkers) {
        let auxMarker = userMarker;
        localStorage.userMarker = cpuMarker;
        localStorage.cpuMarker = auxMarker;
        UpdateMarkers();        
    }

    UpdateScoreboard();
    ClearGameScreen(); 

}



function ChangeCurrentPlayer() {

    if ( currentPlayer === 'X' ) {
        currentPlayer = 'O';
    } else {
        currentPlayer = 'X';
    };

}

// FUNCTIONS RELATED TO THE GAME ITSELF

function UserPlays(pEntry) {
    
    pEntry.classList.add('no-pointer-events');

    if ( localStorage.isGameForTwoPlayers === 'true' ) {    
        
        pEntry.innerHTML = `<span class="marker ${currentPlayer}-color"> ${currentPlayer} </span>`;        
        UpdateDisplay(pEntry.attributes.id.value, currentPlayer);                     

    } else {
    
        pEntry.innerHTML = `<span class="marker ${userMarker}-color"> ${userMarker} </span>`;         
        UpdateDisplay(pEntry.attributes.id.value, userMarker);

    };

    let filtered = availableEntries.filter( element => element != pEntry );
    availableEntries = filtered;      

}



function CpuPlays() {     
    
    let rows = GetRows(); 
    let columns = GetColumns();  
    let diagonals = GetDiagonals();

    let dangerInRows = (rows.indexOf(`${userMarker}${userMarker}0`) !== -1) || (rows.indexOf(`${userMarker}0${userMarker}`) !== -1) || (rows.indexOf(`0${userMarker}${userMarker}`) !== -1);
    let dangerInColumns = (columns.indexOf(`${userMarker}${userMarker}0`) !== -1) || (columns.indexOf(`${userMarker}0${userMarker}`) !== -1) || (columns.indexOf(`0${userMarker}${userMarker}`) !== -1);
    let dangerInDiagonals = (diagonals.indexOf(`${userMarker}${userMarker}0`) !== -1) || (diagonals.indexOf(`${userMarker}0${userMarker}`) !== -1) || (diagonals.indexOf(`0${userMarker}${userMarker}`) !== -1); 

    let almostWonInRows = (rows.indexOf(`${cpuMarker}${cpuMarker}0`) !== -1) || (rows.indexOf(`${cpuMarker}0${cpuMarker}`) !== -1) || (rows.indexOf(`0${cpuMarker}${cpuMarker}`) !== -1);
    let almostWonInColumns = (columns.indexOf(`${cpuMarker}${cpuMarker}0`) !== -1) || (columns.indexOf(`${cpuMarker}0${cpuMarker}`) !== -1) || (columns.indexOf(`0${cpuMarker}${cpuMarker}`) !== -1);
    let almostWonInDiagonals = (diagonals.indexOf(`${cpuMarker}${cpuMarker}0`) !== -1) || (diagonals.indexOf(`${cpuMarker}0${cpuMarker}`) !== -1) || (diagonals.indexOf(`0${cpuMarker}${cpuMarker}`) !== -1); 
    

    if ( display[4] === '0' ) {
        CpuPlaysAfterChecking('22');
        return;
    }

    if ( almostWonInDiagonals ) {
        ChooseAppropriateDiagonalEntry(diagonals, cpuMarker);
        return;
    }

    if ( almostWonInRows ) {
        ChooseAppropriateRowEntry(rows, cpuMarker);
        return;
    }

    if ( almostWonInColumns ) {
        ChooseAppropriateColumnEntry(columns, cpuMarker);
        return;
    }    

    if ( dangerInDiagonals ) {
        ChooseAppropriateDiagonalEntry(diagonals, userMarker);
        return;
    }

    if ( dangerInRows ) {
        ChooseAppropriateRowEntry(rows, userMarker);
        return;
    }

    if ( dangerInColumns ) {
        ChooseAppropriateColumnEntry(columns, userMarker);
        return;
    }    

    CpuPlaysRandomly(availableEntries.length);
       
}



function IsGameOver() {
    
    let rows = GetRows(); 
    let columns = GetColumns();  
    let diagonals = GetDiagonals();  

    if ( rows.indexOf('XXX') != -1) {
        switch( rows.indexOf('XXX') ){
            case 0:
                allEntries[0].firstChild.classList.add('X-won-event');
                allEntries[1].firstChild.classList.add('X-won-event');
                allEntries[2].firstChild.classList.add('X-won-event');
                return true;                
            case 1:
                allEntries[3].firstChild.classList.add('X-won-event');
                allEntries[4].firstChild.classList.add('X-won-event');
                allEntries[5].firstChild.classList.add('X-won-event');
                return true;                
            case 2:
                allEntries[6].firstChild.classList.add('X-won-event');
                allEntries[7].firstChild.classList.add('X-won-event');
                allEntries[8].firstChild.classList.add('X-won-event');
                return true;                
        }; 
    } else if ( rows.indexOf('OOO') != -1 ) {
        switch( rows.indexOf('OOO') ){
            case 0:
                allEntries[0].firstChild.classList.add('O-won-event');
                allEntries[1].firstChild.classList.add('O-won-event');
                allEntries[2].firstChild.classList.add('O-won-event');
                return true;                
            case 1:
                allEntries[3].firstChild.classList.add('O-won-event');
                allEntries[4].firstChild.classList.add('O-won-event');
                allEntries[5].firstChild.classList.add('O-won-event');
                return true;                
            case 2:
                allEntries[6].firstChild.classList.add('O-won-event');
                allEntries[7].firstChild.classList.add('O-won-event');
                allEntries[8].firstChild.classList.add('O-won-event');
                return true;                                         
        };
    };
    
    if ( columns.indexOf('XXX') != -1 ) {
        switch( columns.indexOf('XXX') ){
            case 0:
                allEntries[0].firstChild.classList.add('X-won-event');
                allEntries[3].firstChild.classList.add('X-won-event');
                allEntries[6].firstChild.classList.add('X-won-event');
                return true;                
            case 1:
                allEntries[1].firstChild.classList.add('X-won-event');
                allEntries[4].firstChild.classList.add('X-won-event');
                allEntries[7].firstChild.classList.add('X-won-event');
                return true;                
            case 2:
                allEntries[2].firstChild.classList.add('X-won-event');
                allEntries[5].firstChild.classList.add('X-won-event');
                allEntries[8].firstChild.classList.add('X-won-event');
                return true;                                    
        }; 
    } else if ( columns.indexOf('OOO') != -1 ) {
        switch( columns.indexOf('OOO') ){
            case 0:
                allEntries[0].firstChild.classList.add('O-won-event');
                allEntries[3].firstChild.classList.add('O-won-event');
                allEntries[6].firstChild.classList.add('O-won-event');
                return true;                
            case 1:
                allEntries[1].firstChild.classList.add('O-won-event');
                allEntries[4].firstChild.classList.add('O-won-event');
                allEntries[7].firstChild.classList.add('O-won-event');
                return true;                
            case 2:
                allEntries[2].firstChild.classList.add('O-won-event');
                allEntries[5].firstChild.classList.add('O-won-event');
                allEntries[8].firstChild.classList.add('O-won-event');
                return true;                                          
        };
    };

    if (diagonals.indexOf('XXX') != -1) {
        switch( diagonals.indexOf('XXX') ){
            case 0:
                allEntries[0].firstChild.classList.add('X-won-event');
                allEntries[4].firstChild.classList.add('X-won-event');
                allEntries[8].firstChild.classList.add('X-won-event');
                return true;                
            case 1:
                allEntries[2].firstChild.classList.add('X-won-event');
                allEntries[4].firstChild.classList.add('X-won-event');
                allEntries[6].firstChild.classList.add('X-won-event');
                return true;                                                
        }; 
    } else if ( diagonals.indexOf('OOO') != -1 ) {
        switch( diagonals.indexOf('OOO') ){
            case 0:
                allEntries[0].firstChild.classList.add('O-won-event');
                allEntries[4].firstChild.classList.add('O-won-event');
                allEntries[8].firstChild.classList.add('O-won-event');
                return true;                
            case 1:
                allEntries[2].firstChild.classList.add('O-won-event');
                allEntries[4].firstChild.classList.add('O-won-event');
                allEntries[6].firstChild.classList.add('O-won-event');
                return true;                                     
        };
    };

    return false;
}



function ShowMessage(pHeadingText, pMarker) {   

    if (pMarker !== tieMarker) {
        DialogBoxSettings(pHeadingText, `${pMarker}`, `winner-symbol ${pMarker}-color`, 'takes the round', `${pMarker}-color`, 'quit', 'next round');        
    } else {   
        DialogBoxSettings(pHeadingText, '', '', 'it is a tie', 'special-styling', 'quit', 'next round');     
    }
    
    btnLeft.removeEventListener('click', btnCancel);
    btnLeft.addEventListener('click', btnQuit);

    btnRight.removeEventListener('click', btnReinitializeScoreBoard);
    btnRight.removeEventListener('click', btnTurnMarkers); 
    btnRight.addEventListener('click', btnKeepPlaying);

    message.classList.remove('index', 'opacity');       
    
}



function AreYouSure(pQuestion, pFirstOption, pSecondOption, pTurnMarkers) {      

    DialogBoxSettings('', '', '', pQuestion, 'special-styling', pFirstOption, pSecondOption);
    
    btnLeft.removeEventListener('click', btnQuit);
    btnLeft.addEventListener('click', btnCancel);

    btnRight.removeEventListener('click', btnKeepPlaying);
    if(pTurnMarkers) {
        btnRight.removeEventListener('click', btnReinitializeScoreBoard);
        btnRight.addEventListener('click', btnTurnMarkers);    
    } else {
        btnRight.removeEventListener('click', btnTurnMarkers);
        btnRight.addEventListener('click', btnReinitializeScoreBoard);    
    }  
   
    message.classList.remove('index', 'opacity'); 

}



// FUNCTIONS THAT ADD SOME DIFFICULT TO THE GAME

 function ChooseAppropriateRowEntry(pRowsArr, pMarker) {

    pRowsArr.every(function(line){        

        switch(line){            

            case `${pMarker}${pMarker}0`:
                
                CpuPlaysAfterChecking(`${pRowsArr.indexOf(line) + 1}3`);                                                  
                return false;                

            case `${pMarker}0${pMarker}`:
                
                CpuPlaysAfterChecking(`${pRowsArr.indexOf(line) + 1}2`);
                return false;                

            case `0${pMarker}${pMarker}`:
                
                CpuPlaysAfterChecking(`${pRowsArr.indexOf(line) + 1}1`);                                 
                return false;

        }         
        
        return true;        

    });    
    
 }



 function ChooseAppropriateColumnEntry(pColumnsArr, pMarker) {
      
    pColumnsArr.every(function(column){        

        switch(column){            

            case `${pMarker}${pMarker}0`:
                
                CpuPlaysAfterChecking(`3${pColumnsArr.indexOf(column) + 1}`);                                               
                return false;                

            case `${pMarker}0${pMarker}`:
                
                CpuPlaysAfterChecking(`2${pColumnsArr.indexOf(column) + 1}`);                                                                 
                return false;                

            case `0${pMarker}${pMarker}`:
                
                CpuPlaysAfterChecking(`1${pColumnsArr.indexOf(column) + 1}`);                                 
                return false;

        }         
        
        return true;        

    });  
    
 }



 function ChooseAppropriateDiagonalEntry(pDiagonalsArr, pMarker) {    

    pDiagonalsArr.every(function(diagonal){        

        switch(diagonal){            

            case `${pMarker}${pMarker}0`:
                
                CpuPlaysAfterChecking(`3${pDiagonalsArr.indexOf(diagonal)*(-2) + 3}`);                                                    
                return false;                

            case `${pMarker}0${pMarker}`:
                                
                CpuPlaysAfterChecking(`22`);                                                                   
                return false;                

            case `0${pMarker}${pMarker}`:
                
                CpuPlaysAfterChecking(`1${pDiagonalsArr.indexOf(diagonal)*2 + 1}`);                                 
                return false;

        }         
        
        return true;        

    });    
    
 }



 function CpuPlaysAfterChecking(pId) {

    let aux;
    
    availableEntries.every( function(entry) {

        if (entry.attributes.id.value == pId) {
            aux = availableEntries.indexOf(entry);
            return false;
        }

        return true;

    });

    availableEntries[aux].classList.add('no-pointer-events');
    availableEntries[aux].innerHTML = `<span class="marker ${cpuMarker}-color"> ${cpuMarker} </span>`;
    UpdateDisplay(pId, cpuMarker);    
                
    availableEntries.splice(aux, 1);    

 }



 function CpuPlaysRandomly(arrayLength) {

    let cpuChoice = Math.floor((Math.random()*arrayLength));    
    
    availableEntries[cpuChoice].classList.add('no-pointer-events');
    availableEntries[cpuChoice].innerHTML = `<span class="marker ${cpuMarker}-color"> ${cpuMarker} </span>`;
    UpdateDisplay(availableEntries[cpuChoice].attributes.id.value, cpuMarker);    

    availableEntries.splice(cpuChoice, 1);     

 }



 // FUNCTIONS THAT MAKE THE GAME START WITH X-MARKER PLAYER

 function GameSettingsWhenUserIsFirstPlayer() {

    allEntries.forEach( function(entry){
        entry.removeEventListener('click', eventForCpu);
       // entry.removeEventListener('click', eventForUser);
      entry.removeEventListener('click', eventForTwoPlayers);
    });
    
    availableEntries.forEach( function(entry){
        entry.addEventListener('click', eventForUser);    
    });       

 }



 function GameSettingsWhenCpuIsFirstPlayer() {

    allEntries.forEach( function(entry){        
        entry.removeEventListener('click', eventForUser);
        entry.removeEventListener('click', eventForTwoPlayers);
  
    });

    CpuPlaysRandomly(availableEntries.length);
    availableEntries.forEach( function(entry){ 
        entry.addEventListener('click', eventForCpu);
    });    

 }



 function GameSettingsWhenTwoPlayers() {

    currentPlayer = 'X';    

    allEntries.forEach( function(entry){
        entry.removeEventListener('click', eventForCpu);
       entry.removeEventListener('click', eventForUser);
      // entry.removeEventListener('click', eventForTwoPlayers);
    });    
    
    availableEntries.forEach( function(entry){        
        entry.addEventListener('click', eventForTwoPlayers);    
    });     

 }



 function EventListenerForUserAsFirstPlayer() {
                       
    if( IsGameOver() ){            
        localStorage.userScore = parseInt(localStorage.userScore) + 1;            
        ShowMessage('You won!', userMarker);                              
    } else if (availableEntries.length === 0) {
        localStorage.tieScore = parseInt(localStorage.tieScore) + 1;
        ShowMessage('Better luck next time...', tieMarker);
    } else {
        CpuPlays();
        if( IsGameOver() ){                
            localStorage.cpuScore = parseInt(localStorage.cpuScore) + 1;
            ShowMessage('Ops, you lost...', cpuMarker);
        }                                  
    };         

 }



function EventListenerForCpuAsFirstPlayer() {           
                   
    if( !IsGameOver() ){
        CpuPlays();        
        if ( IsGameOver() ) {
            localStorage.cpuScore = parseInt(localStorage.cpuScore) + 1;
            ShowMessage('Ops, you lost...', cpuMarker);
            } else if (availableEntries.length === 0 ) {                    
                localStorage.tieScore = parseInt(localStorage.tieScore) + 1;
                ShowMessage('Better luck next time...', tieMarker);
            }                
    } else {
        localStorage.userScore = parseInt(localStorage.userScore) + 1;            
        ShowMessage('You won!', userMarker);                                                             
    };       

 }



 function EventListenerForTwoPlayers() {    

    if ( IsGameOver() ) {           

        if ( currentPlayer === userMarker ) {
            localStorage.userScore = parseInt(localStorage.userScore) + 1;
            ShowMessage('Player 1 won', userMarker);
        } else {
            localStorage.cpuScore = parseInt(localStorage.cpuScore) + 1;
            ShowMessage('Player 2 won', cpuMarker);
        }
            
    } else if ( availableEntries.length === 0 ) {

        localStorage.tieScore = parseInt(localStorage.tieScore) + 1;
        ShowMessage('No winner this time...', tieMarker);

    } else {

        ChangeCurrentPlayer();

    }

}


