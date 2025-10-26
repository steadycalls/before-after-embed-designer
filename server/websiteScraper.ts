import puppeteer from 'puppeteer';

export interface ScrapedStyles {
  colors: string[];
  fonts: string[];
}

export async function scrapeWebsiteStyles(url: string): Promise<ScrapedStyles> {
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Navigate to the URL with timeout
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Extract colors and fonts from the page
    const styles = await page.evaluate(() => {
      const colors = new Set<string>();
      const fonts = new Set<string>();
      
      // Get all elements
      const elements = document.querySelectorAll('*');
      
      elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        
        // Extract colors
        const bgColor = computedStyle.backgroundColor;
        const textColor = computedStyle.color;
        const borderColor = computedStyle.borderColor;
        
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          colors.add(bgColor);
        }
        if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
          colors.add(textColor);
        }
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
          colors.add(borderColor);
        }
        
        // Extract fonts
        const fontFamily = computedStyle.fontFamily;
        if (fontFamily) {
          // Split by comma and clean up
          fontFamily.split(',').forEach(font => {
            const cleanFont = font.trim().replace(/['"]/g, '');
            if (cleanFont && !cleanFont.includes('system-ui') && !cleanFont.includes('generic')) {
              fonts.add(cleanFont);
            }
          });
        }
      });
      
      return {
        colors: Array.from(colors).slice(0, 10), // Limit to 10 most common colors
        fonts: Array.from(fonts).slice(0, 5), // Limit to 5 most common fonts
      };
    });
    
    // Convert RGB colors to hex
    const hexColors = styles.colors.map(color => rgbToHex(color)).filter(Boolean) as string[];
    
    return {
      colors: Array.from(new Set(hexColors)), // Remove duplicates
      fonts: styles.fonts,
    };
    
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website styles');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function rgbToHex(rgb: string): string | null {
  // Handle rgba and rgb
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  
  if (!match) {
    return null;
  }
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

