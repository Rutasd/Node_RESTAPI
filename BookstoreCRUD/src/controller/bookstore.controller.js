/**
 * Ruta Deshpande
 * Andrew id - rutasurd
 * A1
 * Customer endpoints
 */

var dbConn  = require('../../config/db.config');

/**
 * Retrieves a book from the system by ISBN and returns its data as a JSON response.
 *
 * req - The HTTP request object containing the ISBN of the book to retrieve.
 * res - The HTTP response object that will contain the JSON response.
 * endpoint - {baseurl}/books/isbn
 * get request
 */
exports.retrieveBook = (req, res) => {
    const isbn = req.params.ISBN;
    dbConn.query('SELECT * FROM books WHERE ISBN = ?', isbn, (err, result) => {
      if (err) {
        console.log('Error while retrieving book', err);
         console.log(result)
        res.status(500).send('Internal Server Error');
      } else if (result.length == 0) {
        console.log(result)
        console.log('Book not found');
        res.status(404).json({ message: 'Book not found.' });
      } else {
        console.log(result)
        res.status(200).json(result[0]);
      }
    });
  };
  
  
/**
 * Adds a book to the system with the specified information, if the ISBN is not already in use.
 *
 * req - The HTTP request object containing the book information to add.
 * res - The HTTP response object that will contain the response message and/or data.
 * endpoint - {baseurl}/books
 * post request
 */
  exports.addBook = (req, res) => {
    const data = req.body;
  
    if (!data.ISBN || !data.title || !data.Author || !data.description || !data.genre || !data.price || !data.quantity) {
      res.status(400).json({ message: 'Missing required fields' });
      console.log('Inside required fields check for add');
      return;
    }
    dbConn.query('SELECT * FROM books WHERE ISBN = ?', data.ISBN, (err, result) => {
      if (err) {
        console.log('Error while adding book', err);
      } else if (result.length > 0) {
        res.status(422).json({ message: 'This ISBN already exists in the system.' });
        console.log('ISBN exists');
      } else {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        if (!priceRegex.test(data.price)) {
          res.status(400).json({ message: 'Invalid price format' });
          console.log('Inside price format check for add');
          return;
        }
        dbConn.query(
          'INSERT INTO books (ISBN, title, Author, description, genre, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [data.ISBN, data.title, data.Author, data.description, data.genre, data.price, data.quantity,],
          (err, result) => {
            if (err) {
              console.log('Error while adding book', err);
            } else {
              console.log('Book added successfully');
              const newBookURL = req.protocol + '://' + req.get('host') + '/books/' + data.ISBN;
              res.set('Location', newBookURL).status(201).json(data);
            }
          }
        );
      }
    });
  };
  
/**
 * Updates the book to the system with the specified information.
 *
 * req - The HTTP request object containing the book information to update.
 * res - The HTTP response object that will contain the response message and/or data.
 * endpoint - {baseurl}/books/isbn
 * put request
 */
  exports.updateBook = (req, res) => {
    const isbn = req.params.ISBN;
    const data = req.body;
    if (!data.title || !data.Author || !data.description || !data.genre || !data.price || !data.quantity) {
      res.status(400).json({ message: 'Missing required fields' });
      console.log('Inside required fields check for update');
      return;
    }
    dbConn.query('SELECT * FROM books WHERE ISBN = ?', isbn, (err, result) => {
      if (err) {
        console.log('Error while updating book', err);
      } else if (result.length === 0) {
        console.log('ISBN not found in update');
        res.status(404).json({ message: 'ISBN not found' });
      } else {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        if (!priceRegex.test(data.price)) {
          res.status(400).json({ message: 'Invalid price format' });
          console.log('Inside price format check for update');
          return;
        }
        dbConn.query(
          'UPDATE books SET title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?',
          [data.title, data.Author, data.description, data.genre, data.price, data.quantity, isbn, ],
          (err, result) => {
            if (err) {
              console.log('Error while updating book', err);
            } else {
              console.log('Book updated successfully');
              res.status(200).json({ ...data, ISBN: isbn });
            }
          }
        );
      }
    });
  };
  


  
