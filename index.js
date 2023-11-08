const inquirer = require('inquirer')
const db = require('./config/connection')
require('console.table')
const fs = require('fs')


const utils = require('utils')
db.query = utils.promisify(db.query)





const prompt = () => {
    inquirer
        .prompt(
            [
                {
                    type: 'list',
                    name: 'tableChoice',
                    message: 'Choose the Table you would like to view:',
                    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
                }
            ]
        )
        .then((answers) => {
            switch (answers.tableChoice) {
                case 'view all departments':
                    return //add function for view all departments

            }
        })


}





