export type SkillStatus = 'enabled' | 'disabled' | 'available';

export interface SkillCommand {
  name: string;
  description: string;
  usage: string;
  action: (args: string[]) => Promise<any>;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  commands: SkillCommand[];
  config?: Record<string, any>;
  status: SkillStatus;
}

export interface SkillManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  commands: {
    name: string;
    description: string;
    usage: string;
  }[];
}
