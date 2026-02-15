import { Skill, SkillManifest, SkillStatus } from './types';
import { logger } from '@/lib/logger';
import { auditSkill } from './audit';
import { supabaseSkill } from './supabase';

class SkillRegistry {
  private static instance: SkillRegistry;
  private skills: Map<string, Skill> = new Map();

  private constructor() {
    // Auto-register built-in skills
    this.register(auditSkill);
    this.register(supabaseSkill);
  }

  public static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  public register(skill: Skill) {
    this.skills.set(skill.id, skill);
    logger.info(`Skill registered: ${skill.name} (${skill.id})`, { status: skill.status });
  }

  public getSkill(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  public getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  public enableSkill(id: string): boolean {
    const skill = this.skills.get(id);
    if (skill) {
      skill.status = 'enabled';
      logger.info(`Skill enabled: ${skill.name}`);
      return true;
    }
    return false;
  }

  public disableSkill(id: string): boolean {
    const skill = this.skills.get(id);
    if (skill) {
      skill.status = 'disabled';
      logger.info(`Skill disabled: ${skill.name}`);
      return true;
    }
    return false;
  }
}

export const skillRegistry = SkillRegistry.getInstance();
