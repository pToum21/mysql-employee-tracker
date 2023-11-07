const inquirer = require('inquirer')
const fs = require('fs')


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
            switch(answers.tableChoice) {
                case 'view all departments':
                    return //add function for view all departments

            }
        })

        
}





