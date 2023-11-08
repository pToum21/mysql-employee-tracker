const inquirer = require('inquirer')
const db = require('./db/connection')
require("console.table");
const { prompt } = require("inquirer");

const utils = require('util')
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

                // case 'view all departments':
                //     //add function for view all departments;
                //     break;

                case 'add a role':
                    addRole()
                    break;










                // case "Quit":
                //     db.close();

            }
        })


}


async function addRole() {
    const departments = await db.query(
        "SELECT id AS VALUE, name AS name FROM department"
    );
    const { role_title, role_salary, dept_id } = await prompt([
        {
            type: "input",
            name: "role_title",
            message: "Enter the title of the new role.",
        },
        {
            type: "input",
            name: "role_salary",
            message: "Enter the salary of the new role.",
        },
        {
            type: "list",
            name: "dept_id",
            message: "Which department does this role belong to?",
            choices: departments,
        },
    ]);
    console.log(dept_id);
    await db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?,?,?) ",
        [role_title, role_salary, dept_id]
    );
    console.log("The new role was successfully added!");
    startApp();
}


// async function addEmployee() {
//     let managers = await db.query(
//         "SELECT id AS VALUE, CONCAT(first_name, ' ', last_name) AS name FROM employee"
//     );
//     const { first_name, last_name, } = await prompt([
//         {
//             type: "input",
//             name: "first_name",
//             message: "Please Enter Your First Name"
//         },
//         {
//             type: "input",
//             name: "last_name",
//             message: "Please Enter Your Last Name"
//         }
//     ])
// }


async function addDepartment() {
    const { department_title } = await prompt([
        {
            type: "input",
            name: "department_title",
            message: "What is the name of the department you are trying to add?"
        }
    ])
    await db.query(
        "INSERT INTO department (name) VALUES ? ",
        [department_title]
    );
    console.log("The new Department was successfully added!")
    s
}

startApp();

