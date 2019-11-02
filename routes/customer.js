const fs = require('fs');

module.exports = {
    addCustomerPage: (req, res) => {
        res.render('add-customer.ejs', {
            title: "Welcome to Alex | Add a new Customer"
            ,message: ''
        });
    },
    addCustomer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let checkin_date = req.body.checkin;
        let checkout_date = req.body.checkout;
        let email_id = req.body.emailid;
        let phn_number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `customers` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-Customer.ejs', {
                    message,
                    title: "Welcome to Hotel Alex | Add a new customer"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database                          
                        let query = "INSERT INTO `customers` (first_name, last_name, checkin_date,checkout_date,email_id, phn_number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "','" + checkin_date +"','" + checkout_date +"', '" + email_id + "', '" + phn_number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-customer.ejs', {
                        message,
                        title: "Welcome to Hotel Alex | Add a new customer "
                    });
                }
            }
        });
    },
    editCustomerPage: (req, res) => {
        let customerId = req.params.id;
        let query = "SELECT * FROM `customers` WHERE id = '" + customerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-customer.ejs', {
                title: "Edit  Customer details"
                ,customer: result[0]
                ,message: ''
            });
        });
    },
    editCustomer: (req, res) => {
        let customerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let phn_number = req.body.number;
        let email_id = req.body.emailid;

        let query = "UPDATE `customers` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `email_id` = '" + email_id + "', `phn_number` = '" + phn_number + "' WHERE `customers`.`id` = '" + customerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }
}
