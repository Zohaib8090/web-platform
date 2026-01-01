'use server';

/**
 * @fileOverview Personalized video recommendations based on viewing history.
 *
 * - recommendVideos - A function that recommends videos based on user viewing history.
 * - RecommendVideosInput - The input type for the recommendVideos function.
 * - RecommendVideosOutput - The return type for the recommendVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendVideosInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('An array of video titles the user has watched.'),
  category: z.string().optional().describe('Optional category to refine suggestions.'),
  numRecommendations: z
    .number()
    .default(5)
    .describe('The number of video recommendations to return.'),
});
export type RecommendVideosInput = z.infer<typeof RecommendVideosInputSchema>;

const RecommendVideosOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of recommended video titles.'),
});
export type RecommendVideosOutput = z.infer<typeof RecommendVideosOutputSchema>;

export async function recommendVideos(
  input: RecommendVideosInput
): Promise<RecommendVideosOutput> {
  return recommendVideosFlow(input);
}

const recommendVideosPrompt = ai.definePrompt({
  name: 'recommendVideosPrompt',
  input: {schema: RecommendVideosInputSchema},
  output: {schema: RecommendVideosOutputSchema},
  prompt: `You are a video recommendation expert. Given a user's viewing history,
you will recommend a list of videos they might enjoy. Only recommend videos
that are different from the viewing history.

Viewing History:
{{#each viewingHistory}}- {{{this}}}
{{/each}}

{{#if category}}
The user is interested in the following category: {{category}}.
Only recommend videos from this category.
{{/if}}


Number of Recommendations: {{numRecommendations}}

Recommendations:`,
});

const recommendVideosFlow = ai.defineFlow(
  {
    name: 'recommendVideosFlow',
    inputSchema: RecommendVideosInputSchema,
    outputSchema: RecommendVideosOutputSchema,
  },
  async input => {
    const {output} = await recommendVideosPrompt(input);
    return output!;
  }
);
