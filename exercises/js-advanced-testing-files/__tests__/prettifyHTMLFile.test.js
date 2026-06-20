// содержимое до форматирования
// <div><p>hello <b>world</b></p></div>
await prettifyHTMLFile('/path/to/file')

// содержимое после форматирования:
// <div>
//     <p>hello <b>world</b></p>
// </div>