// Hearth Ledger boot: build the store from the household's ledger, render the
// page the hash names, and re-render whenever the hash changes.
import { createStore, renderRoute, wireEvents } from "./router.js";

const store = createStore();
wireEvents(store);
renderRoute(store);
window.addEventListener("hashchange", () => renderRoute(store));
