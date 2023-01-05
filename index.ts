#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from "chalk";
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var winingCounter = 0, losingCounter = 0;
var playerName: string = "User";
var systemRandomNumber: number;
async function askName() {
  const answers = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Player';
    },
  });
  playerName = answers.player_name;
}

async function askNumber(attempt: number): Promise<number> {
  const answers = await inquirer
    .prompt([
      {
        type: "input",
        name: "guess",
        message: chalk.yellow(`Guess a number (attempt#${attempt}): `),
        validate: function (input: number) {
          if (isNaN(input)) {
            return 'invalid number';
          } else {
            return true;
          }
        }
      }
    ]);
  return answers.guess as number;
}

async function playNumberGussingGame() {
  let won = false;
  let guess, counter = 1;
  systemRandomNumber = getRandomNumber(1, 100);

  console.log(systemRandomNumber);
  do {
    console.clear();
    guess = await askNumber(counter++);

    if (systemRandomNumber == guess) {
      won = true;
    }
    else {
      won = false;
    }
    const spinner = createSpinner('Checking answer...').start();
    await sleep();
    spinner.stop();

  } while (counter <= 3 && !won);

  if (won) {
    winingCounter++;
    console.log(chalk.green(`Nice guess!`));
  } else {
    losingCounter++;
    console.log(chalk.redBright(`Try Again! Correct was ${systemRandomNumber}`));
  }
}

function printStatistics() {
  console.clear();
  console.log(
    chalk.green(
      `${playerName}! Here are your Statistics:
      ------------------------------------
      Won: ${winingCounter}
      Lose: ${losingCounter}`
    )
  );
}

async function startAgain() {
  await askName();
  do {
    await playNumberGussingGame();
    await sleep();
    printStatistics();
    var again = await inquirer.prompt([
      {
        type: "input",
        name: "restart",
        message: "WANT TO USE CALCULATOR AGAIN (yes | no)? "
      }
    ]);
  } while (again.restart.toLowerCase() == 'y' ||
    again.restart.toLowerCase() == 'yes');
}

startAgain();
