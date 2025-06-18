import { _comparePassword, _hashPassword } from "../utils/auth/hasher";
import { HttpStatus } from "../utils/http-statuses";
import { createUser, getUserByattributes } from "./user.service";

export const authUserRegister = async (
  name: string,
  email: string,
  password: string,
  avatar: string
) => {
  try {
    const existingUser = await getUserByattributes("email", email);
    if (existingUser) {
      throw new Error(`User with email ${email} already exist`);
    }
    const hashedPassword = await _hashPassword(password);

    const newUser = createUser(name, email, hashedPassword, avatar);
    return newUser;
  } catch (error) {
    console.log("error occur in auth register sercice");
    throw error;
  }
};

export const authUserLogin = async (email: string, password: string) => {
  try {
    const user = await getUserByattributes("email", email);

    if (!user) {
      throw new Error(`User email ${email} Invalid`);
    }
    const isMatch = await _comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error(`User password  Invalid`);
    }
    return user;
  } catch (error) {
    console.log("error occur in auth login sercice");
    throw error;
  }
};
