import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/validation-schema";
import { getUserByEmail } from "./lib/helper/db-helper";
import bcrypt from "bcryptjs";


export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const pwMatch = await bcrypt.compare(password, user.password);

          if (pwMatch) return user;
        }
        return null;
      },
      credentials: {},
    }),
  ],
};
