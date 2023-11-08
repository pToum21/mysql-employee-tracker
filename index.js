const inquirer = require('inquirer')
const db = require('./db/connection')

const utils = require('utils')
db.query = utils.promisify(db.query)

function startApp() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'tableChoice',
                message: 'Choose the Table you would like to view:',
                choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role',
                    'QUIT'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.tableChoice) {
                case 'view all departments':
                    //add function for view all departments;
                    break;
                    










                case "Quit":
                    db.close();

            }
        })


}







module.exports = startApp;
