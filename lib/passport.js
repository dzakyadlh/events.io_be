const passport = require('passport');
const UserModel = require('../models/user');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'qSvHiBDspNIfd28Y1mJpPMFNT3WoUHxT',
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
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
