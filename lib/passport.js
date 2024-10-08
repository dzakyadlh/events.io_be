const passport = require('passport');
const UserModel = require('../models/user');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: `${process.env.JWT_SECRET}`,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      console.log('JWT Payload: ', payload);
      const user = await UserModel.findById(payload.user.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
