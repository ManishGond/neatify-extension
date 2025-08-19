import * as vscode from "vscode";
import * as ts from "typescript";

function isCamelCase(name: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(name);
}

function toCamelCase(name: string): string {
  return name
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

export function refactorToCamelCase() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const fileText = editor.document.getText();
  const sourceFile = ts.createSourceFile(
    editor.document.fileName,
    fileText,
    ts.ScriptTarget.Latest,
    true
  );

  const replacements: { oldName: string; newName: string }[] = [];

  function visit(node: ts.Node) {
    if (
      (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      const name = node.name.text;
      if (!isCamelCase(name)) {
        replacements.push({ oldName: name, newName: toCamelCase(name) });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (replacements.length === 0) {
    vscode.window.showInformationMessage("All names are already camelCase!");
    return;
  }

  // Apply replacements safely in reverse order to not break positions
  const edit = new vscode.WorkspaceEdit();
  replacements.reverse().forEach(({ oldName, newName }) => {
    const regex = new RegExp(`\\b${oldName}\\b`, "g");
    let match;
    while ((match = regex.exec(fileText)) !== null) {
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(match.index + oldName.length);
      edit.replace(
        editor.document.uri,
        new vscode.Range(startPos, endPos),
        newName
      );
    }
  });

  vscode.workspace.applyEdit(edit).then(() => {
    vscode.window.showInformationMessage(
      `Renamed ${replacements.length} variable/function(s) to camelCase.`
    );
  });
}
