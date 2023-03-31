import bcrypt from 'bcrypt';
import LocalStrategy from "passport-local";
import { User } from "../modules/user.modules.js";

const hashingPasword = (password) => {
  console.log("Plain password:", password);
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  console.log("Hashed password:", hashedPassword);
  return hashedPassword;
};

const passwordValidator = (plainPassword, hashedPassword) => {
  console.log("Plain password:", plainPassword);
  console.log("Hashed password:", hashedPassword);
  const result = bcrypt.compareSync(plainPassword, hashedPassword);
  console.log("Password comparison result:", result);
  return result;
};

const loginStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    console.log(`Username entered: ${username}`);
    const user = await User.findOne({ username });
    console.log(`User found:`, user);
    if (!user) {
      console.log(`No user found with this username`);
      return done(null, false);
    }
    if (!passwordValidator(password, user.password)) {
      console.log(`Password validation failed`);
      return done(null, false);
    }
    console.log(`Login successful`);
    done(null, user);
  } catch (err) {
    console.log(`Login failed due to error: ${err}`);
    done(null, false);
  }
});

const registerStrategy = new LocalStrategy(
  { passReqToCallback: true },
  async (req, username, password, done) => {
    try {
      const userExists = await User.findOne({ username });

      if (userExists) {
        console.log(`User already exists`);
        return done(null, false);
      }

      const newUser = {
        username,
        password: hashingPasword(password),
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        phone: req.body.phone,
        avatar: req.body.avatar
      };
      const createUser = await User.create(newUser);

      req.user = createUser;

      done(null, createUser);
    } catch (err) {
      console.log(`Error while registering user: ${err}`);
      done(null, false);
    }
  }
);

export const passportStrategies = { loginStrategy, registerStrategy };
