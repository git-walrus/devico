import { Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  location: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Divesh Baruah",
    rating: 5,
    text: "I was in awe of the design and craftsmanship of the clothing , I had the best experience with Devico and I absolutely can't wait to purchase more clothing. Excellent service and excellent clothing.",
    location: "San Francisco, CA"
  },
  {
    id: 2,
    name: "Antara Borthakur",
    rating: 5,
    text: "Absolutely love all the dresses.The fabrics feels incredibly soft and breathable, just as described. It's stylish, comfortable, and perfect for any season. Definitely impressed with the quality and fit — looking forward to exploring more pieces from DeviCo!",
    location: "Austin, TX"
  },
  {
    id: 3,
    name: "Sanjukta",
    rating: 5,
    text: "I got the best complements for the fabric. And the print too. The set was my go-to outfit last summer and hopefully this one too.",
    location: "New York, NY"
  },
  {
    id: 4,
    name: "Angshuman Kalita",
    rating: 5,
    text: "Every piece I've purchased feels thoughtfully designed and well-crafted, which really stands out.",
    location: "Seattle, WA"
  },
  {
    id: 5,
    name: "Rupa",
    rating: 5,
    text: "One of the finest designers. She knows me so well. Linen clothes designed perfect to fil us all. She has magic in her hands. I like her creativity. God bless the entire team of DeviCo",
    location: "Miami, FL"
  },
  {
    id: 6,
    name: "Deekshita Baruah",
    rating: 5,
    text: "Love the brand for making premium quality sustainable clothing. Love the designs too!",
    location: "Chicago, IL"
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function CustomerReviews() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 tracking-wide">
            Reviews from our customers:
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what our community has to say about their DevīCo experience
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Text */}
                <blockquote className="text-gray-700 mb-6 flex-1 italic">
                  "{review.text}"
                </blockquote>

                {/* Customer Info */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="flex">
                <StarRating rating={5} />
              </div>
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>Over 1,000+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>Trusted Since 2023</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}