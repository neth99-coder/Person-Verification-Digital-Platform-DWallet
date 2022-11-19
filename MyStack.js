import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "./Home";
import StoreId from "./Store_Id";
import VerifyId from "./Verify_Id";

const screens = {
  Home: {
    screen: Home,
  },
  StoreId: {
    screen: StoreId,
  },
  VerifyId: {
    screen: VerifyId,
  },
};

const HomeStack = createStackNavigator(screens);
export default createAppContainer(HomeStack);
