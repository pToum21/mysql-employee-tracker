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

                case 'view all departments':
                    viewAllDepartments()
                    break;

                case 'view all roles':
                    viewAllRoles()
                    break;

                case 'view all employees':
                    viewAllEmployees()
                    break;

                case 'add a department':
                    addDepartment()
                    break;

                case 'add a role':
                    addRole()
                    break;

                case 'add an employee':
                    addEmployee()
                    break;

                case 'update an employee role':
                    updateEmployee();
                    break;

                case 'QUIT':
                    db.close();

            }
        })
}


async function viewAllDepartments() {
    try {
        const result = await db.query("select * from department");
        console.table(result)
    } catch (error) {
        console.log(error)
    }
    startApp();
}

async function viewAllRoles() {
    try {
        const result = await db.query("select role.id, role.title, role.salary, department.department_name from role left join department on department.id = role.department_id");
        console.table(result)
    } catch (error) {
        console.log(error)
    }
    startApp();
}

async function viewAllEmployees() {
    try {
        const result = await db.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
        AS "last name", role.title, department.department_name AS department, role.salary, 
        concat(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        LEFT JOIN employee manager
        ON manager.id = employee.manager_id`)
        console.table(result)
    } catch (error) {
        console.log(error)
    }
    startApp();
}


async function addRole() {
    const departments = await db.query(
        "select id as value, name as name from department"
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
        "insert into role (title, salary, department_id) values (?,?,?) ",
        [role_title, role_salary, dept_id]
    );
    console.log("The new role was successfully added.");
    startApp();
}


async function addEmployee() {
    let managers = await db.query(
        "select id as value, concat(first_name, ' ', last_name) as name from employee where manager_id is null"
    );
    let roleList = await db.query(
        "select id as value, title as name from role "
    );
    managers = [{ value: null, name: "No Manager" }, ...managers];

    let answers = await prompt([
        {
            type: "input",
            name: "firstName",
            message: "Please Enter Your First Name"
        },
        {
            type: "input",
            name: "lastName",
            message: "Please Enter Your Last Name"
        },
        {
            type: "list",
            name: "role",
            message: "What role does the employee have?",
            choices: roleList
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employees manager?",
            choices: managers
        }

    ])
    await db.query(
        "insert into employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)", [answers.firstName, answers.lastName, answers.role, answers.manager]
    )
    console.log("The Employee has been succesfully added!")
    startApp();
}


async function addDepartment() {
    const department_name = await prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is the name of the department you are trying to add?"
        }
    ])
    await db.query(
        "insert into department (department_name) values (?)",
        [department_name.department_name]
    );
    console.log("The new Department was successfully added!")
    startApp();
}

async function updateEmployee() {
    let employees = await db.query(
        "select id as value, concat(first_name, ' ', last_name) as name from employee"
    );
    let roleList = await db.query(
        "select id as value, title as name from role "
    );

    let answers = await prompt([
        {
            type: "list",
            name: "employeeChoice",
            message: "Choose the employee you would like to update: ",
            choices: employees
        },
        {
            type: "list",
            name: "role",
            message: "What is the employees new role? ",
            choices: roleList
        }
    ])

    await db.query(
        "update employee set role_id = ? where id = ?", [answers.role, answers.employeeChoice]
    )
    console.log("The Employee has been updated!")
    startApp();
}

startApp();

