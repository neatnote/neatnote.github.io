var PROC_EXEC = false;

function ready(fn) {
    document.readyState != 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
}

function lineCommand(node, content, offset, command, pars)
{
    var range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, content.length);

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    PROC_EXEC = true;
    document.execCommand(command, false, pars); 
    PROC_EXEC = false;

    if (command!='delete') {
        range.selectNode(node);
        range.setStart(node, offset);
        range.setEnd(node, offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
/** TODO Need to burn! */
function styler(text, typeStyle, command, parentNodeName, pars) {
    let sel = window.getSelection();
    let node = sel.focusNode;
    let offset = sel.focusOffset;
    var content = node.nodeValue;
    var isStyle = (typeStyle == 'left_line') ? content && content.trim().indexOf(text)==0 : content && ~content.trim().indexOf(text);
    if (isStyle) {
        if (node.parentNode.nodeName!=parentNodeName)
        {
            console.log('add ' + node.parentNode.nodeName);
            lineCommand(node, content, offset, command, pars);
        }
    } else {
        if (node.parentNode.nodeName==parentNodeName)
        {
            console.log('del ' + node.parentNode.nodeName);
            if (command == 'forecolor'){
                pars = 'rgb(39, 39, 39)';
            }
            if ((command != 'forecolor')||(command == 'forecolor' && !~content.trim().indexOf('#') && !~content.trim().indexOf('@') && !~content.trim().indexOf('?'))){
                lineCommand(node, content, offset, command, pars);
            }
        }
    }
}
function updateStyle(el){
    var style = el.getAttribute('data-style');
    if (style) {
        if (el.innerHTML==''){
            el.classList.remove(style);
        } else {
            el.classList.add(style);
        }
    }
}
ready(() => {
    window.addEventListener("beforeunload", function(e){
        document.querySelectorAll("div.manager").forEach(el => {
            var elId = el.getAttribute('id');
            localStorage.setItem(elId, el.innerHTML);
        });   
    }, false);

    document.querySelectorAll("div.manager").forEach(el => {
        var elId = el.getAttribute('id');
        el.innerHTML = localStorage.getItem(elId);
        el.innerHTML = el.innerHTML.trim();
        el.focus();
        updateStyle(el);
        el.addEventListener("input", () => { 
            if (!PROC_EXEC) {
                styler('--', 'left_line', 'delete');
                styler('-', 'left_line', 'strikeThrough', 'STRIKE');
                styler('_', 'all_line', 'underline', 'U');
                styler('/', 'all_line', 'italic', 'I');
                styler('!', 'all_line', 'bold', 'B');
                styler('?', 'all_line', 'forecolor', 'FONT', '#4400D4');
                styler('@', 'all_line', 'forecolor', 'FONT', '#FF00B8');
                styler('#', 'all_line', 'forecolor', 'FONT', '#FF8A00');
                
                if (el.innerHTML=='<br>') el.innerHTML = '';
                localStorage.setItem(elId, el.innerHTML);
                updateStyle(el);
            }
        })
    });
    document.querySelectorAll("li").forEach(el => {
        el.addEventListener("click", () => { 
            var nm = el.childNodes[0].nodeValue;
            document.querySelectorAll("li").forEach(el => {
                el.classList.remove("active");
            }); 
            el.classList.add("active");
            document.querySelectorAll("div.desktop").forEach(el => {
                el.classList.add("hide");
                document.getElementById("desktop-" + nm).classList.remove("hide");
            });      
        })
    });
    location.hash ? show(location.hash) : null;
});

//range.collapse(true);
//window.getSelection().removeAllRanges();

//var highlightDiv = document.createElement('span');
//highlightDiv.className = 'done';
//range.surroundContents(highlightDiv);
//el.focus();
//window.getSelection().anchorOffset