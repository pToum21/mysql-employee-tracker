// requires
const inquirer = require('inquirer')
const db = require('./db/connection')
require("console.table");
const { prompt } = require("inquirer");

// requiring util allows us to use async await to munipulate the db
const utils = require('util')
db.query = utils.promisify(db.query)

// starts the app and runs the first prompt asking the user what they want to do with the database
function startApp() {
    inquirer

        // all possible choices for the user
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
                    'update employee manager',
                    'view employees by manager',
                    'view employees by department',
                    'delete a department',
                    'delete a role',
                    'delete an Employee',
                    'view the total utilized budget of a department',
                    'QUIT'
                ]
            }
        ])

        // switch statement that runs the function based on the users selection in the prompt above
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

                case 'update employee manager':
                    updateEmployeemanager()
                    break;

                case 'view employees by manager':
                    viewEmployeesByManager()
                    break;

                case 'view employees by department':
                    viewEmployeesByDepartment()
                    break;

                case 'delete a department':
                    deleteDepartment()
                    break;

                case 'delete a role':
                    deleteRole()
                    break;

                case 'delete an Employee':
                    deleteEmployee()
                    break;

                case 'view the total utilized budget of a department':
                    viewBudget()
                    break;

                case 'QUIT':
                    db.close();

            }
        })
}

// function that provides a table of all avaliable departments inside the database
async function viewAllDepartments() {
    try {
        const result = await db.query("select * from department");
        console.table(result)
    } catch (error) {
        console.log(error)
    }
    startApp();
}

// function that provides a table of all avaliable roles inside the database
async function viewAllRoles() {
    try {
        const result = await db.query("select role.id, role.title, role.salary, department.department_name from role left join department on department.id = role.department_id");
        console.table(result)
    } catch (error) {
        console.log(error)
    }
    startApp();
}

// function that provides a table of all avaliable employees inside the database
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

// this function allows you to add a new role to the role table
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

// this function allows the user to add a new employee to the employee table
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

// this function allows the user to add a department to the department table
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

// this function allows the user to update an employees manager
async function updateEmployeemanager() {
    let employees = await db.query(
        "select id as value, concat(first_name, ' ', last_name) as name from employee where manager_id is not null"
    );
    let managers = await db.query(
        "select id as value, concat(first_name, ' ', last_name) as name from employee where manager_id is null"
    );

    const employee = await prompt([
        {
            type: "list",
            name: "employeeChoice",
            message: "Choose the employee you would like to update: ",
            choices: employees
        },
        {

            type: "list",
            name: "managerName",
            message: "Choose the new manager for the selected employee: ",
            choices: managers

        }
    ])
    await db.query(
        "update employee set manager_id = ? where id = ?", [employee.managerName, employee.employeeChoice]
    )
    console.log("The employees manager has been updated!")
    startApp();

}

// this function allows the user to view employees based off their manager
async function viewEmployeesByManager() {
    try {
        const results = await db.query(`
        SELECT
            m.id AS manager_id,
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
            e.id AS employee_id,
            CONCAT(e.first_name, ' ', e.last_name) AS employee_name
        FROM
            employee AS m
        LEFT JOIN
            employee AS e
        ON
            m.id = e.manager_id
        WHERE
            e.manager_id IS NOT NULL
        ORDER BY
            manager_id, employee_id;
    `);

        console.table(results);
        startApp();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// this function allows the user to view employees based off their department
async function viewEmployeesByDepartment() {
    try {
        const results = await db.query(
            `
            SELECT
                d.id AS department_id,
                d.department_name,
                e.id AS employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                r.title AS employee_role
            FROM
                department AS d
            LEFT JOIN
                role AS r
            ON
                d.id = r.department_id
            LEFT JOIN
                employee AS e
            ON
                r.id = e.role_id
            ORDER BY
                department_id, employee_id;
        `
        );

        console.table(results);
        startApp();
    } catch {
        console.error('Error fetching data:', error);
    }
}

// this function allows the user to delete departments from the department table
async function deleteDepartment() {
    const data = await db.query(
        "SELECT id as value, department_name as name FROM department"
    );

    const results = await prompt([
        {
            type: "list",
            name: "departmentName",
            message: "Choose the department you want to delete",
            choices: data,
        },
    ]);

    await db.query("DELETE FROM department WHERE id = ?", [results.departmentName]);

    console.log('The Department has been deleted');
    startApp();
}

// this function allows the user to delete roles from the role table
async function deleteRole() {
    const data = await db.query(
        "SELECT id as value, title as name FROM role"
    );

    const results = await prompt([
        {
            type: "list",
            name: "roleName",
            message: "Choose the role you want to delete",
            choices: data,
        },
    ]);

    await db.query("DELETE FROM role WHERE id = ?", [results.roleName]);

    console.log('The Role has been deleted');
    startApp();
}

// this function allows the user to delete employees from the employee table
async function deleteEmployee() {
    const data = await db.query(
        // "SELECT id as value, title as name FROM role"
        "select id as value, concat(first_name, ' ', last_name) as name from employee"
    );

    const results = await prompt([
        {
            type: "list",
            name: "employeeName",
            message: "Choose the employee you want to delete",
            choices: data,
        },
    ]);

    await db.query("DELETE FROM employee WHERE id = ?", [results.employeeName]);

    console.log('The employee has been deleted');
    startApp();
}

async function viewBudget() {
    try {
        const result = await db.query(
            `
            SELECT
                d.department_name AS department,
                SUM(r.salary) AS total_budget
            FROM
                department AS d
            INNER JOIN
                role AS r
            ON
                d.id = r.department_id
            INNER JOIN
                employee AS e
            ON
                r.id = e.role_id
            GROUP BY
                d.department_name;
        `
        )
        console.table(result);
        startApp();
    } catch {
        console.error('Error fetching data:', error);
    }

}

// calls start app
startApp();

