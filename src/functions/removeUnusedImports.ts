import * as vscode from "vscode";
import * as ts from "typescript";

export function removeUnusedImports() {
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

  const usedIdentifiers = new Set<string>();

  // Collect all identifiers except imports
  function collectIdentifiers(node: ts.Node) {
    if (ts.isIdentifier(node)) {
      if (
        !ts.isImportClause(node.parent) &&
        !ts.isImportSpecifier(node.parent)
      ) {
        usedIdentifiers.add(node.text);
      }
    }
    ts.forEachChild(node, collectIdentifiers);
  }
  ts.forEachChild(sourceFile, collectIdentifiers);

  const edit = new vscode.WorkspaceEdit();
  const removedImports: string[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isImportDeclaration(node)) {
      return;
    }

    const importClause = node.importClause;
    if (!importClause) {
      return;
    }

    let removeEntire = false;
    const toRemove: string[] = [];

    // ----- Default import -----
    if (importClause.name && !usedIdentifiers.has(importClause.name.text)) {
      toRemove.push(importClause.name.text);
      // If there are no named imports, remove whole import
      if (!importClause.namedBindings) {
        removeEntire = true;
      }
    }

    // ----- Named imports -----
    if (
      importClause.namedBindings &&
      ts.isNamedImports(importClause.namedBindings)
    ) {
      const elements = importClause.namedBindings.elements;

      const usedElements = elements.filter((el) =>
        usedIdentifiers.has(el.name.text)
      );

      if (usedElements.length === 0) {
        // Nothing is used, remove entire import
        removeEntire = true;
        toRemove.push(...elements.map((el) => el.name.text));
      } else if (usedElements.length < elements.length) {
        // Only some are used, replace named imports
        const newText = usedElements.map((el) => el.name.text).join(", ");
        const start = elements[0].getFullStart();
        const end = elements[elements.length - 1].getEnd();
        const range = new vscode.Range(
          editor.document.positionAt(start),
          editor.document.positionAt(end)
        );
        edit.replace(editor.document.uri, range, newText);

        toRemove.push(
          ...elements
            .map((el) => el.name.text)
            .filter((name) => !usedIdentifiers.has(name))
        );
      }
    }

    // ----- Remove the entire import if necessary -----
    if (removeEntire) {
      const range = new vscode.Range(
        editor.document.positionAt(node.getFullStart()),
        editor.document.positionAt(node.getEnd())
      );
      edit.delete(editor.document.uri, range);
    }

    if (toRemove.length > 0) {
      removedImports.push(...toRemove);
    }
  });

  vscode.workspace.applyEdit(edit).then(() => {
    if (removedImports.length === 0) {
      vscode.window.showInformationMessage("No unused imports found!");
    } else {
      vscode.window.showInformationMessage(
        `Removed unused import(s): ${removedImports.join(" | ")}`
      );
    }
  });
}
