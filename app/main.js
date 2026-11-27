// main.js — boots Alder Ledger: renders the view for the current hash
// and re-renders whenever the hash changes (the nav links are hash links,
// so every section is reached by a link and the back button works).
import { render } from './views.js';

window.addEventListener('hashchange', render);
render();
