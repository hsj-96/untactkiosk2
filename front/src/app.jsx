import styles from './app.module.css';
import HandDetection from './components/hand_detection/hand_detection';

const App = () => {
  return (
    <div className={styles.app}>
      <HandDetection />
    </div>
  );
}

export default App;