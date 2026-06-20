const employees: EmployeeSalary = {
  Ivan: 100,
  John: 50,
  Maria: 150,
};

employees.ironMan = 1000;

buildSalaryStatistics(employees); // { min: 50, max: 1000, avg: 325 }