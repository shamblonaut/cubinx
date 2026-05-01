function setupKeybinds(turnQueue) {
  const turnKeys = ["r", "m", "l", "u", "e", "d", "f", "s", "b"];

  window.addEventListener("keydown", (event) => {
    if (turnKeys.includes(event.key.toLowerCase())) {
      turnQueue.push({
        layer: event.key.toUpperCase(),
        clockwise: !event.shiftKey,
      });
    }
  });
}

export default setupKeybinds;
