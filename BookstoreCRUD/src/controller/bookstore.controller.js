var dbConn  = require('../../config/db.config');

exports.retrieveBook = (req, res) => {
    const isbn = req.params.ISBN;
  
    // Check if the book exists in the system
    dbConn.query('SELECT * FROM books WHERE ISBN = ?', isbn, (err, result) => {
      if (err) {
        console.log('Error while retrieving book', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        // Book not found
        res.status(404).json({ message: 'Book not found.' });
      } else {
        // Book found
        res.status(200).json(result[0]);
      }
    });
  };
  

  
//   // Validate the price field
//   const priceRegex = /^\d+(\.\d{1,2})?$/;
//   if (!priceRegex.test(bookData.price)) {
//     res.status(400).json({ message: 'Invalid price value. Price must be a valid number with 2 decimal places.' });
//     return;
//   }

  
  exports.addBook = (req, res) => {
    //console.log(req);
    const bookData = req.body;
    const isbn = bookData.ISBN;
     // Check if all required fields are present in the request body
    if (!bookData.ISBN || !bookData.title || !bookData.Author || !bookData.description || !bookData.genre || !bookData.price || !bookData.quantity) {
    res.status(400).json({ message: 'Missing required fields in the request body.' });
    return;
    }
    // Check if the ISBN already exists in the system
    dbConn.query('SELECT * FROM books WHERE ISBN = ?', isbn, (err, result) => {
      if (err) {
        console.log('Error while adding book', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length > 0) {
        // ISBN already exists in the system
        res.status(422).json({ message: 'This ISBN already exists in the system.' });
      } else {
        
        // Add the new book to the database
        dbConn.query(
          'INSERT INTO books (ISBN, title, author, description, genre, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            bookData.ISBN,
            bookData.title,
            bookData.Author,
            bookData.description,
            bookData.genre,
            bookData.price,
            bookData.quantity,
          ],
          (err, result) => {
            if (err) {
              console.log('Error while adding book', err);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Book added successfully');
              const newBookURL = `${req.protocol}://${req.get('host')}/books/${isbn}`;
              res.set('Location', newBookURL).status(201).json(bookData);
            }
          }
        );
      }
    });
  };
  
  exports.updateBook = (req, res) => {
    const bookData = req.body;
    const isbn = req.params.ISBN;
    //console.log(bookData);
    // Check if all required fields are present in the request body
    if (!bookData.ISBN || !bookData.title || !bookData.author || !bookData.description || !bookData.genre || !bookData.price || !bookData.quantity) {
      res.status(400).json({ message: 'Missing required fields in the request body.' });
      return;
    }
  
    // Validate the price field
    const price = parseFloat(bookData.price);
    if (isNaN(price) || price <= 0 || Math.floor(price * 100) !== price * 100) {
      res.status(400).json({ message: 'Invalid price value. Price must be a valid number with 2 decimal places.' });
      return;
    }
  
    // Check if the book exists in the system
    dbConn.query('SELECT * FROM books WHERE ISBN = ?', isbn, (err, result) => {
      if (err) {
        console.log('Error while updating book', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        // Book not found
        res.status(404).json({ message: 'Book not found.' });
      } else {
        // Update the book in the database
        dbConn.query(
          'UPDATE books SET title = ?, author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?',
          [
            bookData.title,
            bookData.author,
            bookData.description,
            bookData.genre,
            bookData.price,
            bookData.quantity,
            isbn,
          ],
          (err, result) => {
            if (err) {
              console.log('Error while updating book', err);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Book updated successfully');
              //const updatedBookURL = `${req.protocol}://${req.get('host')}/books/${isbn}`;
              dbConn.query('SELECT * FROM books WHERE ISBN = ?', isbn, (err, result) => {
                if (err) {
                  console.log('Error while retrieving updated book', err);
                  res.status(500).send('Internal Server Error');
                } else {
                  res.status(200).json(result[0]);
                }
              });
            }
          }
        );
      }
    });
  };
  
