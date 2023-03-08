//!test param label 80006-269-04,
/*parameters: 
listOfLabels = ["1234", "1234567", "12345678901234"],
ribbonWidth=95.2,
labelWidth=25.4,
labelHeight=7.16,
DPI = 203,
fontSize = 12,
labelsInRow = 3,
linesOfText = 1
*/
//!result:
/* 
^XA  

^CF0,34  

^FO80,20 
^FB203,1,0,C 
^FD1234
^FS 

^FO310,20 
^FB203,1,0,C 
^FD1234567
^FS 

^FO540,20 
^FB203,1,0,C 
^FD12345678901234
^FS 

^MMC 

^XZ
*/
listOfLabels = ["1234", "1234567"];
DPI = 203;
fontSize = 8;
ribbonWidth = 95.2;
labelWidth = 25.4;
labelHeight = 7.16;
labelsInRow = 1;
linesOfText = 1;
x_0 = 6;
x_n = 3;

function prepareZPL(
  listOfLabels,
  ribbonWidth,
  labelWidth,
  labelHeight,
  DPI = 203,
  fontSize = 12,
  labelsInRow = 1,
  x_0 = 0,
  x_n = 0,
  linesOfText = 1
) {
  //console log parameteres
  const ribbonWidthInDots = Math.round((ribbonWidth * DPI) / 25.4);
  x_0 = Math.round((x_0 * DPI) / 25.4);
  x_n = Math.round((x_n * DPI) / 25.4);
  console.log("x_0, x_n: ", x_0, x_n);
  const beginLabelDefinition = "\n^XA";
  const endLabelDefinition = " ^XZ";
  const mode = "\n^XA\n^MMC\n^XZ";
  const labelWidthInDots = Math.round((labelWidth * DPI) / 25.4);
  const labelHeightInDots = Math.round((labelHeight * DPI) / 25.4);
  console.log("label w / h: ", labelWidthInDots, labelHeightInDots);
  const fontSizeInDots = Math.round((fontSize * DPI) / 72);
  //?const fontSizeInDots = Math.round(fontSize * DPI / 96);

  const fontZPL = "\n^CF0," + fontSizeInDots;
  //?  x position of 1. label left edge
  //const x0 = ribbonWidthInDots / (labelsInRow * 2) - labelWidthInDots / 2;

  // labels divided in groups of n where n is number of labels in row
  const groupedLabels = listOfLabels.reduce((acc, item, index, array) => {
    if (index % labelsInRow === 0) {
      acc.push(array.slice(index, index + labelsInRow));
    }
    return acc;
  }, []);

  const labelsZPL = groupedLabels.map(
    (group) =>
      beginLabelDefinition +
      group
        .map((label, index) => {
          const x = Math.round(
            x_0 + (index * (ribbonWidthInDots - x_0 - x_n)) / labelsInRow
          ); // x position of label

          const y = Math.round((labelHeightInDots - fontSizeInDots) / 4); // y position of label
          console.log(index, x, y);
          return `\n^FO${x},${y} ^FB${labelWidthInDots},${linesOfText},0,C\n^FD${label}\\&^FS`;
        })
        .join("") +
      endLabelDefinition
  );

  return beginLabelDefinition + fontZPL + labelsZPL + mode;
}
