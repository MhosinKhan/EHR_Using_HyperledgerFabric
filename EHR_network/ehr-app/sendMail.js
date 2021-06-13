var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohsinkhan.mufc@gmail.com',
    pass: 'Mohsin#mufc05'
  }
});

let receiver = 'mhosinkhan51199@gmail.com';
let etext = "Hello";
var mailOptions = {
  from: 'mohsinkhan.mufc@gmail.com',
  to: receiver,
  subject: 'Request Access to View Your EHR',
  text: etext
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
