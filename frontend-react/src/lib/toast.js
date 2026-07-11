// toast.js — a tiny pub/sub so any component can call toast("message")
// without wrapping the app in a context provider for something this small.
let listeners = [];

export function toast(message) {
  listeners.forEach((fn) => fn(message));
}

export function subscribeToast(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter((l) => l !== fn); };
}
