import styles from "./SmilingLoader.module.css";

function SmilingLoader(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <div className={styles.leftEye}></div>
            <div className={styles.rightEye}></div>
            <div className={styles.mouth}></div>
        </div>
    );
}

export default SmilingLoader;
