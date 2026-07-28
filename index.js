const chalk = require('chalk') 
const inquirer = require('inquirer')
const fs = require("fs") //core module

operation()

function operation() {

    inquirer.prompt([
        {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: ['Criar conta', 'Consultar saldo','Depositar','Sacar','Sair']
    },

    ]).then((answer) => {

        const action = answer['action']

        if (action === 'Criar conta') {
            createAccount()
        }




    })
    .catch(err => {console.log(err)})

}

function createAccount() {

    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opcôes da sua conta a seguir:'))

}