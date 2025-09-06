export default interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
}