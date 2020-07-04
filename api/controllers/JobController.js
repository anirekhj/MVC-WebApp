let mysqlssh = require('mysql-ssh');

const user = ''      // timberlea username
const pass = ''      // timberlea password
const banner = ''    // banner id in the format B00XXXXXX

const connectionInfo = [{
    host: 'timberlea.cs.dal.ca',
    user: user,
    password: pass
},
{
    host: 'db.cs.dal.ca',
    user: user,
    password: banner,
    database: user
}]

let con = mysqlssh.connect(
    connectionInfo[0], connectionInfo[1]
)

function generateResponse952(err, results) {
    if (err && err.errno === 1062) {
        return [409, 'The job already exists.']
    }
    if (err && err.errno === 1644) {
        return [400, err.sqlMessage]
    }
    if (results === undefined || results.length == 0) {
        return [404, 'No jobs found.']
    }
    if (results.info) {
        if (results.info === "Rows matched: 0  Changed: 0  Warnings: 0") {
            return [404, 'No such job exists.']
        }
        else if (results.info === "Rows matched: 1  Changed: 0  Warnings: 0") {
            return [409, 'Job already has given quantity.']
        }
        else if (results.info === "Rows matched: 1  Changed: 1  Warnings: 0") {
            return [200, 'Job quantity successfully updated.']
        }
    }
    if (!results.info && results.affectedRows === 1) {
        return [200, 'Added a new Job successfully.']
    }
    return [200, results]
}

// landing page
// app.get('/', (req, res) => {
//     let sql = 'show tables;'
//     con.then(client => {
//         client.query(sql, (err, results, fields) => {
//             [stat, data] = generateResponse952(err, results);
//             res.status(stat).send(data);
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     });
// });

module.exports = {
    // get all jobs
    jobs952: function (req, res) {
        let sql = 'SELECT * FROM `Jobs`'
        con.then(client => {
            client.query(sql, (err, results, fields) => {
                [stat, data] = generateResponse952(err, results);
                // res.status(stat).send(data);
                stat === 200? res.view('pages/viewJobs', data) : res.view('pages/Error', stat, data);
            })
        })
        .catch(err => {
            console.log(err)
        });
    },

     // get a specific job
    specific_job952: function (req, res) {
        let sql = 'SELECT * FROM `Jobs` WHERE JobName = "' + req.body.jobID + '" AND PartID = ' + req.body.partID;
        con.then(client => {
            client.query(sql, (err, results, fields) => {
                [stat, data] = generateResponse952(err, results);
                console.log(data)
                stat === 200? res.view('pages/viewJobs', data) : res.view('pages/Error', stat, data);
            })
        })
        .catch(err => {
            console.log(err)
        });
    },

    // post a job
    add_job952: function (req, res) {
        let sql = 'INSERT INTO `ajain`.`Jobs`(`JobName`,`PartID`,`Quantity`)VALUES("' + req.body.jobID + '",' + req.body.partID + ',' + req.body.quantity + ')'
        con.then(client => {
            client.query(sql, (err, results, fields) => {
                [stat, data] = generateResponse952(err, results);
                stat === 200? res.redirect("/jobs952") : res.view('pages/Error', stat, data);
            })
        })
        .catch(err => {
            console.log(err)
        });
    },

    // update a job quantity
    update_job952: function (req, res) {
        console.log("Wefbwiuwgbiwebfuwoekf")
        let sql = 'UPDATE `ajain`.`Jobs` SET `Quantity` = ' + req.body.quantity + ' WHERE `JobName` = "' + req.body.jobID + '" AND `PartID` = ' + req.body.partID
        con.then(client => {
            client.query(sql, (err, results, fields) => {
                [stat, data] = generateResponse952(err, results);
                stat === 200? res.redirect("/jobs952") : res.view('pages/Error', stat, data);
            })
        })
        .catch(err => {
            console.log(err)
        });
    },
}