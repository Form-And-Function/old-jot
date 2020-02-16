rangy.init();

let spanHighlighter = rangy.createHighlighter();
let divHighlighter = rangy.createHighlighter();
let spanApplier = rangy.createClassApplier('span');
let divApplier = rangy.createClassApplier('div');

spanHighlighter.addClassApplier(spanApplier);
divHighlighter.addClassApplier(divHighlighter);
let graphCount = 0;
function isGraphable(s){
    let calculator = Desmos.GraphingCalculator();
    calculator.setExpression({id:'graph1', latex: s});
    calculator.observe('expressionAnalysis', function() {
        let analysis = calculator.expressionAnalysis["graph1"];
        if(analysis.isGraphable){
            let graphDiv = $('<div id="graph'+ graphCount +'"></div>');
            doc.$textArea.append(graphDiv);
            graphCount++;

            let elt = $('#graph' + graphCount);
            calculator = Desmos.GraphingCalculator(elt);
            calculator.setExpression({id:'graph2', latex: s});

            graphDiv.children().css('background', '#FFEFD9');
        }
    });
}

function getGraphableParts(s){
    // to be implemented 
}

//getGraphable("x=7");



let doc = {
    typing: true,
    selection: null,
    $textArea: $('#textArea'),
    bulletTypes: {
        BULLET: 0,
        ROMAN: 1,
        LETTER: 2,
        NUM: 3
    },
    toggle: (className)=>{

    },
    makeItalic: ()=>{
        spanHighlighter.highlight('italic');
    },

    makeBold: ()=>{
        spanHighlighter.highlight('bold');
    },

    highlight: ()=>{
        spanHighlighter.highlight('highlight');
    },
    makeStrikethrough: ()=>{
        spanHighlighter.highlight('strikethrough');
    },
    addCheckBox: ()=>{
        rangey.createRange().insertNode('<input type="checkbox">');
    },
    addUrl: (url)=>{
        spanHighlighter.highlight('bold');
    }
}

/**doc.$textArea.on('mouseup', 'keyup', function(e) {
    if(typingMode){
        doc.selection  = rangey.
    }
});**/

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }
  
  function getCaretPosition() {
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0);
      var selectedObj = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i].outerHTML)
          rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      return range.startOffset + rangeCount;
    }
    return -1;
  }

$('#textArea, #textArea [contenteditable="true"]').on('input', (e)=>{
    const cursorPos = getCaretPosition();
    let currText = e.target.innerText;
    let prevText = currText.slice(0, cursorPos);
    
    console.log(cursorPos);
    console.log(currText);
    console.log(prevText);


    const patterns = [
        [/(^|[\r\n])(-|\*)( |\t)$/i, ()=>{
            doc.makeBullet(doc.bulletTypes.PLAIN);
        }],
        [/`(la)?tex$/, doc.makeTex],
        [/'img$/, doc.insertImg],
        [/(^|[\r\n])1(\)|.)$/i, ()=>{
            doc.makeBullet(doc.bulletTypes.NUM);
        }],
        [/(^|[\r\n])i(\)|.)$/i, ()=>{
            doc.makeBullet(doc.bulletTypes.ROMAN);
        }],
        [/(^|[\r\n])a(\)|.)$/i, ()=>{
            doc.makeBullet(doc.bulletTypes.LETTER);
        }],
        [/'(b|(bold)|(strong))$/i, doc.makeBold],
        [/'(i|(em)|(italics?))$/i, doc.makeItalic],
        [/'(u(nderline)?)$/i, doc.underline],
        [/'c(ode)?$/i, doc.addCode],
        [/'table$/i, doc.addTable],
        [/'check(box)?$/i, doc.addCheckBox],
        [/'h(ighlight)?$/i, doc.addUrl],
        [/'url$/i, doc.addUrl],
        [/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, (url)=>{
            doc.addUrl(url);
        }]
    ];
    for(pattern of patterns){
        const matches = pattern[0].exec(prevText);
        console.log(prevText);
        console.log(matches);
        if(matches){

            console.log('matched');
            e.target.innerText = prevtext.slice(0, match.firstIndex) + currText.slice(cursorPos);
            const match = matches[0];
            pattern[1](match);
            currText = currText.slice;
            return;
        }
    }
});

// const keywords =    ["e", "pi", 
//                     "+", "-", "*", "/", "^",
//                     "sin", "cos", "tan", "cot", "sec", "csc",
//                     "arcsin", "arccos", "arctan", "arccot", "arcsec", "arccsc",
//                     "ln", "log", "sqrt",
//                     "x", "y"
//                     ];

// function getLatexParts(s){
//     s.includes("=")
// }

// /**doc.$textArea.on('mouseup', 'keyup', function(e) {
//     if(typingMode){
//         doc.selection  = rangey.
//     }
// });**/

// doc.$textArea.on('input', ()=>{
//     console.log('hi');
//     let currText = $textArea.val();
//     let prevText = currText.slice(0, cursorPos);
//     const cursorPos = $textArea.selectionStart;
    

//     const patterns = [
//         [/(^|[\r\n])(-|*)( |\t)$/, ()=>{
//             doc.makeBullet(PLAIN);
//         }],
//         [/`(la)?tex$/, doc.makeTex],
//         [/'img$/, doc.insertImg],
//         [/(^|[\r\n])1(\)|.)$/, ()=>{
//             doc.makeBullet(NUM);
//         }],
//         [/(^|[\r\n])i(\)|.)$/i, ()=>{
//             doc.makeBullet(ROMAN);
//         }],
//         [/(^|[\r\n])a(\)|.)$/i, ()=>{
//             doc.makeBullet(LETTER);
//         }],
//         [/'(b|(bold)|(strong))$/i, doc.makeBold],
//         [/'(i|(em)|(italics?))$/i, doc.makeItalic],
//         [/'(u(nderline)?)$/i, doc.underline],
//         [/'c(ode)?$/i, doc.addCode],
//         [/'table$/i, doc.addTable],
//         [/'check(box)?$/, doc.addCheckBox],
//         [/'h(ighlight)?$/, doc.addUrl],
//         [/'url$/, doc.addUrl],
//         [/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, (url)=>{
//             doc.addUrl(url);
//         }]
//     ];
//     for(pattern of patterns){
//         const matches = prevText.exec(pattern[0]);
//         console.log(matches);
//         if(matches){
//             const match = matches[0];
//             pattern[1](match);
//             currText = currText.slice;
//             $textArea.value = prevtext.slice(0, match.firstIndex) + currText.slice(cursorPos);
//             return;
//         }
//     }
// });

// // const keywords =    ["e", "pi", 
// //                     "+", "-", "*", "/", "^",
// //                     "sin", "cos", "tan", "cot", "sec", "csc",
// //                     "arcsin", "arccos", "arctan", "arccot", "arcsec", "arccsc",
// //                     "ln", "log", "sqrt",
// //                     "x", "y"
// //                     ];

// // function getLatexParts(s){
// //     s.includes("=")
// // }



// document.addEventListener('keydown', (event) => {
//   const keyName = event.key;

//   if (event.ctrlKey) {
//     // event.key is not 'Control' (different key is pressed),
//     // event.ctrlKey true if Ctrl key is pressed at the same time.
//     console.log(`Combination of ctrlKey + ${keyName}`);
//   } else if (event.altKey){
//     console.log(`Combination of altKey + ${keyName}`);
//   } else {
//     console.log(`Key pressed ${keyName}`);
//   }
// });

// document.addEventListener('keyup', (event) => {
//   const keyName = event.key;

//   // As the user releases the Ctrl key,
//   // so event.ctrlKey is false.
//   if (keyName === 'Control') {
//     console.log('Control key was released');
//   }
// });