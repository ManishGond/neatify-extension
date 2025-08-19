import * as vscode from "vscode";
import * as path from "path";

export class NeatifyWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "neatify.myView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "runCommand":
          vscode.commands.executeCommand(data.command);
          break;
        case "showInfo":
          vscode.window.showInformationMessage(data.message);
          break;
      }
    });
  }

  public showOptimizationResult(message: string) {
    if (this._view) {
      this._view.webview.postMessage({ type: "optimizationResult", message });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "main.js"
    );
    const scriptUri = webview.asWebviewUri(scriptPath);

    const stylePath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "style.css"
    );
    const styleUri = webview.asWebviewUri(stylePath);

    const logoPath = vscode.Uri.joinPath(
      this._extensionUri,
      "images",
      "logo.svg"
    );
    const logoUri = webview.asWebviewUri(logoPath);

    const nonce = getNonce();

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:;">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Neatify</title>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUri}" alt="Neatify Logo" class="logo">
                    <h1>Neatify</h1>
                    <p>Clean, refactor, and optimize your JavaScript/TypeScript code</p>
                </div>
                
                <div class="status-bar" id="statusBar">
                    <span id="statusText">Ready to optimize your code</span>
                </div>
                
                <div class="features">
                    <h2>Quick Actions</h2>
                    
                    <div class="feature-card" data-command="neatify.removeUnusedImports">
                        <h3>Remove Unused Imports</h3>
                        <p>Clean up your import statements by removing unused dependencies</p>
                        <button class="run-button">Run</button>
                    </div>
                    
                    <div class="feature-card" data-command="neatify.removeUnusedVariables">
                        <h3>Remove Unused Variables</h3>
                        <p>Eliminate unused variables and declarations from your code</p>
                        <button class="run-button">Run</button>
                    </div>
                    
                    <div class="feature-card" data-command="neatify.refactorToCamelCase">
                        <h3>Refactor to camelCase</h3>
                        <p>Convert your code to follow camelCase naming conventions</p>
                        <button class="run-button">Run</button>
                    </div>
                    
                    <div class="feature-card" data-command="neatify.convertVarToLet">
                        <h3>Convert var → let/const</h3>
                        <p>Modernize your code by converting var declarations to let/const</p>
                        <button class="run-button">Run</button>
                    </div>
                    
                    <div class="feature-card" data-command="neatify.optimizeFile">
                        <h3>Optimize Entire File</h3>
                        <p>Apply all optimization techniques to your current file</p>
                        <button class="run-button optimize-button">Optimize</button>
                    </div>
                </div>
                
                <div class="results" id="resultsPanel" style="display: none;">
                    <h3>Optimization Results</h3>
                    <pre id="resultsContent"></pre>
                </div>
                
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
