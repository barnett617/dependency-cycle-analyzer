export interface DependencyCycle {
  file: string;
  line: number;
  column: number;
  cyclePath: string[];
  codeContext?: string;
}

export function parseESLintOutput(output: string): DependencyCycle[] {
  const cycles: DependencyCycle[] = [];
  const lines = output.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Dependency cycle detected') || line.includes('Dependency cycle via')) {
      // Extract file path and line number
      const fileMatch = line.match(/at (.+?):(\d+):(\d+)/);
      if (!fileMatch) continue;
      
      const [, file, lineNum, column] = fileMatch;
      
      // Extract cycle path
      const cyclePath: string[] = [];
      const codeContext: string[] = [];
      
      if (line.includes('Dependency cycle via')) {
        // Handle "via" cycles
        const viaMatch = line.match(/Dependency cycle via (.*?) at/);
        if (viaMatch && viaMatch[1]) {
          // Split the path and clean up any line numbers
          const pathParts = viaMatch[1].split(' -> ').map(part => {
            // Remove any line numbers (e.g., "@/router/modules/main:10" -> "@/router/modules/main")
            return part.split(':')[0];
          });
          cyclePath.push(...pathParts);
          // Add the current file to complete the cycle
          cyclePath.push(file);
        }
      } else {
        // Handle regular cycles
        let j = i + 1;
        while (j < lines.length && !lines[j].includes('warning:')) {
          const importMatch = lines[j].match(/import .+ from ['"](.+?)['"]/);
          if (importMatch) {
            const importPath = importMatch[1];
            // Convert relative imports to absolute paths
            const absolutePath = importPath.startsWith('.') 
              ? `${file.split('/').slice(0, -1).join('/')}/${importPath}`
              : importPath;
            cyclePath.push(absolutePath);
          }
          codeContext.push(lines[j].trim());
          j++;
        }
        // Add the current file to complete the cycle
        cyclePath.push(file);
      }
      
      if (cyclePath.length > 1) {
        cycles.push({
          file,
          line: parseInt(lineNum),
          column: parseInt(column),
          cyclePath,
          codeContext: codeContext.join('\n')
        });
      }
    }
  }
  
  return cycles;
} 