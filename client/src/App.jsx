import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Bookmark Manager</h1>
        <p>Save and organize your links with tags and quick search.</p>
      </header>
      <main className="app-main">
        <Home />
      </main>
    </div>
  );
};

export default App;
