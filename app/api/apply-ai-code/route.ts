import { NextRequest, NextResponse } from 'next/server';
import { parseAIResponse, applyCodeToSandbox } from '@/lib/spaceApplyService';
import { ApplyAICodeSchema } from '@/lib/validations';
import { ValidationError, AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import type { SandboxState } from '@/types/sandbox';
import type { ConversationState } from '@/types/conversation';

declare global {
  var conversationState: ConversationState | null;
  var activeSandbox: any;
  var activeSandboxProvider: any;
  var existingFiles: Set<string>;
  var sandboxState: SandboxState;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = ApplyAICodeSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.format();
      logger.warn('Validation failed for apply-ai-code', { details });
      throw new ValidationError('Invalid request data', details);
    }

    const { response, isEdit, packages } = validation.data;
    
    const parsed = parseAIResponse(response);
    const morphEnabled = Boolean(isEdit && process.env.MORPH_API_KEY);
    
    if (!global.existingFiles) global.existingFiles = new Set<string>();
    const sandbox = global.activeSandbox || global.activeSandboxProvider;
    
    if (!sandbox) {
      logger.info('No active sandbox found, returning parsed files only');
      return NextResponse.json({
        success: true,
        results: {
          filesCreated: parsed.files.map(f => f.path),
          packagesInstalled: parsed.packages,
          commandsExecuted: parsed.commands,
          errors: []
        },
        explanation: parsed.explanation,
        structure: parsed.structure,
        parsedFiles: parsed.files,
        message: `Parsed ${parsed.files.length} files successfully. Create a sandbox to apply them.`
      });
    }

    const results = await applyCodeToSandbox(sandbox, parsed, isEdit, morphEnabled, response);
    
    return NextResponse.json({
      success: true,
      results,
      explanation: parsed.explanation,
      structure: parsed.structure,
      message: `Applied ${results.filesCreated.length} files successfully`
    });
    
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.statusCode }
      );
    }

    logger.error('Unexpected error in apply-ai-code', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}