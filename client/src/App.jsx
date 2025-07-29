import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <main className="flex flex-col h-screen">
      <Header />

      <Home />

      <Footer />
    </main>
  );
};

export default App;
