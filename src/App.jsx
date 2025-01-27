import BlogDetails from "./components/BlogDetails";
import Editor from "./components/Editor";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import { useState } from "react";

export default function App() {
  const [isEditorPage, setEditorPage] = useState(false);
  const [isDetailsPage, setDetailsPage] = useState(0);
  
  return (
    <>
      <Header setEditorPage={setEditorPage} setDetailsPage={setDetailsPage} />
      {
        isDetailsPage !== 0 ? 
          <BlogDetails id={isDetailsPage} /> 
          :
          isEditorPage ? 
            <Editor setDetailsPage={setDetailsPage} /> 
            : 
            <HomePage setDetailsPage={setDetailsPage} />
      }
      <Footer />
    </>
  )
}
