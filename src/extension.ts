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
    vscode.window.showErrorMessage("No active text editor found!");
    return;
  }

  try {
    // Execute optimization steps sequentially
    await removeUnusedImports();
    await removeUnusedVariables();
    await refactorToCamelCase();
    await suggestVarToLetConst();

    vscode.window.showInformationMessage("File optimized!");

    if (webviewProvider) {
      webviewProvider.showOptimizationResult(
        "Optimization completed successfully!\n- Removed unused imports\n- Removed unused variables\n- Refactored to camelCase\n- Converted var to let/const"
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Optimization failed: ${error}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Neatify Extension is now active!");

  try {
    // Register the webview view provider
    const provider = new NeatifyWebviewProvider(context.extensionUri);
    webviewProvider = provider;

    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        NeatifyWebviewProvider.viewType,
        provider
      )
    );
  } catch (error) {
    console.error("Failed to register webview:", error);
  }

  // Register all commands
  const disposables = [
    vscode.commands.registerCommand("neatify.showFileSummary", () => {
      console.log("showFileSummary command executed");
      checkCurrentFileOpen();
    }),

    vscode.commands.registerCommand("neatify.removeUnusedVariables", () => {
      removeUnusedVariables();
    }),

    vscode.commands.registerCommand("neatify.refactorToCamelCase", () => {
      refactorToCamelCase();
    }),

    vscode.commands.registerCommand("neatify.removeUnusedImports", () => {
      removeUnusedImports();
    }),

    vscode.commands.registerCommand("neatify.convertVarToLet", () => {
      suggestVarToLetConst();
    }),

    vscode.commands.registerCommand("neatify.optimizeFile", () => {
      optimizeFile();
    }),
  ];

  // Add all disposables to context
  disposables.forEach((disposable) => context.subscriptions.push(disposable));

  // Show activation message
  vscode.window.showInformationMessage(
    "Neatify is now active! Use the Neatify panel or commands to optimize your code."
  );
}

export function deactivate() {
  webviewProvider = undefined;
  console.log("Neatify Extension is now deactivated.");
}
