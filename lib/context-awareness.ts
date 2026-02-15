import { ProjectContext } from './companion';
import { skillRegistry } from './skills/registry';
import { logger } from './logger';

export class ContextAwareness {
  public static async adaptToContext(context: ProjectContext) {
    logger.info(`Adapting Space to project context: ${context.framework}`);

    // Enable framework-specific skills
    if (context.framework === 'nextjs') {
      skillRegistry.enableSkill('audit'); // Audit is universal
      // In the future: skillRegistry.enableSkill('next-optimizer');
    }

    if (context.dependencies.includes('supabase')) {
      // skillRegistry.enableSkill('supabase');
    }
  }

  public static getBrutalistPrompt(context: ProjectContext): string {
    return `
      [CONTEXT]
      FRAMEWORK: ${context.framework.toUpperCase()}
      AESTHETIC: BRUTALIST_OLED
      RULES: STARK_CONTRAST, MONO_ONLY, NO_SHADOWS, BOLD_BORDERS
      [SYSTEM]
      Generate code that adheres to these constraints. Focus on clarity and technical correctness.
    `;
  }
}
