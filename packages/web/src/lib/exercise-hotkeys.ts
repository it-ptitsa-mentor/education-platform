export const isRunTestsHotkey = (event: {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}) =>
  event.key === "Enter" &&
  (event.ctrlKey || event.metaKey) &&
  !event.shiftKey &&
  !event.altKey;

export const formatRunTestsHotkey = () => {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  return isMac ? "⌘↵" : "Ctrl+Enter";
};
