export default function Header({ setEditorPage, setDetailsPage }) {
  return (
    <header>
      <h2>Furkan Demirtaş Blog</h2>
      <ul>
        <li>
          <a href="#" onClick={() => {setEditorPage(false); setDetailsPage(0)}}>
            Ana Sayfa
          </a>
        </li>
        <li>
          <a href="#" onClick={() => {setEditorPage(true); setDetailsPage(0)}}>
            Editör
          </a>
        </li>
      </ul>
    </header>
  );
}
