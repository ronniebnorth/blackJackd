const NodeCouchDb = require('node-couchdb');
 
// node-couchdb instance with default options 
const couch = new NodeCouchDb();

couch.listDatabases().then(function(dbs){  
console.log(dbs);  
});


/*

couch.insert("couch-test", {
    _id: "document_id2",
    field: ["sample", "data", true]
}).then(({data, headers, status}) => {
    // data is json response 
    // headers is an object with all response headers 
    // status is statusCode number 
}, err => {
    // either request error occured 
    // ...or err.code=EDOCCONFLICT if document with the same id already exists 
});

*/

couch.update("couch-test", {
    _id: "document_id",
    _rev: "1-75dc400857ebd222e72b3bd5c7cb7895",
    field: "new sample data"
}).then(({data, headers, status}) => {
    // data is json response 
    // headers is an object with all response headers 
    // status is statusCode number 
}, err => {
    // either request error occured 
    // ...or err.code=EFIELDMISSING if either _id or _rev fields are missing
    console.log(err); 
});