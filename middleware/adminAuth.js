const crypto = require('crypto');

const cookieName = 'student_admin_session';
const sessionDuration = 8 * 60 * 60 * 1000;

function configured(res) {
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) return true;
  res.status(503).send('Admin access is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.');
  return false;
}

function matches(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function signature(expires) {
  return crypto.createHmac('sha256', process.env.ADMIN_PASSWORD)
    .update(`${process.env.ADMIN_USERNAME}:${expires}`)
    .digest('base64url');
}

function validSession(req) {
  const cookie = (req.headers.cookie || '').split('; ')
    .find(part => part.startsWith(`${cookieName}=`));
  if (!cookie) return false;

  const [expires, suppliedSignature] = cookie.slice(cookieName.length + 1).split('.');
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  return matches(suppliedSignature || '', signature(expires));
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin'
  };
}

exports.loginPage = (req, res) => {
  if (!configured(res)) return;
  res.set('Cache-Control', 'no-store');
  res.render('adminLogin', { error: null, isAdmin: false });
};

exports.login = (req, res) => {
  if (!configured(res)) return;
  const username = req.body.username || '';
  const password = req.body.password || '';
  if (!matches(username, process.env.ADMIN_USERNAME) || !matches(password, process.env.ADMIN_PASSWORD)) {
    res.set('Cache-Control', 'no-store');
    return res.status(401).render('adminLogin', { error: 'Incorrect admin username or password.', isAdmin: false });
  }

  const expires = String(Date.now() + sessionDuration);
  res.cookie(cookieName, `${expires}.${signature(expires)}`, { ...cookieOptions(), maxAge: sessionDuration });
  return res.redirect('/admin');
};

exports.protect = (req, res, next) => {
  if (!configured(res)) return;
  if (validSession(req)) return next();
  return res.redirect('/admin/login');
};

exports.logout = (req, res) => {
  res.clearCookie(cookieName, cookieOptions());
  res.redirect('/');
};