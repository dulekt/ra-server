module.exports = {
    prepareZPL,
};

function prepareZPL(
    listOfLabels,
    ribbonWidth,
    labelWidth,
    labelHeight,
    DPI = 203,
    fontSize = 14,
    labelsInRow = 1,
    x_0 = 0,
    x_n = 0,
    linesOfText = 1
) {
    const ribbonWidthInDots = Math.round((ribbonWidth * DPI) / 25.4);
    const x_0inDPI = Math.round((x_0 * DPI) / 25.4);

    const x_nInDPI = Math.round((x_n * DPI) / 25.4);

    console.log('x_0, x_n: ', x_0, x_n);

    const beginLabelDefinition = '\n^XA';
    const endLabelDefinition = ' ^XZ';
    const cut = '^XA^MMC^XZ';
    const labelWidthInDots = Math.round((labelWidth * DPI) / 25.4);
    const labelHeightInDots = Math.round((labelHeight * DPI) / 25.4);

    const fontSizeInDots = Math.round((fontSize * DPI) / 72);
    // ?const fontSizeInDots = Math.round((fontSize * DPI) / 96);

    const fontZPL = `\n^CFE,${fontSizeInDots}`;
    // ?  x position of 1. label left edge
    // const x0 = ribbonWidthInDots / (labelsInRow * 2) - labelWidthInDots / 2;
    // labels divided in groups of n where n is number of labels in row
    const groupedLabels = listOfLabels?.reduce((acc, item, index, array) => {
        if (index % labelsInRow === 0) {
            acc.push(array.slice(index, index + labelsInRow));
        }

        return acc;
    }, []);

    const labelsZPL = groupedLabels?.map(
        group =>
            beginLabelDefinition +
            group
                .map((label, index) => {
                    const x = Math.round(x_0inDPI + (index * (ribbonWidthInDots - x_0inDPI - x_nInDPI)) / labelsInRow); // x position of label

                    const y = Math.round((labelHeightInDots - fontSizeInDots) / 4); // y position of label
                    console.log('index,x,y  ', index, x, y);

                    return `^FO${x},${y}^FB${labelWidthInDots},${linesOfText},1,C^FD${label}^FS`;
                })
                .join('') +
            endLabelDefinition
    );

    return beginLabelDefinition + fontZPL + labelsZPL + cut;
}

console.log(
    prepareZPL(
        (listOfLabels = ['-SE', '-SE', '-SE']),
        (ribbonWidth = 95),
        (labelWidth = 25.4),
        (labelHeight = 9.5),
        (DPI = 300),
        (fontSize = 8),
        (labelsInRow = 3),
        (linesOfText = 1),
        (x_0 = 9.5),
        (x_n = 0),
        (linesOfText = 1)
    )
);
//! test param label 80006-269-04,
/* parameters:
listOfLabels = ["1234", "1234567", "12345678901234"],
ribbonWidth=95.2,
labelWidth=25.4,
labelHeight=7.16,
DPI = 203,
fontSize = 12,
labelsInRow = 3,
linesOfText = 1
*/
//! result:
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