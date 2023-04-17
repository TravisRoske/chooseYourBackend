import { deleteAllRows, display } from './displayTableController.js';
// import * as crypto from 'crypto';
// import * as bcrypt from 'bcrypt'

// const { createHash } = require( 'crypto' );
// const bcrypt = require( 'bcrypt' );


const domain = 'http://18.190.58.1:8080' ////////////////Change this

const queryUrl = `${domain}/ts/${db}/query/`;

function setStyles(){
    let db = sessionStorage.getItem("db")
    if(!db) db = "MySQL"
    
    const consoleHeader = document.getElementById("databaseTitle")
    consoleHeader.innerHTML = db
    let styleColor = ""
    switch(db) {
        case "Mongo" :
            styleColor = "#07ab4f"
            break;
        case "Postgres" :
            styleColor = "#2db2ff"
            break;
        case "MySQL" :
            styleColor = "#e48e00"
            break;
    }
    consoleHeader.style.color = styleColor;
    const buttons = document.getElementsByClassName('formButtons');
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = styleColor;
    }
}
setStyles();


let userid = ""
getUserid().then((result) => userid = result)

//Get a userid from the server, trying the saved userid first
function getUserid() {
    const idurl = `${domain}/assignid/`
    let headers = {}
    const currid = localStorage.getItem("userid")

    let prom = new Promise((resolve, reject) => {
        fetch(idurl + currid, {
            method : "GET",
            headers : headers
        })
        .then((response) => {
            return response.json()
        })
        .then((result) => {
            localStorage.setItem("userid", result.userid)
            resolve(result.userid)
        })    
        .catch((err) => {
            console.log(err)
            reject()
        })
    })
    return prom
}



document.getElementById('buttonGet').addEventListener('click', getRecord)
document.getElementById('buttonCreate').addEventListener('click', createRecord)
document.getElementById('buttonUpdate').addEventListener('click', updateRecord)
document.getElementById('buttonDelete').addEventListener('click', deleteRecord)

async function getRecord() {

    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }
    fetch(queryUrl + userid + idString, {
        method: 'GET'
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        deleteAllRows()
        display(result)
    })
}

async function createRecord() {

    const firstNameInput = document.querySelector('#firstname').value;
    const lastNameInput = document.querySelector('#lastname').value;
    const usernameInput = document.querySelector('#username').value;
    let passwordInput = document.querySelector('#password').value;
    passwordInput = encryptPassword(passwordInput)

    fetch(queryUrl + userid, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "firstname": firstNameInput, 
            "lastname":  lastNameInput, 
            "username":  usernameInput,
            "password":  passwordInput
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        display(result)
    })
}

async function updateRecord() {

    const firstNameInput = document.querySelector('#firstname').value;
    const lastNameInput = document.querySelector('#lastname').value;
    const usernameInput = document.querySelector('#username').value;
    let passwordInput = document.querySelector('#password').value;
    passwordInput = encryptPassword(passwordInput)

    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }

    fetch(queryUrl + userid + idString, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "firstname": firstNameInput, 
            "lastname":  lastNameInput, 
            "username":  usernameInput,
            "password":  passwordInput
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        display(result)
    })
}

async function deleteRecord() {

    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }
    fetch(queryUrl + userid + idString, {
        method: 'DELETE'
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        display(result)
    })
}

function encryptPassword(password) {
    let encryption = sessionStorage.getItem("encryption");
    if(!encryption) encryption = "none";


    return password/////////
    // switch(encryption) {
    //     case "none" :
    //         return password;
    //         break;
    //     case "sha256" :
    //         return crypto.createHash('sha256').update(string).digest('hex');
    //         break;
    //     case "bcrypt" :
    //         const rounds = 10
    //         bcrypt.hash(password, rounds, (err, hash) => {
    //         if (err) {
    //             console.error(err)
    //             return
    //         }
    //         })
    //         return bcrypt(password)
    //         break;
    // }
}
