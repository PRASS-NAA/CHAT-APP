import Chat from "../../components/messages/messageContainer";
import Sidebar from "../../components/sidebar/sidebar";

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-900 rounded-lg overflow-hidden">
      <Sidebar />
      <Chat />
    </div>
  );
};

export default Home;
