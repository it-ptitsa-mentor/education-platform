interface FieldConfig<T> {
  value: T;
  validator: (value: T) => boolean;
}

interface Form {
  name: FieldConfig<string>;
  age: FieldConfig<number>;
}

export const form: Form = {
  name: {
    value: 'John',
    validator: (v) => v.length > 0,
  },
  age: {
    value: -5,
    validator: (v) => v > 0,
  },
};
