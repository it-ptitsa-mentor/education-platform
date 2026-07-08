export namespace Company {
  export const isEmployeeEmail = (email: string, domain: string): boolean => {
    return email.endsWith('@' + domain);
  };
}
