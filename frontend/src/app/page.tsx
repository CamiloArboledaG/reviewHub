import ReviewCard from "@/components/ReviewCard";

const reviews = [
  {
    user: {
      name: 'Maria García',
      handle: 'maria_reviews',
      avatarUrl: '',
    },
    postTime: '2h',
    category: {
      slug: 'game' as const,
    },
    item: {
      title: 'The Last of Us Part II',
      imageUrl: '',
    },
    rating: {
      value: 4.5,
      max: 5,
    },
    content: 'Una obra maestra emocional que redefine lo que puede ser un videojuego. La narrativa es profunda y los personajes están increíblemente desarrollados.',
    likes: 24,
    comments: 8,
    isFollowing: false,
  },
  {
    user: {
      name: 'Carlos Mendez',
      handle: 'carlos_critic',
      avatarUrl: '',
    },
    postTime: '4h',
    category: {
      slug: 'movie' as const,
    },
    item: {
      title: 'Dune',
      imageUrl: '',
    },
    rating: {
      value: 5,
      max: 5,
    },
    content: 'Villeneuve logra adaptar lo imposible. Visualmente espectacular y narrativamente sólida. Una experiencia cinematográfica única.',
    likes: 156,
    comments: 23,
    isFollowing: true,
  },
  {
    user: {
      name: 'Carlos Mendez',
      handle: 'carlos_critic',
      avatarUrl: '',
    },
    postTime: '4h',
    category: {
      slug: 'book' as const,
    },
    item: {
      title: 'Dune',
      imageUrl: '',
    },
    rating: {
      value: 5,
      max: 5,
    },
    content: 'Villeneuve logra adaptar lo imposible. Visualmente espectacular y narrativamente sólida. Una experiencia cinematográfica única.',
    likes: 156,
    comments: 23,
    isFollowing: true,
  },
];

export default function Home() {
  return (
    <div className="p-8">
      <div className="flex flex-col items-center gap-8">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </div>
  );
}
