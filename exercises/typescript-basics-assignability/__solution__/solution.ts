// @ts-check
type Form = {
  age: {
    value: number
    validator: (val: number) => boolean
  }
  name: {
    value: string
    validator: (val: string) => boolean
  }
}

const form: Form = {
  age: {
    value: 42,
    validator: (val: number) => val < 18,
  },
  name: {
    value: 'Hexlet',
    validator: (val: string) => val.length > 0,
  },
}

export default form
