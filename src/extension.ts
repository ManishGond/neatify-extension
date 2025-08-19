import * as vscode from "vscode";
import { removeUnusedVariables } from "./functions/removeUnusedVariables";
import { refactorToCamelCase } from "./functions/refactorToCamelCase";
import { checkCurrentFileOpen } from "./functions/checkCurrentFileOpen";
import { suggestVarToLetConst } from "./functions/suggestVarToLetConst";
import { removeUnusedImports } from "./functions/removeUnusedImports";

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
  } catch (error) {
    vscode.window.showErrorMessage(`Optimization failed: ${error}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Neatify Extension is now active!");

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
  console.log("Neatify Extension is now deactivated.");
}
