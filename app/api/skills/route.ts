import { NextRequest, NextResponse } from 'next/server';
import { skillRegistry } from '@/lib/skills/registry';
import { auditSkill } from '@/lib/skills/audit';
import { logger } from '@/lib/logger';
import { ValidationError, AppError } from '@/lib/errors';
import { z } from 'zod';

// Initialize with built-in skills
skillRegistry.register(auditSkill);

const SkillCommandSchema = z.object({
  skillId: z.string(),
  command: z.string(),
  args: z.array(z.string()).optional().default([]),
});

export async function GET() {
  const skills = skillRegistry.getAllSkills().map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    status: s.status,
    commands: s.commands.map(c => ({
      name: c.name,
      description: c.description,
      usage: c.usage
    }))
  }));

  return NextResponse.json({ success: true, skills });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = SkillCommandSchema.safeParse(body);
    
    if (!validation.success) {
      throw new ValidationError('Invalid skill command', validation.error.format());
    }

    const { skillId, command, args } = validation.data;
    const skill = skillRegistry.getSkill(skillId);

    if (!skill) {
      throw new AppError(`Skill not found: ${skillId}`, 404, 'SKILL_NOT_FOUND');
    }

    const cmd = skill.commands.find(c => c.name === command);
    if (!cmd) {
      throw new AppError(`Command not found: ${command} for skill ${skillId}`, 404, 'COMMAND_NOT_FOUND');
    }

    logger.info('Executing skill command', { skillId, command });
    const result = await cmd.action(args);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    logger.error('Skill execution failed', error);
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
