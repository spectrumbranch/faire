const Faire = require('../lib');

return Faire.Email.sendMessage({
    to: Faire.Config.config.email.test_to_email,
    from: Faire.Config.config.email.from_email,
    subject: 'test subject',
    body: 'test message'
  },
  function(mailErr, response) {
    console.log(mailErr || response);
    return process.exit();
  }
);