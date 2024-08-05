import styles from "./SmilingLoader.module.css";

function SmilingLoader() {
    return (
        <div>
            {/* <div className="leftEye"></div>
            <div className="rightEye"></div>
            <div className="mouth"></div> */}

            <div className={styles.leftEye}></div>
            <div className={styles.rightEye}></div>
            <div className={styles.mouth}></div>
        </div>
    );
}

export default SmilingLoader;
