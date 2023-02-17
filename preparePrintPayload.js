export function preparePrintPayload(listOfLabels) {
  const prefix = "^";
  const beginLabelDefinition = `${prefix}XA`;

  const changeFont = (fontName, height, width) =>
    `${prefix}CF${fontName}${height ? `,${height}` : ""}${
      width ? `,${width}` : ""
    }`;

  const setPosition = (x, y, alignment) =>
    `${prefix}FO${x}${y ? `,${y}` : ""}${alignment ? `,${alignment}` : ""}`;

  const mode = (mode) => `${prefix}MM${mode}`;

  const cut = "C";

  const labelStart = `${prefix}FD`;
  const labelEnd = `${prefix}FS`;
  const endLabelDefinition = `${prefix}XZ`;

  // For list of label strings, create groups of 3
  //and join them with the commands
  const groupedLabels = listOfLabels.reduce((acc, item, index, array) => {
    if (index % 3 === 0) {
      acc.push(array.slice(index, index + 3));
    }
    return acc;
  }, []);

  const allLabels = groupedLabels.map(
    (group) =>
      `${beginLabelDefinition}${changeFont(0, 50)}${group.map(
        (label, index) => {
          const offset = 145 + index * 200;
          return `${setPosition(
            offset,
            25
          )} ${labelStart} ${label} ${labelEnd}`;
        }
      )}`
  );

  return ` ${allLabels} ${mode(cut)} ${endLabelDefinition}`;
}
