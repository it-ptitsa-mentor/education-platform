// @ts-check

const generateField = () => {
  const tableEl = document.createElement('table')

  tableEl.className = 'table-bordered'
  for (let i = 0; i < 3; i += 1) {
    const row = tableEl.insertRow()
    for (let j = 0; j < 3; j += 1) {
      const cell = row.insertCell()
      cell.className = 'py-2 px-3'
      cell.innerHTML = '<span class="invisible">s</span>'
    }
  }
  return tableEl
}

// BEGIN (write your solution here)

// END
