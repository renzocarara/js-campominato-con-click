// Il computer deve generare 16 numeri casuali tra 1 e 100 (queste saranno le mine).
// In seguito deve chiedere all’utente di inserire un numero alla volta, sempre compreso tra 1 e 100.
// Se il numero è presente nella lista dei numeri generati, la partita termina
// (l'utente ha beccato una mina),
// altrimenti si continua chiedendo all’utente un altro numero.
// La partita termina quando il giocatore inserisce un numero “vietato”
// o raggiunge il numero massimo possibile di numeri consentiti.
// Al termine della partita il software deve comunicare il punteggio,
// cioè il numero di volte che l’utente ha inserito un numero consentito.
// BONUS: all’inizio il software richiede anche una difficoltà all’utente
// che cambia il range di numeri casuali.
// Con difficoltà 0=> tra 1 e 100, con difficoltà 1 =>  tra 1 e 80, con difficoltà 2=> tra 1 e 50
// ------------------------------------------------------------------------------------------------
var fieldSizeMin = 1; // dimensione minima del campo minato, quindi posizione minima selezionabile
var fieldSizeMax = 100; // dimensione massima del campo minato, quindi posizione massima selezionabile
var mineFieldArray = []; // campo minato, array che conterrà elementi che indicano mina presente o non presente
var maxMines = 16; // massimo numero di mine sul campo
var maxAllowedAttempts; // massimo numero di tentativi consentiti all'utente
var attempts = 0; // contatore tentativi effettuati dall'utente
// -----------------------------------------------------------------------------
var isNoMine = 0; // costante, indica mina NON presente
var isMine = 1; // costante, indica mina presente
var isChecked = -1; // costante, indica posizione già verificata dall'utente
// -----------------------------------------------------------------------------
var level = 0; // livello di gioco scelto dall'utente [0=facile 1=medio 2=difficile]
var levelMin = 0;
var levelMax = 2;
// -----------------------------------------------------------------------------
var enable = true; // constante definita per migliorare leggibilità codice
var disable = false; // constante definita per migliorare leggibilità codice

//chiedo all'utente il livello di gioco, controllo la validità
do {
    level = parseInt(prompt("Inserisci il livello di difficoltà da " + levelMin + " [facile] a " + levelMax + " [difficile]"));
}
while (NumNotValid(level, levelMin, levelMax));

fieldSizeMax = setfieldSizeMax(level); // passo il livello a una funzione che mi ritorna la dimensione del campo minato
maxAllowedAttempts = fieldSizeMax - maxMines; // calcolo massimo numero di tentativi consentiti all'utente
mineFieldArray = initMineField(fieldSizeMax, maxMines); // inizializzo il mio campo minato, passo dimensione e numero di mine che conterrà

// DEBUG -- SCOMMENTARE IL FOR QUI SOTTO PER VEDERE IN CONSOLE DOVE SONO LE MINE
// console.log("SITUAZIONE CAMPO MINATO");
// for (var i = 0; i < mineFieldArray.length; i++) {
//     console.log("mineFieldArray[", i, "]", mineFieldArray[i]);
// }

HTMLbuildMineField(mineFieldArray.length); // costruisco il campo minato sulla pagina HTML

HTMLenableDisableClicks(fieldSizeMax, enable); // metto in ascolto JS sul possibile evento "click" sul campo minato

// ---------------------------- FUNCTIONS --------------------------------------
function handleChoice() {

    // UTILIZZO:
    // dal momento in cui mi metto in ascolto dell'evento click sul campo minato,
    // tutto il gioco viene gestito da questa funzione
    // questa funzione viene chiamata ogni volta che c'è da elaborare un click dell'utente sul campo minato
    // analizzo il click, aggiorno il campo minato visualizzato sulla pagina HTML
    // e verifico se la partita è finita e nel caso visualizzo il punteggio finale
    // l'utente può cliccare solo su posizioni che contengono o una mina o sono vuote,
    // le posizioni già verificate vengono rese non più cliccabili

    // NOTA:
    // questa funzione lavora su le seguenti VARIABILI GLOBALI (sigh!):
    // mineFieldArray -- array che contiene tutto il campo minato
    // attempts -- contatore tentativi effettuati dall'utente
    // disable -- valore constante definito per migliorare leggibilità

    var userChoice = -1; // variabile dove inserire l'input dell'utente

    // recupero il riferimento all'elemento su cui è stato fatto il click,
    // "this" mi punta all'elemento cliccato cioè a chi ha chiamato/invocato la funzione HandleChoice()
    userChoice = this.innerHTML; // uso il valore dell'elemento HTML (numero progressivo) come indice per accedere all'array del campo minato

    //controllo se la posizione indicata dall'utente è libera (non c'è una mina)
    if (mineFieldArray[userChoice - 1] == isNoMine) {

        // l'utente ha trovato una posizione libera
        mineFieldArray[userChoice - 1] = isChecked; // segno la posizione nell'array come già verificata
        attempts++; // incremento il contatore tentativi validi effettuati (var globale)

        HTMLupdateMineField(userChoice - 1, isChecked); // aggiorno il campo minato sulla pagina HTML

    } else {
        // l'utente ha trovato una mina

        HTMLupdateMineField(userChoice - 1, isMine); // aggiorno il campo minato sulla pagina HTML

        HTMLenableDisableClicks(fieldSizeMax, disable); // disabilito i clicks su tutto il campo minato (tutti gli span)
    }

    // verifico se è finita la partita
    if ((mineFieldArray[userChoice - 1] == isMine) || (attempts == maxAllowedAttempts)) {
        // il gioco finisce perchè  l'utente ha trovato una mina o perchè il numero massimo di tentativi è stato raggiunto

        // visualizzo punteggio finale su pagina HTML
        HTMLdisplayScore(attempts, maxAllowedAttempts);
    }
}


function setfieldSizeMax(gameLevel) {

    // UTILIZZO:
    // ricevo in input la scelta utente (gamelevel) e in base alla scelta fisso la dimensione del campo minato
    // più piccolo è il campo, più difficle è il gioco [0=facile 1=medio 2=difficile]
    // 0=> dimensione 100, 1 => dimensione 80, 2=> dimensione 50
    // la dimensione è gia preimpostata su 100 [0=facile]

    var size = 100;

    switch (gameLevel) {
        case 1:
            size = 80; // livello medio
            break;
        case 2:
            size = 50; // livello facile
            break;
        default:
            size = 100; // livello di default (preimpostato - facile)
    }
    return size;
}

function initMineField(size, NumOfMines) {

    // UTILIZZO:
    // questa funzione riceve la dimensione del campo minato e il numero di mine da distribuire casualmente
    // il campo minato è un array i cui elemnti varranno inizialmente solo 2 valori possibili:
    // isMine o isNotMine, poi quando l'utente verifica una posizione e non trova una mina,
    // verrà inserito il valore isChecked

    // NOTA: questa funzione usa le variabili globali "isNoMine" e "isMine"

    var insertedMines = 0; // contatore per le mine da inserire sul campo
    var minePosition = 1; // indice che indica la posizione della mina
    var mineField = []; // array inizializzato, da restituire al chiamante

    // preparazione campo minato, isNoMine="nessuna mina", isMine="mina presente"
    // inizializzo campo minato (array) come tutto vuoto (nessuna mina presente)
    for (var i = 0; i < size; i++) {
        mineField[i] = isNoMine; // nessuna mina sul campo
    }

    //genero casualmente le mine e le inserisco sul campo minato (array)
    while (insertedMines < NumOfMines) {

        // genero una posizione casuale tra 0 e size-1 che utilizzero come indice dell'array (campo minato)
        minePosition = generaRandom(0, size - 1);

        // inserisco la mina verificando che non sia già presente
        if (mineField[minePosition] == isNoMine) {
            mineField[minePosition] = isMine; // setto mina presente
            insertedMines++; // incremento contatore mine inserite
        }
    }
    return mineField;
}

function generaRandom(min, max) {

    // UTILIZZO:
    // genera un numero casuale intero tra min e max

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function NumNotValid(choice, min, max) {

    // UTILIZZO:
    // funzione generica, verifica se "choice" sia un numero e se è compreso tra min e max
    // basta una delle 3 condizioni non vera ed il numero non è valido e viene restituito TRUE

    if ((isNaN(choice)) || (choice < min) || (choice > max)) {
        return true; // non è un numero valido
    } else {
        return false; // il numero è valido
    }
}

// ---------------------------- HTML FUNCTIONS ---------------------------------

function HTMLbuildMineField(mineFieldLength) {

    // UTILIZZO:
    // costruisco il campo minato sulla pagina HTML
    // una specie di tabella fatta da righe (5, 8 o 10) ognuna di 10 elementi <span>
    // in ogni casellina scrivo il numero progressivo che la identifica da 1 a mineFieldLength

    for (var i = 0; i < mineFieldLength; i++) {
        document.getElementById("mineFieldContainer").innerHTML += "<span>" + (i + 1) + "</span>";
        if (((i + 1) % 10) == 0) {
            // ogni 10 elementi vado a capo, cioè costruisco righe lunghe 10 elementi <span>
            document.getElementById("mineFieldContainer").innerHTML += "<br>";
        }
    }
}

function HTMLupdateMineField(position, setTo) {

    //UTILIZZO:
    // visualizzo sulla pagina HTML le icone che indicano cosa l'utente ha trovato in quella posizione
    // un "baffo" ad indicare posizione già verificata o una iconcina di una bomba nel caso mina trovata

    // recupero tutti i riferimenti agli elementi con tag <span>
    var spans = document.getElementsByTagName("span");

    if (setTo == isChecked) {
        // setto la posizione come già verificata
        spans[position].setAttribute("class", "checked");
        spans[position].innerHTML = "<i class=\"fas fa-check\"></i><sub>" + (position + 1) + "</sub>";
    } else {
        // setto la posizione come mina trovata
        spans[position].setAttribute("class", "bomb");
        spans[position].innerHTML = "<i class=\"fas fa-bomb\"></i>";
    }
}

function HTMLdisplayScore(score, maxScore) {

    // UTILIZZO:
    // viene chiamata quando la partita è terminata, visualizza il punteggio finale dell'utente

    // rendo visibile il contenitore del punteggio
    document.getElementById("scoreContainer").setAttribute("class", "visible");
    // visualizzo il punteggio massimo realizzabile
    document.getElementById("maxScore").innerHTML = maxScore;
    // visualizzo il punteggio finale dell'utente
    document.getElementById("score").innerHTML = score;
}

function HTMLenableDisableClicks(size, action) {

    // UTILIZZO:
    // attivo/disattivo l'ascolto dei clicks su tutto il campo minato
    // specifico la funzione da richiamare/non richiamare più
    // in ingrsso ricevo la dimensione del campo minato (size), cioè il numero di span di cui è composto
    // il tipo di operazione (action): abilito o disabilito il rilevamento dei clicks

    // NOTA: questa funzione usa la variabile globale "enable"

    var spansList = document.getElementsByTagName("span"); // mi creo la lista degli span presenti sulla pagina HTML

    for (var i = 0; i < size; i++) {
        // ciclo su tutti (size) gli span che compongono il campo minato
        if (action == enable) {
            spansList[i].addEventListener("click", handleChoice, {
                once: true
            }); // passo un oggetto come opzione,
            // con questa opzione il listener verrà automaticamente rimosso dopo che è stato invocato 1 volta
            // in sostanza l'elemento span (sul quale attivo l'evento click) sarà cliccabile sono una volta
            // al click verrà chiamata la funzione handleChoice()
        } else {
            spansList[i].removeEventListener("click", handleChoice); // disabilito la chiamata alla funzione handleChoice()
            spansList[i].style.cursor = "default"; // disabilito il cursore "a manina" su tutto il campo minato

        }
    }
}