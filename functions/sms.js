require('dotenv').config()
// require('dotenv').config({ path: '../.env' })
const {
  TWILIO_ACCOUNTSIT,
  TWILIO_AUTH,
  TWILIO_SMS_SENDER,
  TWILIO_SENDER,
  TWILIO_RECEIVER,
} = process.env
const accountSid = TWILIO_ACCOUNTSIT
const authToken = TWILIO_AUTH
const client = require('twilio')(accountSid, authToken)

const whastappTrigger = function (message) {
  client.messages
    .create({
      body: `${message}`,
      from: `${TWILIO_SMS_SENDER}`,
      // from: `whatsapp:${TWILIO_SENDER}`,
      // to: `whatsapp:${TWILIO_RECEIVER}`,
      to: `${TWILIO_RECEIVER}`,
    })
    .then((message) => console.log(message.sid))
    // .done()
}

exports.whastappTrigger = whastappTrigger