'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowing, unfollowUser, FollowingResponse } from "@/lib/queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/definitions";

export default function FollowingPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<FollowingResponse>({
    queryKey: ["following"],
    queryFn: getFollowing,
    staleTime: 0,
  });

  const mutation = useMutation<{ message: string }, Error, string, { previous?: FollowingResponse }>({
    mutationFn: unfollowUser,
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ["following"] });
      const previous = queryClient.getQueryData<FollowingResponse>(["following"]);
      queryClient.setQueryData<FollowingResponse | undefined>(["following"], (old) => {
        if (!old) return old;
        return {
          ...old,
          following: old.following.filter((u: User) => u._id !== userId),
        };
      });
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["following"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg shadow-sm border border-border p-4 flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 max-w-2xl mx-auto text-red-500">{(error as Error).message}</div>;
  }

  const following = data?.following || [];

  if (following.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center text-muted-foreground">
          <p>No sigues a nadie todavía.</p>
          <p>Explora el feed y comienza a seguir a usuarios interesantes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-3">
        {following.map((user: User) => (
          <div key={user._id} className="bg-card rounded-lg shadow-sm border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 relative">
              {user.avatar?.imageUrl ? (
                <Image
                  src={user.avatar.imageUrl}
                  alt={user.name || "avatar"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => mutation.mutate(user._id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Quitando..." : "Dejar de seguir"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}