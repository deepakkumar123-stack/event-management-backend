import { Users } from "../models/user.model";
import { UserType } from "../types/user.type";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  avatar: string
): Promise<UserType> => {
  try {
    const newUser = new Users({ name, email, password, avatar });
    return await newUser.save();
  } catch (error) {
    console.log("error occur in create user");
    throw error;
  }
};

type allowedUserAttributes = "_id" | "email";

export const getUserByattributes = async <K extends allowedUserAttributes>(
  attribute: K,
  value: UserType[K]
): Promise<UserType | null> => {
  try {
    const user = await Users.findOne({ [attribute]: value });
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log("Failed to fetch user with given ".concat(attribute), error);
    throw new Error(`Failed to fetch user with ${attribute} ${value}`);
  }
};
