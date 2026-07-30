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
        } else if (action === 'Consultar saldo') {
            getAccountBalance()
        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Sacar') {
            withdraw()
        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
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
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        })
        
        console.log(chalk.green('A sua conta foi criada com sucesso!'))
        operation()

    })
    .catch(err => (console.log(err)))
}

function deposit() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
            name: 'amount',
            message: 'Quanto você deseja depositar?'
        }
        ])
        .then((answer) => {

            const amount = answer['amount']

            addAmount(accountName, amount)
            return operation()


        })
        .catch(err => (console.log(err)))

    })
    .catch(err => (console.log(err)))
}

function checkAccount(accountName) {

    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Essa conta não existe, informe uma conta válida!'))
        return false
    } else {
        return true
    }
}

function addAmount(accountName, amount) {

    const account = getAccount(accountName)

    if (!amount) {
        console.error(chalk.bgRed.black('Ocorreu um erro, tente novamente!'))
        return deposit()
    }

    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), (err) => {console.log(err)})

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta com sucesso!`))

}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {encoding: 'utf8', flag: 'r'})
    return JSON.parse(accountJSON)

}

function getAccountBalance() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
    
    const accountName = answer['accountName']

    if (!checkAccount(accountName)) {
        return getAccountBalance()
    }
    
    const account = getAccount(accountName)

    console.log(chalk.bgBlue.black(`O saldo da sua conta é de R$${account.balance}`))

    operation()

    })
    .catch(err => console.log(err))
}

function withdraw() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor deseja sacar?'
            }
        ])
        .then((answer) => {

            const amount = answer['amount']

            removeAmmount(accountName,amount)

        })
        .catch(err => console.log(err))


    })
    .catch(err => console.log(err))
    

}

function removeAmmount(accountName,amount) {

    const account = getAccount(accountName)

    if (!amount) {
        console.error(chalk.bgRed.black('Ocorreu um erro, tente novamente!'))
        return withdraw()
    }
    if (account.balance < amount) {
        console.error(chalk.bgRed.black('Valor indisponível!'))
        return withdraw()
    }

    account.balance = parseFloat(account.balance) - parseFloat(amount)
    fs.writeFileSync(`accounts/${accountName}.json`,JSON.stringify(account), (err) => console.log(err))
    console.log(chalk.green(`Saque de R$${amount} realizado com sucesso!`))
    
    operation()
}