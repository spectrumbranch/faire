const Faire = require('../lib');

Faire.Config = require('../config/config');

Faire.Email.init(Faire.Config.email);


return Faire.Email.sendMessage({
    to: Faire.Config.email.test_to_email,
    subject: 'test subject',
    body: 'test message'
  },
  function(mailErr, response) {
    console.log(mailErr || response);
    return process.exit();
  }
);