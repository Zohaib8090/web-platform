'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCategories } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const categories = getCategories();

const publishSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  videoUrl: z.string().url('Please enter a valid video URL.'),
  category: z.string().min(1, 'Please select a category.'),
});

function PublishPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof publishSchema>>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      title: '',
      description: '',
      videoUrl: '',
      category: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  async function onSubmit(values: z.infer<typeof publishSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to publish a video.',
      });
      return;
    }
    
    const randomThumbnail = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

    const videoData = {
      ...values,
      uploaderId: user.uid,
      duration: 'N/A', // We can't know the duration from a URL
      thumbnailUrl: randomThumbnail.imageUrl,
      imageHint: randomThumbnail.imageHint,
    };

    try {
      const videosCollection = collection(firestore, 'videos');
      await addDocumentNonBlocking(videosCollection, videoData);

      toast({
        title: 'Video Published!',
        description: `"${values.title}" is now live.`,
      });
      router.push('/');
    } catch (error) {
      console.error('Error publishing video:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not publish video. Please try again.',
      });
    }
  }

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Publish Your Video</CardTitle>
          <CardDescription>Fill out the form below to share your content with the world.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your video..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide a direct link to a video file (e.g., .mp4).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Publishing...' : 'Publish Video'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// A helper hook because React.use can't be used in the same component as useEffect
function useEffectState<T>(initialValue: T): [T, (newValue: T) => void] {
    const [state, setState] = use(
        (async () => {
            return {
                value: initialValue,
                setValue: (newValue: T) => {
                    // This is a dummy function, the real one is below
                },
            };
        })()
    );
    const [value, setValue] = useState(state.value);
    state.setValue = setValue;
    return [value, setValue];
}


export default PublishPage;
