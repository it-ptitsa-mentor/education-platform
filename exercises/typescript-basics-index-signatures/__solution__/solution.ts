export interface EmployeeSalary {
  [name: string]: number;
}

export interface SalaryStatistics {
  min: number;
  avg: number;
  max: number;
}

export const buildSalaryStatistics = (employees: EmployeeSalary): SalaryStatistics => {
  const salaries = Object.values(employees);
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const avg = salaries.reduce((sum, s) => sum + s, 0) / salaries.length;
  return { min, max, avg };
};
