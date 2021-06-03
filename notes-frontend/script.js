// GET MAIN
const main = document.querySelector('main');

// START
printLogInBox();
if (localStorage.getItem("User")) {
    printStartPage();
    getDocsFromDB();
};

// EVT LISTENERS
document.addEventListener('click', (evt) => {
    // CHECK LOGIN
    checkLogIn(evt.target.id);

    // OPEN DOCUMENT
    printDemoPage(evt.target);

    // CREATE NEW DOC
    newDocToDB(evt.target.id);

    // ASIDE BUTTONS
    switch (evt.target.id) {
        case "asideStartBtn":
            printStartPage();
            getDocsFromDB();
        break;
        case "asideCreateBtn":
            printNewDocPage();
        break;
        case "asideLogOutBtn":
            logOut();
        break;
    };

    // RETURN BUTTON
    if (evt.target.id == "demoReturnBtn") {
        printStartPage();
        getDocsFromDB();
    };
});

// LOGIN FUNCTION
function checkLogIn(id) {
    if (id == 'logInBtn') {
        let uName = document.getElementById('userName').value;
        let pWord = document.getElementById('passWord').value;
        let logInError = document.getElementById('logInError');
        let sendUser = {userName: uName, passWord: pWord};

        fetch('http://localhost:3000/docs/', {method: "post", headers: {"Content-type": "application/json"}, body: JSON.stringify(sendUser)})
        .then(resp => resp.json())
        .then(user => {

            localStorage.setItem("User", uName);
            printStartPage();
            getDocsFromDB();
        });

        logInError.innerText = "Fel uppgifter, försök igen!";
    };
};

// SIGN OUT FUNCTION
function logOut() {
    localStorage.removeItem("User");
    location.reload();
};

// PRINT FUNCTIONS
function printLogInBox() {
    main.innerHTML = `
    <section class="login-background">
        <section id="logInPage" class="login-page">
            <h3>Logga in</h3>
            <article id="logInForm" class="login-form">
                <input type="text" id="userName" placeholder="Användarnamn" autocomplete="off">
                <input type="password" id="passWord" placeholder="Lösenord">
            </article>
            <article id="logInMsgBtn" class="login-msg-btn">
                <span id="logInError"></span>
                <button id="logInBtn">Logga in</button>
            </article>
        </section>
    </section>`;

    document.getElementById('passWord').addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            document.getElementById('logInBtn').click();
        };
    });
};

function printStartPage() {
    let uName = localStorage.getItem("User");

    main.innerHTML = `
    <aside>
        <div id="asideProfile" class="aside-profile">
            <i class="fas fa-user-circle"></i>
            <p>${uName}</p>
        </div>
        <article id="asideBtnsContainer">
            <div id="asideStartBtn" class="aside-btn">
                <i class="fas fa-home" id="asideStartBtn"></i>
                <p>Start</p>
            </div>
            <div id="asideCreateBtn" class="aside-btn">
                <i class="fas fa-folder-plus" id="asideCreateBtn"></i>
                <p>Skapa</p>
            </div>
            <div id="asideLogOutBtn" class="aside-btn">
                <i class="fas fa-sign-out-alt" id="asideLogOutBtn"></i>
                <p>Logga ut</p>
            </div>
        </article>
    </aside>
    <section id="mainContent" class="main-content">
        <article id="startPage">
            <h2>Välkommen</h2>
            <article id="docsContainer" class="docs-container">
                <h3>Alla dokument</h2>
            </article>
        </article>
    </section>`;
};

function printNewDocPage(id) {
    const mainContent = document.getElementById('mainContent');

    let printNewDoc = `
    <h2>Nytt dokument</h2>
    <article id="newDocContainer" class="new-doc-container">
        <div id="newDocHeaderContainer">
            <input type="text" placeholder="Namn på dokument" id="newDocHeaderInput" autocomplete="off">
            <button id="createNewDoc">Skapa</button>
        </div>
        <p id="newDocMsg"></p>`;

    printNewDoc += `
        <article id="textContentContainer">
            <h4 id="headerTextContent"></h4>
            <div id="textContentBox">
                <textarea id="newTextContent"></textarea>
            </div>
        </article>
    </article>`;

    mainContent.innerHTML = printNewDoc;
    tinymce.remove('#newTextContent');
    tinymce.init({
        selector: "#newTextContent",
        plugins: "code",
        font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times;Verdana=verdana,geneva;",
        toolbar: "undo redo | fontselect fontsizeselect | bold italic underline | alignleft alignright aligncenter | forecolor",
        menubar: false,
        height: 400,
        setup: function(editor) {
            editor.on("change", () => {
                editor.save();
            });
        }
    });
};

function printDemoPage(id) {
    if (id.parentNode.id === 'docsContainer' || id.parentNode.className === 'doc-list') {

        let mainContent = document.getElementById('mainContent');

        mainContent.innerHTML = `
        <div><h2 id="demoHeader"></h2>
        <p id="demoDate"></p></div>
        <article id="demoDocContainer" class="demo-doc-container">
            <div id="demoDocBtnBox">
                <button id="demoReturnBtn">Tillbaka</button>
                <div id="editBtnBox">
                    <button id="editDocBtn">Redigera</button>
                </div>
                <button id="deleteDocBtn">Radera</button>

            </div>
            <p id="editSavedMsg"></p>
            <div id="demoTextContentBox">
                <p id="demoTextContentP"></p>
            </div>
        </article>`;

        printDocFromDB(id.id);
    };
};

// DATABASE FUNCTIONS
function printDocFromDB(docId) {
    fetch('http://localhost:3000/docs/start/' + docId)
    .then(resp => resp.json())
    .then(doc => {
        let demoHeader = document.getElementById('demoHeader');
        let demoDate = document.getElementById('demoDate');
        let demoTextContentP = document.getElementById('demoTextContentP');

        for (i in doc) {
            let createDate = doc[i].createDate;
            let onlyDate = createDate.substring(0,10);

            demoHeader.innerText = doc[i].header;
            demoDate.innerText = onlyDate;
            demoTextContentP.innerHTML = doc[i].textContent;
        };

        document.getElementById('editDocBtn').addEventListener('click', () => {
            editDoc(doc);
        });

        document.getElementById('deleteDocBtn').addEventListener('click', () => {
            deleteDoc(doc);
        });
    });
};

function editDoc(doc) {
    document.getElementById('editDocBtn').style.display = "none";
    document.getElementById('deleteDocBtn').style.display = "none";
    
    let demoTextContentBox = document.getElementById('demoTextContentBox');
    let demoDocBtnBox = document.getElementById('demoDocBtnBox');

    demoTextContentBox.innerHTML= `
    <textarea id="textContent">${doc[0].textContent}</textarea>`;
    
    // TINY MCE
    tinymce.remove('#textContent');
    tinymce.init({
        selector: "#textContent",
        plugins: "print",
        menubar: false,
        height: 400,
        font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times;Verdana=verdana,geneva;",
        toolbar: " print | undo redo | fontselect fontsizeselect | bold italic underline | alignleft alignright aligncenter | forecolor",

        setup: function(editor) {
            editor.on("change", () => {
                editor.save();
            });
        }
    });

    demoDocBtnBox.insertAdjacentHTML('beforeend', `
    <button id="saveEditBtn">Spara</button>`);

    document.getElementById('saveEditBtn').addEventListener('click', () => {
        saveEditing(doc);
    });
};

function saveEditing(doc) {
    let newTextContent = document.getElementById('textContent').value;
    
    let sendEditedDoc = {docId: doc[0].docId, textContent: newTextContent};

    // console.log(sendEditedDoc);
    
    fetch('http://localhost:3000/docs/edit', {method: "post", headers: {"Content-type": "application/json"}, body: JSON.stringify(sendEditedDoc)})
    .then(resp => resp.json())
    .then(data => {
        tinymce.remove('#textContent');
        let demoTextContentBox = document.getElementById('demoTextContentBox');
        demoTextContentBox.innerHTML = `
        <p id="demoTextContentP"></p>`;

        let demoTextContentP = document.getElementById("demoTextContentP");
        demoTextContentP.innerHTML = data[0].textContent;
    });

    let editSavedMsg = document.getElementById('editSavedMsg');
    editSavedMsg.innerText = "Sparat!";
    document.getElementById('saveEditBtn').style.display = "none";
};

function deleteDoc(doc) {
    if (confirm("Är du säker att du vill radera detta dokument?")) {
        let docId = doc[0].docId;
        let sendDeleteDoc = {docId};
        // console.log(sendDeleteDoc);

        fetch('http://localhost:3000/docs/delete', {method: "post", headers: {"Content-type": "application/json"}, body: JSON.stringify(sendDeleteDoc)})
        .then(resp => resp.json())
        .then(answer => {
            console.log(answer);
            location.reload();
        });
    };
};

function getDocsFromDB() {
    let docsContainer = document.getElementById('docsContainer');

    fetch('http://localhost:3000/docs/start')
    .then(resp => resp.json())
    .then(docs => {

        for (doc in docs) {
            let createDate = docs[doc].createDate;
            let onlyDate = createDate.substring(0,10);

            docsContainer.insertAdjacentHTML('beforeend', `<div id="${docs[doc].docId}" class="doc-list">
                <h4 id="${docs[doc].docId}">${docs[doc].header}</h4>
                <p id="docDate">${onlyDate}</p>
                <p id="docUserName">${docs[doc].userName}</p>
            </div>`);
        };
    });
};

function newDocToDB(id) {
    if (id == 'createNewDoc') {
        let header = document.getElementById('newDocHeaderInput').value;
        let userName = localStorage.getItem("User");
        let textContent = document.getElementById('newTextContent').value;
        let headerInput = document.getElementById('newDocHeaderInput').value;
        let newDocMsg = document.getElementById('newDocMsg');

        if (headerInput == "") {
            newDocMsg.innerText = "Fyll i namn på dokumentet";
            return;
        } else {
            let sendNewDoc = {header: header, textContent: textContent, userName: userName};

            // console.log(sendNewDoc);

            fetch('http://localhost:3000/docs/new', {method: "post", headers: {"Content-type": "application/json"}, body: JSON.stringify(sendNewDoc)})
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                newDocMsg.innerText = "Skapat! Gå till Start för att se ditt nya dokument.";
            });
        };
    };
};