const process = require('process');
const { DocumentStore } = require('ravendb');

process.on('SIGINT', function() {
  console.log("Bye bye");
  process.exit();
});

const urlsEnvVal = process.env["RAVEN_URLS"];
if (!urlsEnvVal) {
  throw new Error("Missing RAVEN_URLS environment variable.");
}

const ravenUrls = urlsEnvVal.split(',')
const store = new DocumentStore(ravenUrls, 'database');

store.initialize();

async function main() {
  while (true) {
    const session = store.openSession();
    await delay(100); 
    const id = (Math.random() * 1000).toString();
    session.store({ value: Math.random() }, id);
    session.saveChanges();

    //const docs = await session.advanced.rawQuery('from @all_docs').all();
    //console.log(docs.length);

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
