import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { scrapeWebsiteStyles } from "./websiteScraper";
import { createEmbed, getUserEmbeds, getEmbedById, updateEmbed, deleteEmbed } from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  scraper: router({
    scrapeWebsite: publicProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input }) => {
        const styles = await scrapeWebsiteStyles(input.url);
        return styles;
      }),
  }),

  embeds: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        beforeImage: z.object({
          data: z.string(), // base64
          mimeType: z.string(),
        }),
        afterImage: z.object({
          data: z.string(), // base64
          mimeType: z.string(),
        }),
        websiteUrl: z.string().optional(),
        colors: z.array(z.string()),
        fonts: z.array(z.string()),
        toggleStyle: z.string().default('switch'),
        width: z.number().default(600),
        height: z.number().default(400),
      }))
      .mutation(async ({ ctx, input }) => {
        // Upload images to S3
        const beforeBuffer = Buffer.from(input.beforeImage.data, 'base64');
        const afterBuffer = Buffer.from(input.afterImage.data, 'base64');
        
        const beforeKey = `embeds/${ctx.user.id}/before-${Date.now()}-${Math.random().toString(36).substring(7)}.${input.beforeImage.mimeType.split('/')[1]}`;
        const afterKey = `embeds/${ctx.user.id}/after-${Date.now()}-${Math.random().toString(36).substring(7)}.${input.afterImage.mimeType.split('/')[1]}`;
        
        const beforeUpload = await storagePut(beforeKey, beforeBuffer, input.beforeImage.mimeType);
        const afterUpload = await storagePut(afterKey, afterBuffer, input.afterImage.mimeType);
        
        // Create embed record
        await createEmbed({
          userId: ctx.user.id,
          name: input.name,
          beforeImageUrl: beforeUpload.url,
          beforeImageKey: beforeKey,
          afterImageUrl: afterUpload.url,
          afterImageKey: afterKey,
          websiteUrl: input.websiteUrl || null,
          colors: input.colors,
          fonts: input.fonts,
          toggleStyle: input.toggleStyle,
          width: input.width,
          height: input.height,
        });
        
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserEmbeds(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const embed = await getEmbedById(input.id);
        if (!embed || embed.userId !== ctx.user.id) {
          throw new Error('Embed not found');
        }
        return embed;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        colors: z.array(z.string()).optional(),
        fonts: z.array(z.string()).optional(),
        toggleStyle: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const embed = await getEmbedById(input.id);
        if (!embed || embed.userId !== ctx.user.id) {
          throw new Error('Embed not found');
        }
        
        const { id, ...updates } = input;
        await updateEmbed(id, updates);
        
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const embed = await getEmbedById(input.id);
        if (!embed || embed.userId !== ctx.user.id) {
          throw new Error('Embed not found');
        }
        
        await deleteEmbed(input.id);
        return { success: true };
      }),

    getEmbedCode: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const embed = await getEmbedById(input.id);
        if (!embed) {
          throw new Error('Embed not found');
        }
        
        // Generate embed code
        const embedCode = generateEmbedCode(embed);
        return { code: embedCode };
      }),
  }),
});

export type AppRouter = typeof appRouter;

function generateEmbedCode(embed: any): string {
  const primaryColor = embed.colors[0] || '#3b82f6';
  const fontFamily = embed.fonts[0] || 'Arial, sans-serif';
  
  return `<!-- Before/After Embed -->
<div id="before-after-embed-${embed.id}" style="width: ${embed.width}px; max-width: 100%; margin: 0 auto; font-family: ${fontFamily};"></div>
<script>
(function() {
  const container = document.getElementById('before-after-embed-${embed.id}');
  
  const styles = \`
    .ba-container { position: relative; width: 100%; height: ${embed.height}px; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .ba-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    .ba-toggle { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10; background: ${primaryColor}; color: white; border: none; padding: 12px 24px; border-radius: 24px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.3s; }
    .ba-toggle:hover { transform: translateX(-50%) translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .ba-label { position: absolute; top: 20px; background: rgba(0,0,0,0.7); color: white; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .ba-label.before { left: 20px; }
    .ba-label.after { right: 20px; }
  \`;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  let showingAfter = false;
  
  container.innerHTML = \`
    <div class="ba-container">
      <img class="ba-image" src="${embed.beforeImageUrl}" alt="Before" id="ba-img-${embed.id}">
      <div class="ba-label before" id="ba-label-${embed.id}">BEFORE</div>
      <button class="ba-toggle" id="ba-btn-${embed.id}">Show After</button>
    </div>
  \`;
  
  const img = document.getElementById('ba-img-${embed.id}');
  const btn = document.getElementById('ba-btn-${embed.id}');
  const label = document.getElementById('ba-label-${embed.id}');
  
  btn.addEventListener('click', function() {
    showingAfter = !showingAfter;
    img.src = showingAfter ? '${embed.afterImageUrl}' : '${embed.beforeImageUrl}';
    btn.textContent = showingAfter ? 'Show Before' : 'Show After';
    label.textContent = showingAfter ? 'AFTER' : 'BEFORE';
    label.className = showingAfter ? 'ba-label after' : 'ba-label before';
  });
})();
</script>`;
}

