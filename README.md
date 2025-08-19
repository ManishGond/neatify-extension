# Neatify - Code Optimizer Extension

Clean, refactor, and optimize your JavaScript/TypeScript code in real-time 🚀

![Neatify Logo](images/icon.png)

## Features

Neatify provides powerful code optimization tools to keep your JavaScript and TypeScript code clean, efficient, and maintainable.

### 🔍 File Analysis

- Get comprehensive summaries of your code files
- Identify optimization opportunities at a glance

### � Remove Unused Code

- **Unused Imports**: Automatically detect and remove unused import statements
- **Unused Variables**: Clean up variables and declarations that aren't referenced

### 🔄 Code Refactoring

- **camelCase Conversion**: Standardize your code to follow camelCase naming conventions
- **Modern Declarations**: Convert outdated `var` declarations to modern `let`/`const`

### ⚡ Full File Optimization

- One-click optimization that applies all refactoring techniques
- Real-time optimization feedback in the sidebar

### 📊 Visual Interface

- Beautiful webview panel with quick access to all features
- Status updates and optimization results display
- Interactive buttons for all optimization commands

## Quick Start

1. **Open the Neatify Panel**: Click on the Neatify icon in the Explorer sidebar
2. **Run Optimizations**: Use the buttons in the panel or keyboard shortcuts:

   - `Ctrl+Alt+O` - Optimize Entire File
   - `Ctrl+Alt+I` - Remove Unused Imports
   - `Ctrl+Alt+U` - Remove Unused Variables
   - `Ctrl+Alt+C` - Refactor to camelCase
   - `Ctrl+Alt+V` - Convert var → let/const
   - `Ctrl+Alt+P` - Show File Summary

3. **View Results**: See optimization results directly in the Neatify panel

## Requirements

- Visual Studio Code version 1.103.0 or higher
- JavaScript or TypeScript files

## Extension Settings

Neatify currently works out of the box with default settings. Future versions may include configuration options for:

- Custom optimization rules
- File type specific optimizations
- Keyboard shortcut customization

## Known Issues

- Large files may take longer to process
- Some complex code patterns might require manual review after optimization
- Experimental: May not catch all edge cases in highly dynamic code

## Release Notes

### 0.0.1

Initial release of Neatify featuring:

- Unused import removal
- Unused variable detection and cleanup
- camelCase refactoring
- var to let/const conversion
- Complete file optimization
- Visual webview interface with real-time feedback
- Keyboard shortcuts for all operations

## Support

For issues, feature requests, or contributions, please visit our [GitHub repository](https://github.com/your-repo/neatify).

## License

MIT License - feel free to use and modify as needed.

---

**Enjoy cleaner, more efficient code with Neatify!**
