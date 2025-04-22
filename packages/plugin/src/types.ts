export interface DependencyCycle {
  file: string;
  line: number;
  column: number;
  cyclePath: string[];
  codeContext?: string;
} 