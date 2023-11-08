const { prompt } = require("inquirer");
const db = require("./db/connection");
const startApp = require("./index")
require("console.table");

// allow async await:
const utils = require("util");
db.query = utils.promisify(db.query);

async function addRole() {
    const departments = await db.query(
        "SELECT id AS VALUE, name AS role_name FROM department"
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
    await db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?,?,?) ",
        [role_title, role_salary, dept_id]
    );
    console.log("The new role was successfully added!");
    startApp();
}


async function addEmployee() {
    const { first_name, last_name, } = await prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please Enter Your First Name"
        },
        {
            type: "input",
            name: "last_name",
            message: "Please Enter Your Last Name"
        }
    ])
}


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
}








