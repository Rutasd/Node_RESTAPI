var dbConn  = require('../../config/db.config');

exports.addCustomer = (req, res) => {
    const customerData = req.body;
    console.log(req.body);
    // Check if all required fields are present in the request body
    if (!customerData.userId || !customerData.name || !customerData.phone || !customerData.address || !customerData.city || !customerData.state || !customerData.zipcode) {
      res.status(400).json({ message: 'Missing required fields in the request body.' });
      return;
    }
  
    // Validate the userId field
    const userIdRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userIdRegex.test(customerData.userId)) {
      res.status(400).json({ message: 'Invalid user ID value. User ID must be a valid email address.' });
      return;
    }
  
    // Validate the state field
    const stateRegex = /^[A-Z]{2}$/;
    if (!stateRegex.test(customerData.state)) {
      res.status(400).json({ message: 'Invalid state value. State must be a valid 2-letter US state abbreviation.' });
      return;
    }
  
    // Check if the userId already exists in the system
    dbConn.query('SELECT * FROM customer WHERE userId = ?', customerData.userId, (err, result) => {
      if (err) {
        console.log('Error while adding customer', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length > 0) {
        // userId already exists in the system
        res.status(422).json({ message: 'This user ID already exists in the system.' });
      } else {
        // Add the new customer to the database
        dbConn.query(
          'INSERT INTO customer (userId, name, phone, address, address2, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            customerData.userId,
            customerData.name,
            customerData.phone,
            customerData.address,
            customerData.address2 || null,
            customerData.city,
            customerData.state,
            customerData.zipcode,
          ],
          (err, result) => {
            if (err) {
              console.log('Error while adding customer', err);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Customer added successfully');
              const newCustomerId = result.insertId;
              const newCustomerData = { id: newCustomerId, ...customerData };
              res.status(201).json(newCustomerData);
            }
          }
        );
      }
    });
  };
  
  exports.retrieveCustomerById = (req, res) => {
    const customerId = req.params.id;
  
    // Check if the customer ID is a valid integer
    if (isNaN(customerId)) {
      res.status(400).json({ message: 'Invalid customer ID value. ID must be a valid integer.' });
      return;
    }
  
    // Retrieve the customer from the database using the customer ID
    dbConn.query('SELECT * FROM customer WHERE id = ?', customerId, (err, result) => {
      if (err) {
        console.log('Error while retrieving customer', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        // Customer not found
        res.status(404).json({ message: 'Customer not found.' });
      } else {
        // Customer found
        const customerData = result[0];
        res.status(200).json(customerData);
      }
    });
  };

  
  

  exports.retrieveCustomerByUserId = (req, res) => {
    const customerId = req.query.userId;
    console.log("customer id is - "+customerId);
    // Retrieve the customer from the database using the customer ID
    dbConn.query('SELECT * FROM customer WHERE userId = ?', customerId, (err, result) => {
      if (err) {
        console.log('Error while retrieving customer', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        // Customer not found
        res.status(404).json({ message: 'Customer not found.' });
      } else {
        // Customer found
        const customerData = result[0];
        res.status(200).json(customerData);
      }
    });
  };

  
  