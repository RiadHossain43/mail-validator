const sender = process.env.SYSTEM_EMAIL;
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

function generateMail(type, config) {
  const events = {
    "account-verification": require("./events/accountVerification"),
    "account-recovery": require("./events/accountRecovery"),
  };
  const builder = events[type];
  if (!builder) throw new Error("No event.");
  return builder({ payload: config.payload });
}
const usingSendGrid = async (type, receiver, payload, config) => {
  let generatedMail = await generateMail(type, { payload });
  let mailOptions = {
    from: {
      name: "iMS Systems",
      email: sender,
    },
    to: receiver,
    replyTo: config.replyTo || sender,
    subject: payload.subject || generatedMail.subject,
    html: generatedMail.template,
    trackingSettings: {
      clickTracking: {
        enable: false,
        enableText: false,
      },
      openTracking: {
        enable: true,
      },
    },
    attachments: payload.attachments
      ? payload.attachments.map((attachment) => ({
          ...attachment,
          content: fs.readFileSync(attachment.path).toString("base64"),
        }))
      : [],
  };
  return config.multiple
    ? await sgMail.sendMultiple(mailOptions)
    : await sgMail.send(mailOptions);
};
exports.sendMail = (
  type,
  receiver,
  payload,
  config = {
    multiple: true,
    service: "sendgrid",
    replyTo: null,
  }
) => {
  return usingSendGrid(type, receiver, payload, config);
};
