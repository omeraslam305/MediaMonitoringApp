
function AddHeadingInPDF(text, options) {

    var imgHeight = 20;

    if (options.heightLeft < imgHeight) {
        options.doc.addPage();
        options.position = 0;
        options.heightLeft = options.pageHeight;
    }

    options.doc.text(10, 10, text);

    options.heightLeft = options.heightLeft - imgHeight;
    options.position += imgHeight;

    return options;
}

function AddImageInPDF(options) {

    var canvas = options.canvas;
    var imgData = canvas.toDataURL('image/png');

    var imgWidth = 210;
    var imgHeight = canvas.height * imgWidth / canvas.width;

    if (options.heightLeft < imgHeight) {
        options.doc.addPage();
        options.position = 0;
        options.heightLeft = options.pageHeight;
    }

    options.doc.addImage(imgData, 'PNG', 0, options.position, imgWidth, imgHeight);
    options.heightLeft = options.heightLeft - imgHeight;
    options.position += imgHeight;

    //while (heightLeft >= 0) {
    //    options.position = heightLeft - imgHeight;
    //    options.doc.addPage();
    //    options.doc.addImage(imgData, 'PNG', 0, options.position, imgWidth, imgHeight);
    //    heightLeft -= options.pageHeight;
    //}

    return options;
}

function AddHtmlInPDF(element, options, imgHeight) {

    if (options.heightLeft < imgHeight) {
        options.doc.addPage();
        options.position = 0;
        options.heightLeft = options.pageHeight;
    }

    options.doc.fromHTML(element, 15, options.position, {}); //, 'elementHandlers': elementHandler
    //options.doc.addImage(imgData, 'PNG', 0, options.position, imgWidth, imgHeight);
    options.heightLeft = options.heightLeft - imgHeight;
    options.position += imgHeight;

    return options;
}

function _svgToCanvas() {
    var nodesToRecover = [];
    var nodesToRemove = [];

    var svgElems = document.getElementsByTagName("svg");

    for (var i = 0; i < svgElems.length; i++) {
        var node = svgElems[i];
        var parentNode = node.parentNode;
        var svg = parentNode.innerHTML;

        var canvas = document.createElement('canvas');

        canvg(canvas, svg);

        nodesToRecover.push({
            parent: parentNode,
            child: node
        });
        parentNode.removeChild(node);

        nodesToRemove.push({
            parent: parentNode,
            child: canvas
        });

        parentNode.appendChild(canvas);
    }
}

function CreateCanvasFromSVG(svgContainer) {

    var node = $(svgContainer).find('svg');
    var parentNode = node.parent();
    var svg = parentNode.html();

    var canvas = document.createElement('canvas');

    canvg(canvas, svg);

    return canvas
}

function GetHtmlFromContainer(container) {

    var node = $(container).html();
    var parentNode = node.parent();
    var svg = parentNode.html();

    var canvas = document.createElement('canvas');

    canvg(canvas, svg);

    return canvas
}

function getBase64Image(img) {

    var canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}