import styles from "./SmilingLoader.module.css";

const SmilingLoader: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
    return (
        <div {...props}>
            <div className={styles.leftEye}></div>
            <div className={styles.rightEye}></div>
            <div className={styles.mouth}></div>
        </div>
    );
};

export default SmilingLoader;
