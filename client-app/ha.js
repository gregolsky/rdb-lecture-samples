const { DocumentStore } = require('ravendb');

const store = new DocumentStore([
    'http://localhost:8081', 
    'http://localhost:8082', 
    'http://localhost:8083', 
],
'database');

store.initialize();

async function main() {
  while (true) {
    const session = store.openSession();
    await delay(100); 
    const id = (Math.random() * 1000).toString();
    session.store({ value: Math.random() }, id);
    session.saveChanges();
    console.log('stored ' + id) 
  }
}

async function delay(t, val) {
   return new Promise(function(resolve) {
       setTimeout(function() {
           resolve(val);
       }, t);
   });
}

main().catch(console.error);
