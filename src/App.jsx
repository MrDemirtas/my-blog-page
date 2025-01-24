import Editor from "./components/Editor";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import { useState } from "react";

export default function App() {
  const [isEditorPage, setEditorPage] = useState(false);
  
  return (
    <>
    <Header setEditorPage={setEditorPage} />
    {isEditorPage ? <Editor /> : <HomePage />}
    </>
  )
}
