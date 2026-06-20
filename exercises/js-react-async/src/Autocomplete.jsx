const res = await axios.get('/countries', { params: { term: 'al' } });
console.log(res.data); // => ["Albania","Algeria"]