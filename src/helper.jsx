import BlogDetails from "./components/BlogDetails";
import Editor from "./components/Editor";
import HomePage from "./components/HomePage";

const routers = [
  {
    url: "/",
    component: <HomePage />,
  },
  {
    url: "/admin",
    component: <Editor />,
  },
  {
    url: "/blog-detail",
    component: <BlogDetails />,
  },
];
export function getPage(url) {
  return routers.findLast((x) => url.startsWith(x.url)).component;
}
