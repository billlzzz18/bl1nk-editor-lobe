#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to validate import/export consistency across the project
 */

class ImportExportValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesChecked: 0,
      exportsFound: 0,
      importsFound: 0,
      brokenImports: 0
    };
  }

  // Get all TypeScript/JavaScript files
  getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
    let files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!item.startsWith('.') && item !== 'node_modules') {
          files = files.concat(this.getAllFiles(fullPath, extensions));
        }
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Extract exports from a file
  extractExports(content) {
    const exports = [];
    
    // Named exports
    const namedExportRegex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      exports.push({
        type: 'named',
        name: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }

    // Default exports
    const defaultExportRegex = /export\s+default\s+(\w+)/g;
    while ((match = defaultExportRegex.exec(content)) !== null) {
      exports.push({
        type: 'default',
        name: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }

    // Export assignments
    const exportAssignmentRegex = /export\s*=\s*(\w+)/g;
    while ((match = exportAssignmentRegex.exec(content)) !== null) {
      exports.push({
        type: 'assignment',
        name: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }

    return exports;
  }

  // Extract imports from a file
  extractImports(content) {
    const imports = [];
    
    // ES6 imports
    const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        type: 'named',
        source: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }

    // Side-effect imports
    const sideEffectRegex = /import\s+['"]([^'"]+)['"]/g;
    while ((match = sideEffectRegex.exec(content)) !== null) {
      imports.push({
        type: 'side-effect',
        source: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }

    return imports;
  }

  // Check if import path exists
  checkImportPath(importPath, currentFile) {
    if (importPath.startsWith('@/')) {
      // Handle path aliases
      const relativePath = importPath.replace('@/', 'src/');
      const fullPath = path.resolve(path.dirname(currentFile), relativePath);
      
      if (fs.existsSync(fullPath)) {
        return { exists: true, resolved: fullPath };
      }
      
      // Try with extensions
      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
      for (const ext of extensions) {
        const extPath = fullPath + ext;
        if (fs.existsSync(extPath)) {
          return { exists: true, resolved: extPath };
        }
      }
      
      return { exists: false, resolved: fullPath };
    }
    
    // Relative imports
    const fullPath = path.resolve(path.dirname(currentFile), importPath);
    
    if (fs.existsSync(fullPath)) {
      return { exists: true, resolved: fullPath };
    }
    
    // Try with extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    for (const ext of extensions) {
      const extPath = fullPath + ext;
      if (fs.existsSync(extPath)) {
        return { exists: true, resolved: extPath };
      }
      
      // Try index files
      const indexPath = path.join(fullPath, 'index' + ext);
      if (fs.existsSync(indexPath)) {
        return { exists: true, resolved: indexPath };
      }
    }
    
    return { exists: false, resolved: fullPath };
  }

  // Validate file
  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.stats.filesChecked++;
      
      const exports = this.extractExports(content);
      const imports = this.extractImports(content);
      
      this.stats.exportsFound += exports.length;
      this.stats.importsFound += imports.length;
      
      // Check imports
      for (const imp of imports) {
        const result = this.checkImportPath(imp.source, filePath);
        if (!result.exists) {
          this.errors.push({
            file: filePath,
            line: imp.line,
            type: 'broken-import',
            message: `Import "${imp.source}" cannot be resolved`,
            suggestion: `Check if the file exists or if the path is correct`
          });
          this.stats.brokenImports++;
        }
      }
      
      // Check for unused exports (basic check)
      const exportNames = exports.map(e => e.name);
      const contentWithoutExports = content.replace(/export\s+/g, '');
      
      for (const exp of exports) {
        const regex = new RegExp(`\\b${exp.name}\\b`, 'g');
        const matches = contentWithoutExports.match(regex);
        
        // If export is only used once (the export statement itself), it might be unused
        if (matches && matches.length <= 1) {
          this.warnings.push({
            file: filePath,
            line: exp.line,
            type: 'unused-export',
            message: `Export "${exp.name}" might be unused`,
            suggestion: `Consider removing unused exports to reduce bundle size`
          });
        }
      }
      
    } catch (error) {
      this.errors.push({
        file: filePath,
        type: 'read-error',
        message: `Failed to read file: ${error.message}`
      });
    }
  }

  // Run validation
  validate(projectRoot = process.cwd()) {
    console.log('🔍 Starting import/export validation...\n');
    
    const srcDir = path.join(projectRoot, 'src');
    const files = this.getAllFiles(srcDir);
    
    console.log(`📁 Found ${files.length} files to check\n`);
    
    for (const file of files) {
      this.validateFile(file);
    }
    
    this.printResults();
  }

  // Print results
  printResults() {
    console.log('\n📊 Validation Results:');
    console.log(`Files checked: ${this.stats.filesChecked}`);
    console.log(`Exports found: ${this.stats.exportsFound}`);
    console.log(`Imports found: ${this.stats.importsFound}`);
    console.log(`Broken imports: ${this.stats.brokenImports}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => {
        console.log(`  ${error.file}:${error.line} - ${error.message}`);
        if (error.suggestion) {
          console.log(`    💡 ${error.suggestion}`);
        }
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`  ${warning.file}:${warning.line} - ${warning.message}`);
        if (warning.suggestion) {
          console.log(`    💡 ${warning.suggestion}`);
        }
      });
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All imports and exports are valid!');
    }
    
    // Exit with error code if there are errors
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

// Run if called directly
if (require.main === module) {
  const validator = new ImportExportValidator();
  validator.validate();
}

module.exports = ImportExportValidator;