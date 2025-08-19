import * as vscode from "vscode";
import { removeUnusedVariables } from "./functions/removeUnusedVariables";
import { refactorToCamelCase } from "./functions/refactorToCamelCase";
import { checkCurrentFileOpen } from "./functions/checkCurrentFileOpen";
import { suggestVarToLetConst } from "./functions/suggestVarToLetConst";
import { removeUnusedImports } from "./functions/removeUnusedImports";
import { NeatifyWebviewProvider } from "./webview";

let webviewProvider: NeatifyWebviewProvider | undefined;

async function optimizeFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  if (webviewProvider) {
  }

  removeUnusedImports();
  removeUnusedVariables();
  refactorToCamelCase();
  suggestVarToLetConst();

  vscode.window.showInformationMessage("File optimized!");

  if (webviewProvider) {
    webviewProvider.showOptimizationResult(
      "Optimization completed successfully!\n- Removed unused imports\n- Removed unused variables\n- Refactored to camelCase\n- Converted var to let/const"
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Code Analyzer Extension is now active!");

  const provider = new NeatifyWebviewProvider(context.extensionUri);
  webviewProvider = provider;

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      NeatifyWebviewProvider.viewType,
      provider
    )
  );

  let disposable1 = vscode.commands.registerCommand(
    "neatify.showFileSummary",
    () => {
      checkCurrentFileOpen();
    }
  );
  let disposable2 = vscode.commands.registerCommand(
    "neatify.removeUnusedVariables",
    () => {
      removeUnusedVariables();
    }
  );
  let disposable3 = vscode.commands.registerCommand(
    "neatify.refactorToCamelCase",
    () => {
      refactorToCamelCase();
    }
  );
  let disposable4 = vscode.commands.registerCommand(
    "neatify.removeUnusedImports",
    () => removeUnusedImports()
  );
  let disposable5 = vscode.commands.registerCommand(
    "neatify.convertVarToLet",
    () => suggestVarToLetConst()
  );
  let disposableOptimize = vscode.commands.registerCommand(
    "neatify.optimizeFile",
    () => optimizeFile()
  );

  context.subscriptions.push(
    disposable1,
    disposable2,
    disposable3,
    disposable4,
    disposable5,
    disposableOptimize
  );
}

export function deactivate() {
  webviewProvider = undefined;
}
