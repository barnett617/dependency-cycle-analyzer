export interface DependencyCycle {
  file: string;
  line: number;
  column: number;
  cyclePath: string[];
}

export function parseESLintOutput(output: string): DependencyCycle[] {
  const cycles: DependencyCycle[] = [];
  const lines = output.split('\n');
  
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const detectedCycle = line.includes('Dependency cycle detected')
    const detectedCycleVia = line.includes('Dependency cycle via')
    if (detectedCycle || detectedCycleVia) {
      // Extract file path and line number
      const fileMatch = line.match(/at (.+?):(\d+):(\d+)/);
      if (!fileMatch) continue;
      
      const [, file, lineNum, column] = fileMatch;
      
      // Extract cycle path
      const cyclePath: string[] = [];
      if (line.includes('via')) {
        const viaMatch = line.match(/via (.+?):/);
        if (viaMatch) {
          const path = viaMatch[1];
          cyclePath.push(...path.split('=>').map(p => p.trim()));
        }
      } else {
        // For direct cycles, extract from import statements
        let j = i + 1;
        while (j < lines.length && !lines[j].includes('warning:')) {
          const importMatch = lines[j].match(/import .+ from ['"](.+?)['"]/);
          if (importMatch) {
            cyclePath.push(importMatch[1]);
          }
          j++;
        }
      }
      
      if (cyclePath.length > 0) {
        cycles.push({
          file,
          line: parseInt(lineNum),
          column: parseInt(column),
          cyclePath
        });
      }
    }
  }
  
  return cycles;
} 