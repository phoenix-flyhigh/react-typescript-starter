import "./App.css";
import { Grid } from "./Grid";
import React from "react";

function App() {
  return (
    <div className="h-screen w-full flex justify-center flex-col items-center">
      <h1 className="text-3xl">Grid lights</h1>
      <Grid size={3} />
    </div>
  );
}

export default App;
