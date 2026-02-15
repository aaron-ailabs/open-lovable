import { logger } from './logger';

export interface ProjectContext {
  framework: 'react' | 'nextjs' | 'vue' | 'svelte' | 'unknown';
  dependencies: string[];
  recentChanges: string[];
}

export class Companion {
  public static async analyzeContext(files: string[]): Promise<ProjectContext> {
    const context: ProjectContext = {
      framework: 'unknown',
      dependencies: [],
      recentChanges: []
    };

    // Detection logic
    if (files.some(f => f.includes('next.config'))) context.framework = 'nextjs';
    else if (files.some(f => f.includes('vite.config'))) context.framework = 'react';

    logger.debug('Companion context analyzed', { framework: context.framework });
    return context;
  }

  public static suggestWorkflows(context: ProjectContext): string[] {
    const suggestions: string[] = [];

    if (context.framework === 'nextjs') {
      suggestions.push('Add a new API route for data fetching');
      suggestions.push('Implement a shared layout component');
    }

    if (!context.dependencies.includes('supabase')) {
      suggestions.push('Add Supabase skill for backend and auth');
    }

    return suggestions;
  }

  public static generatePrompt(userRequest: string, context: ProjectContext): string {
    return `
      System: You are Space Companion, an expert AI agent.
      Context: User is building a ${context.framework} application.
      User Request: ${userRequest}
      Task: Provide a concise, brutalist-style guidance or code snippet.
    `;
  }
}
