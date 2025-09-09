const express = require('express');
const router = express.Router();
const dns = require('dns');
const validator = require('email-validator');
const Email = require('./models/Email');

// small disposable domains list for demo
const disposableDomains = new Set([
  'mailinator.com','10minutemail.com','tempmail.com','dispostable.com'
]);

// helper: check MX records (promise)
function checkMX(domain) {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) return resolve(false);
      resolve(true);
    });
  });
}

router.post('/verify', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  // format check
  const formatOk = validator.validate(email);
  const domain = (email.split('@')[1] || '').toLowerCase();
  const isDisposable = disposableDomains.has(domain);

  let mxOk = null;
  try {
    mxOk = await checkMX(domain);
  } catch (e) {
    mxOk = false;
  }

  const valid = formatOk && mxOk && !isDisposable;
  let reason = [];
  if (!formatOk) reason.push('invalid_format');
  if (!mxOk) reason.push('no_mx');
  if (isDisposable) reason.push('disposable');

  res.json({ email, valid, reason, checks: { formatOk, mxOk, isDisposable } });
});

// send - simulate storing email "sent"
router.post('/send', async (req, res) => {
  const { email, subject, body } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  const e = new Email({ email, subject: subject||'', body: body||'' });
  try {
    await e.save();
    res.json({ ok: true, id: e._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'saving_failed' });
  }
});

// open - mark opened
router.get('/open/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const e = await Email.findById(id);
    if (!e) return res.status(404).json({ error: 'not_found' });
    e.opened = true;
    e.openedAt = new Date();
    await e.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
});

// analytics
router.get('/analytics', async (req, res) => {
  try {
    const total = await Email.countDocuments();
    const opened = await Email.countDocuments({ opened: true });

    // validate each unique email's format (quick)
    const emails = await Email.find({}, 'email');
    let validCount = 0;
    for (const item of emails) {
      if (validator.validate(item.email)) validCount++;
    }

    res.json({
      sentCount: total,
      openCount: opened,
      validCount,
      validPct: total ? (validCount/total*100).toFixed(2) : '0.00',
      openRate: total ? (opened/total*100).toFixed(2) : '0.00'
    });
  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
