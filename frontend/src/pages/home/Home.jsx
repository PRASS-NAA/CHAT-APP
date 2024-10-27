import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
	  <div className="flex h-screen bg-gray-900 items-center justify-center p-4">
		<div className="flex w-full max-w-6xl h-[85vh] rounded-xl overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl">
		  <Sidebar />
		  <MessageContainer />
		</div>
	  </div>
	);
  };

  export default Home;