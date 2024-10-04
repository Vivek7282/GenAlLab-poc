import styles from "../style";
import HomePageLayout from "./DashbordLayout";
import ChatPromt from "../componets/ChatPromt";
const App = () => (
  <HomePageLayout>
    

    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        
        <ChatPromt />
       
      </div>
    </div>
  </HomePageLayout>
);

export default App;
