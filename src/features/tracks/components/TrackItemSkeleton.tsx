import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function TrackItemSkeleton() {
  return (
    <Card>
      <CardContent className="py-2">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-md" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
