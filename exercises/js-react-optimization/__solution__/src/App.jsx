// @ts-check

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// BEGIN (write your solution here)
const factorial = (n) => (n <= 0 ? 1 : n * factorial(n - 1))

const App = () => {
  const { t, i18n } = useTranslation()
  const [value, setValue] = useState(0)

  const getClassName = (lang) => (
    i18n.language === lang ? 'btn btn-primary' : 'btn btn-outline-primary'
  )

  return (
    <div className="App">
      <div className="btn-group mb-3" role="group">
        <button type="button" className={getClassName('en')} onClick={() => i18n.changeLanguage('en')}>
          {t('languages.en')}
        </button>
        <button type="button" className={getClassName('ru')} onClick={() => i18n.changeLanguage('ru')}>
          {t('languages.ru')}
        </button>
      </div>
      <br />
      <div className="btn-group mb-3" role="group">
        {[1, 5, 10, 20].map((n) => (
          <button key={n} type="button" className="btn btn-outline-primary" onClick={() => setValue(n)}>
            {`${t('factorial')} ${n}`}
          </button>
        ))}
      </div>
      <div>{`Factorial of ${value} is ${factorial(value)}`}</div>
    </div>
  )
}
// END

export default App
