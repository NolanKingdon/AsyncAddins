let body = document.getElementsByTagName('body')[0];
import icon from '../images/Font_Awesome_5_solid_chevron-left.svg';
import addinIcon from '../../app/images/icon.svg';
let loginExample = `

    <link rel="stylesheet" href="https://my112.geotab.com/geotab/checkmate/app.less?skin=my_geotab">

<style>
    body {
        height: initial;
        width: initial;
    }

    body.nightMode {
        background: #515964;
    }

    body>div {
        margin: 1em;
    }

    button:focus, #navigationId:focus {
        outline: none;
    }

    #app {
        width: initial;
    }

    #hiddenMenu {
        position: absolute;
        display: none;
        top: 0;
        left: 249px;
        min-width: 200px;
        height: auto;
    }

    .geotabIcons_chevron {
        mask-image: url(${icon});
        mask-repeat: no-repeat;
        -webkit-mask-image: url(${icon});
        -webkit-mask-repeat: no-repeat;
        background-color: #25477b;
    }

    .dev-dialog {
        
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    }

    .dev-dialog::backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .dev-header {
        
        background-color: #eee;
        flex-direction: row;
        flax-wrap: wrap;
        justify-content: flex-end;
        display: flex;
        border-bottom: 1px solid #ccc;
    }

    .dev-button {
        padding: 5px 10px;
        display: inline;
        background: #bbb repeat-x bottom;
        border: none;
        color: #fff;
        cursor: pointer;
        font-weight: bold;
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        text-shadow: 1px 1px #666;
        text-decoration: none;
        margin: 0.5em 0.5em 0.5em 0;
    }

    .dev-button:hover {
        background-position: 0 -48px;
        filter: brightness(108%);
    }

    .dev-button:active {
        background-position: 0 top;
        position: relative;
        top: 1px;
        padding: 6px 10px 4px;
    }

    .dev-toggle {
        flex: auto;
        padding: 12px 10px;
    }

    .dev-form {
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-end;
        display: flex;
    }

    .dev-form label {
        display: none;
    }

    .dev-form input,
    .dev-form select {
        border-radius: 0.5em;
        padding: 0.5em;
    }

    .dev-form input {
        border-radius: 0.5em;
        padding: 0.5em;
    }

    .dev-form .line {
        display: block;
        margin: 0.5em 0;
    }

    .geotabIcons_sync {
        background-image: url("${addinIcon}");
    } 
    </style>
    <header class="dev-header">
    
        <div id="languages-target"></div>
        
            <a id="toggleBtn" class="dev-button">Blur add-in</a>
        
        <a target="_blank" href="src/.dev/styles/styleGuideMyGeotab.html" class="dev-button">Style Guide</a>
      
      <a id="logoutBtn" class="dev-button">Logout</a>
    </header>

    <dialog id="loginDialog" class="dev-dialog">
        <form class="dev-form">
            <div class="line">
                <label for="email">Email</label>
                <input type="text" id="email" placeholder="Email">
            </div>
            <div class="line">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password">
            </div>
            <div class="line">
                <label for="server">Server</label>
                <input type="text" id="server" placeholder="Server URL (my.geotab.com)">
            </div>
            <div class="line">
                <label for="database">Database</label>
                <input type="text" id="database" placeholder="Database">
            </div>
            <div class="line error" id="loginError" style="display: none; color: red">
                Invalid User or Password
            </div>
            <div class="line">
                <a href="" id="loginBtn" class="dev-button">Login</a>
            </div>
        </form>
    </dialog>
    <dialog id="deviceDialog" class="dev-dialog">
        <form class="dev-form">
            <div class="line">
                <label for="devices">Device</label>
                <select id="devices"></select>
            </div>
            <div class="line">
                <a href="" id="okBtn" class="dev-button">OK</a>
            </div>
        </form>
    </dialog>
`;
body.innerHTML = loginExample + body.innerHTML;