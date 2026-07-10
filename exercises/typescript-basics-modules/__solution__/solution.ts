// @ts-check
/* eslint-disable @typescript-eslint/no-namespace */
namespace Company {
  export const isEmployeeEmail = (email: string, domain: string): boolean => {
    const [, emailDomain] = email.split('@')
    return emailDomain === domain
  }
}

type User = {
  email: string
}

function authorize(user: User | null): boolean {
  const companyDomain = 'hexlet.io'

  const email = user?.email ?? ''

  return Company.isEmployeeEmail(email, companyDomain)
}

export default authorize
