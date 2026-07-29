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
            buildAccount()
        }




    })
    .catch(err => {console.log(err)})

}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opcôes da sua conta a seguir:'))
}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta: '
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        })
        
        console.log(chalk.green('A sua conta foi criada com sucesso!'))
        operation()

    })
    .catch(err => (console.log(err)))
}