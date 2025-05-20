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

const databaseEnvVal = process.env["RAVEN_DATABASE"];
if (!databaseEnvVal) {
  throw new Error("Missing RAVEN_DATABASE environment variable.");
}

const ravenUrls = urlsEnvVal.split(',')

const store = new DocumentStore(ravenUrls, databaseEnvVal);
store.initialize();

async function main() {

  while (true) {
    const session = store.openSession();
    await delay(100); 
    const id = (Math.random() * 1000).toString();
    session.store({ value: Math.random() }, id);
    session.saveChanges();

    console.log(new Date().toISOString() + ': stored ' + id) 

    // const docs = await session.advanced.rawQuery('from @all_docs').all();
    // console.log(docs.length);
  }
}

async function delay(t, val) {
   return new Promise(function(resolve) {
       setTimeout(function() {
           resolve(val);
       }, t);
   });
}

main();