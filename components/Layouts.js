import Header from "./Header";
import SideBar from "./SideBar";
import Styles from '../styles/Layouts.module.css'
import Footer from "./Footer";
import {useSelector} from "react-redux";
import useDeviceSize from "./useDeviceSize";
import {useRouter} from "next/router";

export default (props) => {
    const [width, height] = useDeviceSize();
    const router = useRouter()
    const sideBar = useSelector(state => state.width.sideBar)
    return (
        <main className={Styles.layouts}>
            <div style={{
                width: width <= 900 ? `100%` : `calc(100% - ${sideBar}px)`,
                transition: "all 0.5s ease",
            }}>
                <Header />
                <main className={Styles.index}>
                    {props.children}
                </main>
                <Footer />
            </div>
            <SideBar/>
        </main>
    )
}
