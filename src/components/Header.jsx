export default function Header({ setEditorPage, setDetailsPage }) {
  return (
    <header>
      <h2>My Blog</h2>
      <ul>
        <li>
          <a href="#" onClick={() => {setEditorPage(false); setDetailsPage(0)}}>
            Ana Sayfa
          </a>
        </li>
        <li>
          <a href="#" onClick={() => {setEditorPage(true); setDetailsPage(0)}}>
            Admin Panel
          </a>
        </li>
      </ul>
    </header>
  );
}
