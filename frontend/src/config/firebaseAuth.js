import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Authentication is only loaded with the private admin route.
export const auth = getAuth(app);
