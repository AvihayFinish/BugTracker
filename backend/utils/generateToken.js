import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
// This function generates a JWT token for a user and sets it as an HTTP-only cookie in the response. 
// The token is signed with a secret key and has an expiration time of 30 days. 
// The cookie is set to be secure and same-site, which helps protect against cross-site request forgery (CSRF) attacks.
// process.env.NODE_ENV === 'production'