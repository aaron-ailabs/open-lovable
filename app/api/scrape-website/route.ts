import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from '@mendable/firecrawl-js';
import { ScrapeWebsiteSchema } from '@/lib/validations';
import { ValidationError, AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = ScrapeWebsiteSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.format();
      logger.warn('Validation failed for scrape-website', { details });
      throw new ValidationError('Invalid request data', details);
    }

    const { url } = validation.data;
    const formats = body.formats || ['markdown', 'html'];
    const options = body.options || {};
    
    logger.info('Starting website scrape', { url });
    
    // Initialize Firecrawl with API key from environment
    const apiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!apiKey) {
      logger.warn("FIRECRAWL_API_KEY not configured, returning mock data");
      return NextResponse.json({
        success: true,
        data: {
          title: "Example Website",
          content: `This is a mock response for ${url}. Configure FIRECRAWL_API_KEY to enable real scraping.`,
          description: "A sample website",
          markdown: `# Example Website\n\nThis is mock content for demonstration purposes.`,
          html: `<h1>Example Website</h1><p>This is mock content for demonstration purposes.</p>`,
          metadata: {
            title: "Example Website",
            description: "A sample website",
            sourceURL: url,
            statusCode: 200
          }
        }
      });
    }
    
    const app = new FirecrawlApp({ apiKey });
    
    // Scrape the website using the latest SDK patterns
    const scrapeResult = await app.scrape(url, {
      formats: formats,
      onlyMainContent: options.onlyMainContent !== false,
      waitFor: options.waitFor || 2000,
      timeout: options.timeout || 30000,
      ...options
    });
    
    const result = scrapeResult as any;
    if (result.success === false) {
      logger.error('Firecrawl scrape failed', new Error(result.error), { url });
      throw new AppError(result.error || "Failed to scrape website", 502, 'SCRAPE_SERVICE_ERROR');
    }
    
    const data = result.data || result;
    
    logger.info('Scrape successful', { url, title: data?.metadata?.title });
    return NextResponse.json({
      success: true,
      data: {
        title: data?.metadata?.title || "Untitled",
        content: data?.markdown || data?.html || "",
        description: data?.metadata?.description || "",
        markdown: data?.markdown || "",
        html: data?.html || "",
        metadata: data?.metadata || {},
        screenshot: data?.screenshot || null,
        links: data?.links || [],
        raw: data
      }
    });
    
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.statusCode }
      );
    }

    logger.error('Unexpected error in scrape-website', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}