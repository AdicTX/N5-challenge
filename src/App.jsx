import React from "react";
import { Route, Routes } from "react-router-dom";
import Table from "./Table";
import UserCard from "./UserCard";
import NotFound from "./NotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Table />} />
        {/* <Route exact path="/usuario" element={<UserCard />} /> */}
        <Route exact path="/usuario/:id" element={<UserCard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
