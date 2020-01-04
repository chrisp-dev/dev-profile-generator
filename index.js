const generateHTML = require('./generateHTML');
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const axios = require('axios');

const questions = [
    {
        name: "name",
        type: "input",
        message: "What is your name?"
    },
    {
        type: "list",
        message: "What is your favorite color?",
        name: "color",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
    },
    {
        type: "input",
        name: "location",
        message: "What is your City, State?"
    },
    {
        type: "input",
        name: "github",
        message: "Enter your GitHub Username"
    },
    {
        type: "input",
        name: "linkedin",
        message: "Enter your LinkedIn URL."
    }
];

function promptUser() {
    return inquirer.prompt(questions);
}

const writeFileAsync = util.promisify(fs.writeFile);

function writeToFile(fileName, data) {
    return writeFileAsync(fileName, data);
}

function gitData(username) {
    const queryUrl = `https://api.github.com/users/${username}`;

    return axios.get(queryUrl).then(function (res) {
        return res.data;
    });
}

async function init() {
    console.log('init start');
    try {
        const answers = await promptUser();
        answers.hubdata = await gitData(answers.github);
        const html = generateHTML(answers);

        await writeToFile("profile.html", html);
        console.log('init end');
    } catch (err) {
        console.log(err);
        console.log('init end');
    }
}
init();
