import Styles from '../styles/Alert.module.css';
export default ({title, msg, type, icon}) => {
    function getType(type){
        switch (type){
            case 'warning':
                return Styles.warning;
                break;
            case 'success':
                return Styles.success;
                break;
            case 'error':
                return Styles.error;
                break;
            default:
                return Styles.warning;
        }
    }
    return(
        <section className={`${Styles.alert} ${getType(type)}`}>
            <span>
                {icon}
            </span>
            <div>
                <h5>{title}</h5>
                <p>{msg}</p>
            </div>
        </section>
    )
}
