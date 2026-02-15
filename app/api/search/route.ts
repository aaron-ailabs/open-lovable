import { NextRequest, NextResponse } from 'next/server';
import { SearchSchema } from '@/lib/validations';
import { ValidationError, AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validation = SearchSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.format();
      logger.warn('Validation failed for search', { details });
      throw new ValidationError('Invalid request data', details);
    }

    const { query } = validation.data;

    logger.info('Performing Firecrawl search', { query });

    // Use Firecrawl search to get top 10 results with screenshots
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        limit: 10,
        scrapeOptions: {
          formats: ['markdown', 'screenshot'],
          onlyMainContent: true,
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      logger.error('Firecrawl search failed', new Error(errorText));
      throw new AppError('Firecrawl search service unavailable', 502, 'SEARCH_SERVICE_ERROR');
    }

    const searchData = await searchResponse.json();
    
    // Format results with screenshots and markdown
    const results = searchData.data?.map((result: any) => ({
      url: result.url,
      title: result.title || result.url,
      description: result.description || '',
      screenshot: result.screenshot || null,
      markdown: result.markdown || '',
    })) || [];

    logger.info('Search successful', { resultCount: results.length });
    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.statusCode }
      );
    }

    logger.error('Unexpected error in search', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}