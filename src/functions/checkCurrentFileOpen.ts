import * as vscode from "vscode";
import * as ts from "typescript";

export function checkCurrentFileOpen() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active editor open!");
    return;
  }

  const text = editor.document.getText();
  const sourceFile = ts.createSourceFile(
    editor.document.fileName,
    text,
    ts.ScriptTarget.Latest,
    true
  );

  const variables: string[] = [];
  const functions: string[] = [];

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isVariableDeclaration(node)) {
      variables.push(node.name.getText());
    }
    if (ts.isFunctionDeclaration(node) && node.name) {
      functions.push(node.name.getText());
    }
    ts.forEachChild(node, visit);
  });

  vscode.window.showInformationMessage(
    `Variables: ${variables.join(", ") || "None"} | Functions: ${
      functions.join(", ") || "None"
    }`
  );
}
