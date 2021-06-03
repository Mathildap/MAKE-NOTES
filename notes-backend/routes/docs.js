var express = require('express');
var router = express.Router();
const cors = require('cors');
const SqlString = require('sqlstring');
router.use(cors());

// CHECK LOGIN
router.post('/', (req, res) => {
  let userName = req.body.userName;
  let passWord = req.body.passWord;

  req.app.locals.con.connect((err) => {
    if (err) {
      console.log(err);
    };

    let sql = `SELECT * FROM users WHERE userName='${userName}'`;

    req.app.locals.con.query(sql, (err, user) => {
      if (err) {
        console.log(err);
      };

      for (i in user) {
        if (passWord == user[i].passWord) {

          res.json(user);
        };
      };
    });
  });
});

// SEND DOCUMENTS TO CLIENT FROM DB
router.get('/start', (req, res) => {
  req.app.locals.con.connect((err) => {
    if (err) {
      console.log(err);
    };

    let sql = `SELECT * FROM documents`;

    req.app.locals.con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      };

      res.json(result);
    });
  });
});

// SEND SELECTED DOCUMENT FROM DB
router.get('/start/:docId', (req, res) => {
  req.app.locals.con.connect((err) => {
    if (err) {
      console.log(err);
    };

    let docId = req.params.docId;

    let sql = `SELECT * FROM documents WHERE docId ="${docId}"`;

    req.app.locals.con.query(sql, (err, result) => {
      for (doc in result) {
        if (docId == result[doc].docId) {

          res.json(result);
        };
      };
    });
  });
});

// GET NEW DOC FROM CLIENT
router.post('/new', (req, res) => {
  req.app.locals.con.connect((err) => {
    let textContent = req.body.textContent;
    let savedTextContent = SqlString.escape(textContent);

    let sql = `INSERT INTO documents (header, textContent, userName) VALUES ('${req.body.header}', ${savedTextContent}, '${req.body.userName}')`;

    req.app.locals.con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      };

      res.json("From server: New document")
    });
  });
});

// UPDATE TEXTCONTENT IN DB
router.post('/edit', (req, res) => {
  req.app.locals.con.connect((err) => {
    if (err) {
      console.log(err);
    };

    let docId = req.body.docId;
    let textContent = req.body.textContent;
    let savedTextContent = SqlString.escape(textContent);

    let sql = `UPDATE documents SET textContent=${savedTextContent} WHERE docId="${docId}"`;

    req.app.locals.con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      };

      let answerSql = `SELECT * FROM documents WHERE docId='${docId}'`;

      req.app.locals.con.query(answerSql, (err, result) => {
        if (err) {
          console.log(err);
        };
        res.json(result);
      });
    });
  });
});

// DELETE DOCUMENT
router.post('/delete', (req, res) => {
  req.app.locals.con.connect((err) => {
    if (err) {
      console.log(err);
    };

    let docId = req.body.docId;
    let sql = `DELETE FROM documents WHERE docId="${docId}"`;

    req.app.locals.con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      };

      res.json("From server: Document deleted");
    });
  });
});

module.exports = router;
