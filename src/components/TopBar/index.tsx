import { UserButton } from "../Sidebar/UserButton/UserButton"
import classes from "./topbar.module.css"
import logo from "../../../public/green-logo.png"

const TopBar = () => {
  return (
    <div className={classes.topbar_wrapper}>
      <div>
        <img src={logo} alt="" className={classes.img} />
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  )
}

export default TopBar